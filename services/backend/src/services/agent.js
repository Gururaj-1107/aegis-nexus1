const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const { translateToEnglishIfNeeded } = require('./translation');
require('dotenv').config();

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

const SYSTEM_PROMPT = `You are Aegis AI, a highly efficient NGO resource dispatch agent.
Your role is to analyze incoming requests from field volunteers or handwritten documents and extract the key operational parameters.
Always respond with strict JSON matching this exact schema:
{
  "skill": "MEDIC | FOOD_AID | EVAC | SUPPLY | SECURITY | UNKNOWN",
  "lat": <float>,
  "lng": <float>,
  "urgency": "LOW | MEDIUM | HIGH | CRITICAL",
  "quantity": <int>,
  "summary": "<concise 1-sentence human summary>",
  "estimatedResponseMinutes": <int>
}
No markdown. No explanation. Only valid JSON.`;

async function processRequestWithAgent(textOrParsedJSON) {
  // Try Gemini first, fall back to Vertex AI stub
  if (!GEMINI_KEY || GEMINI_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    console.warn('[Agent] No Gemini API key — using fallback stub');
    return getFallbackResponse();
  }

  try {
    // Stage 1: Native Auto-Translation via Google Cloud API
    const inputString = typeof textOrParsedJSON === 'string' ? textOrParsedJSON : JSON.stringify(textOrParsedJSON);
    console.log('[Agent Pipeline] Passing through translation matrix...');
    const translatedText = await translateToEnglishIfNeeded(inputString);

    // Stage 2: Structural Extraction via Gemini 2.0 Flash
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${SYSTEM_PROMPT}\n\nRequest: ${translatedText}` }]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 512,
        responseMimeType: 'application/json'
      }
    };

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error(`[Agent] Gemini API error ${response.status}`);
      return getFallbackResponse();
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);
    
    console.log('[Agent] Gemini processed structural logic:', parsed);
    return parsed;

  } catch (error) {
    console.error('[Agent] Processing error:', error.message);
    return getFallbackResponse();
  }
}

/**
 * Executes a conversational Agent process with Function Calling to 
 * ping database locations or the RAG KnowledgeBase dynamically.
 */
async function queryGeminiChat(messages, systemContext = '', prisma) {
  if (!GEMINI_KEY || GEMINI_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    return { reply: 'Gemini API key not configured. Please set GEMINI_API_KEY in your .env file.', toolLogs: [] };
  }

  const toolLogs = [];
  
  // Format conversational buffer
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  if (systemContext) {
    contents.unshift({ role: 'user', parts: [{ text: systemContext }] });
    contents.splice(1, 0, { role: 'model', parts: [{ text: 'Understood. I am online.' }] });
  }

  // Define Agentic Tool Schema (Function Calling)
  const tools = [{
    functionDeclarations: [
      {
        name: "lookup_medic_locations",
        description: "Fetch live lat/lng locations of active Medic volunteers to decide deployment proximity.",
        parameters: { type: "OBJECT", properties: { zone: { type: "STRING", description: "The zone to query" } } }
      },
      {
        name: "query_knowledge_base",
        description: "Perform a RAG vector search across NGO operating guidelines, response protocols, and emergency documents.",
        parameters: { type: "OBJECT", properties: { 
          query: { type: "STRING", description: "The specific emergency question to search for" } 
        }, required: ["query"] }
      }
    ]
  }];

  try {
    const payload = {
      contents,
      tools,
      generationConfig: { temperature: 0.3, maxOutputTokens: 1024 }
    };

    let response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    let data = await response.json();
    let messageContent = data.candidates?.[0]?.content;
    let parts = messageContent?.parts || [];

    // Stage 2: Tool Execution Loop
    let finalReply = "No response";

    for (const part of parts) {
      if (part.functionCall) {
        const fnName = part.functionCall.name;
        const fnArgs = part.functionCall.args;
        console.log(`[Agent] Calling executing function: ${fnName}`, fnArgs);
        
        let functionResponse = {};

        // Execute actual Database or RAG Logic
        if (fnName === 'lookup_medic_locations') {
           toolLogs.push("Agent tracking live Medics...");
           try {
             // Example Prisma lookups
             const volunteers = await prisma.volunteer.findMany({
               take: 3, select: { first_name: true, current_lat: true, current_lng: true, status: true }
             });
             functionResponse = { medics: volunteers };
           } catch {
             functionResponse = { medics: "Database connection failed, assuming 2 medics at Zone Alpha." };
           }
        } 
        else if (fnName === 'query_knowledge_base') {
           toolLogs.push("Agent querying NGO Disaster Guidelines via RAG...");
           try {
             // 1. Get embedding of query using Vertex/Gemini Embedding Map
             const embRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_KEY}`, {
               method: 'POST', headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ model: 'models/text-embedding-004', content: { parts: [{ text: fnArgs.query }] } })
             });
             const embData = await embRes.json();
             const vector = embData.embedding?.values;
             
             if (!vector) throw new Error("Embeddings unavailable");

             // 2. Perform Cosine Similarity against pgvector
             const vectorStr = `[${vector.join(',')}]`;
             const results = await prisma.$queryRawUnsafe(`
               SELECT title, content, 1 - (embedding <=> $1::vector) as similarity
               FROM "KnowledgeBase"
               ORDER BY embedding <=> $1::vector LIMIT 2
             `, vectorStr);
             
             functionResponse = { documents: results };
           } catch (e) {
             console.error('RAG Error:', e.message);
             functionResponse = { documents: "RAG lookup failed. Resorting to baseline." };
           }
        }

        // Send function response back to Gemini to complete thought
        const followupPayload = {
          contents: [
            ...contents,
            messageContent, // Original tool call
            {
              role: 'user',
              parts: [{
                functionResponse: {
                  name: fnName,
                  response: functionResponse
                }
              }]
            }
          ],
          tools,
          generationConfig: { temperature: 0.3 }
        };

        const followupResponse = await fetch(GEMINI_URL, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(followupPayload)
        });
        
        const followupData = await followupResponse.json();
        finalReply = followupData.candidates?.[0]?.content?.parts?.[0]?.text || "Agent processed data.";
      } 
      else if (part.text) {
        finalReply = part.text;
      }
    }

    return { reply: finalReply, toolLogs };

  } catch (error) {
    console.error('[Agent] Chat error:', error.message);
    return { reply: 'AI service temporarily unavailable.', toolLogs: [] };
  }
}

function getFallbackResponse() {
  return {
    skill: "MEDIC", lat: 34.0522, lng: -118.2437, urgency: "CRITICAL", quantity: 3, summary: "Fallback mode.", estimatedResponseMinutes: 8
  };
}

module.exports = { processRequestWithAgent, queryGeminiChat };
