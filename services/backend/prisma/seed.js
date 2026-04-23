const { PrismaClient } = require('@prisma/client');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const prisma = new PrismaClient();

async function getEmbedding(text) {
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY || GEMINI_KEY === 'YOUR_GEMINI_API_KEY_HERE') return Array(768).fill(0.01);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_KEY}`;
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'models/text-embedding-004', content: { parts: [{ text }] } }) });
    const data = await res.json();
    return data.embedding?.values || Array(768).fill(0.1);
  } catch { return Array(768).fill(0.01); }
}

async function main() {
  console.log("Creating pgvector extension...");
  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS vector;`);

  // Skills
  const skillNames = ["MEDIC","FOOD_AID","EVAC","SUPPLY","SECURITY","LOGISTICS","COUNSELOR","TECH_SUPPORT"];
  for (const s of skillNames) { await prisma.skill.upsert({ where: { skill_name: s }, update: {}, create: { skill_name: s } }); }
  const allSkills = await prisma.skill.findMany();
  const skillMap = {};
  allSkills.forEach(s => { skillMap[s.skill_name] = s.skill_id; });

  // 15 NGO Centers
  const centers = [
    { name: "Mumbai Relief Hub", contact_number: "+912226543210", lat: 19.076, lng: 72.8777 },
    { name: "Delhi Aid Center", contact_number: "+911123456789", lat: 28.6139, lng: 77.209 },
    { name: "Bangalore Seva Kendra", contact_number: "+918025671234", lat: 12.9716, lng: 77.5946 },
    { name: "Ahmedabad Hope Foundation", contact_number: "+917926543210", lat: 23.0225, lng: 72.5714 },
    { name: "Surat Community Center", contact_number: "+912612345678", lat: 21.1702, lng: 72.8311 },
    { name: "Vadodara Welfare Trust", contact_number: "+912652345678", lat: 22.3072, lng: 73.1812 },
    { name: "Navsari Rural Aid", contact_number: "+912637234567", lat: 20.9467, lng: 72.952 },
    { name: "Pune Disaster Relief", contact_number: "+912025671234", lat: 18.5204, lng: 73.8567 },
    { name: "Hyderabad Emergency Services", contact_number: "+914023456789", lat: 17.385, lng: 78.4867 },
    { name: "Chennai Flood Response", contact_number: "+914428765432", lat: 13.0827, lng: 80.2707 },
    { name: "Kolkata Outreach Center", contact_number: "+913322345678", lat: 22.5726, lng: 88.3639 },
    { name: "Jaipur Aid Network", contact_number: "+911412345678", lat: 26.9124, lng: 75.7873 },
    { name: "Lucknow Relief Operations", contact_number: "+915222345678", lat: 26.8467, lng: 80.9462 },
    { name: "Bhopal Emergency Center", contact_number: "+917552345678", lat: 23.2599, lng: 77.4126 },
    { name: "Patna Humanitarian Hub", contact_number: "+916122345678", lat: 25.6093, lng: 85.1376 },
  ];
  const createdCenters = [];
  for (const c of centers) { createdCenters.push(await prisma.nGOCenter.create({ data: c })); }
  console.log(`Seeded ${createdCenters.length} NGO Centers`);

  // 50 Volunteers
  const vols = [
    { first_name:"Aarav", last_name:"Sharma", phone:"+919876543210", lat:19.08, lng:72.88, status:"ACTIVE", skills:["MEDIC","COUNSELOR"] },
    { first_name:"Priya", last_name:"Patel", phone:"+919876543211", lat:19.07, lng:72.87, status:"ACTIVE", skills:["FOOD_AID","LOGISTICS"] },
    { first_name:"Rohit", last_name:"Verma", phone:"+919876543212", lat:28.62, lng:77.21, status:"STANDBY", skills:["EVAC","SECURITY"] },
    { first_name:"Sneha", last_name:"Gupta", phone:"+919876543213", lat:28.60, lng:77.20, status:"ACTIVE", skills:["MEDIC"] },
    { first_name:"Vikram", last_name:"Singh", phone:"+919876543214", lat:12.97, lng:77.59, status:"EN_ROUTE", skills:["SUPPLY","TECH_SUPPORT"] },
    { first_name:"Ananya", last_name:"Reddy", phone:"+919876543215", lat:12.98, lng:77.60, status:"ACTIVE", skills:["COUNSELOR","MEDIC"] },
    { first_name:"Arjun", last_name:"Nair", phone:"+919876543216", lat:23.02, lng:72.57, status:"ACTIVE", skills:["FOOD_AID","SUPPLY"] },
    { first_name:"Kavya", last_name:"Joshi", phone:"+919876543217", lat:23.03, lng:72.58, status:"STANDBY", skills:["LOGISTICS"] },
    { first_name:"Raj", last_name:"Mehta", phone:"+919876543218", lat:21.17, lng:72.83, status:"ACTIVE", skills:["SECURITY","EVAC"] },
    { first_name:"Meera", last_name:"Desai", phone:"+919876543219", lat:21.18, lng:72.84, status:"EN_ROUTE", skills:["MEDIC","FOOD_AID"] },
    { first_name:"Aditya", last_name:"Chauhan", phone:"+919876543220", lat:22.31, lng:73.18, status:"ACTIVE", skills:["TECH_SUPPORT"] },
    { first_name:"Diya", last_name:"Shah", phone:"+919876543221", lat:20.95, lng:72.95, status:"STANDBY", skills:["COUNSELOR"] },
    { first_name:"Karan", last_name:"Thakur", phone:"+919876543222", lat:18.52, lng:73.86, status:"ACTIVE", skills:["EVAC","LOGISTICS"] },
    { first_name:"Ishita", last_name:"Kapoor", phone:"+919876543223", lat:18.53, lng:73.85, status:"ACTIVE", skills:["MEDIC","SUPPLY"] },
    { first_name:"Siddharth", last_name:"Rao", phone:"+919876543224", lat:17.39, lng:78.49, status:"EN_ROUTE", skills:["SECURITY"] },
    { first_name:"Riya", last_name:"Iyer", phone:"+919876543225", lat:17.38, lng:78.48, status:"ACTIVE", skills:["FOOD_AID","COUNSELOR"] },
    { first_name:"Vivaan", last_name:"Kumar", phone:"+919876543226", lat:13.08, lng:80.27, status:"ACTIVE", skills:["LOGISTICS","TECH_SUPPORT"] },
    { first_name:"Tara", last_name:"Menon", phone:"+919876543227", lat:13.09, lng:80.28, status:"STANDBY", skills:["MEDIC"] },
    { first_name:"Dhruv", last_name:"Pandey", phone:"+919876543228", lat:22.57, lng:88.36, status:"ACTIVE", skills:["EVAC","SUPPLY"] },
    { first_name:"Nisha", last_name:"Bhat", phone:"+919876543229", lat:22.58, lng:88.37, status:"EN_ROUTE", skills:["FOOD_AID"] },
    { first_name:"Kabir", last_name:"Agarwal", phone:"+919876543230", lat:26.91, lng:75.79, status:"ACTIVE", skills:["SECURITY","LOGISTICS"] },
    { first_name:"Saanvi", last_name:"Mishra", phone:"+919876543231", lat:26.85, lng:80.95, status:"STANDBY", skills:["COUNSELOR","MEDIC"] },
    { first_name:"Arnav", last_name:"Saxena", phone:"+919876543232", lat:23.26, lng:77.41, status:"ACTIVE", skills:["TECH_SUPPORT","EVAC"] },
    { first_name:"Pooja", last_name:"Tiwari", phone:"+919876543233", lat:25.61, lng:85.14, status:"ACTIVE", skills:["SUPPLY","FOOD_AID"] },
    { first_name:"Yash", last_name:"Choudhary", phone:"+919876543234", lat:19.09, lng:72.89, status:"EN_ROUTE", skills:["MEDIC","SECURITY"] },
    { first_name:"Aditi", last_name:"Kulkarni", phone:"+919876543235", lat:28.63, lng:77.22, status:"ACTIVE", skills:["LOGISTICS","COUNSELOR"] },
    { first_name:"Rehan", last_name:"Khan", phone:"+919876543236", lat:12.96, lng:77.58, status:"STANDBY", skills:["EVAC"] },
    { first_name:"Kiara", last_name:"Malhotra", phone:"+919876543237", lat:23.01, lng:72.56, status:"ACTIVE", skills:["FOOD_AID","TECH_SUPPORT"] },
    { first_name:"Veer", last_name:"Rajput", phone:"+919876543238", lat:21.16, lng:72.82, status:"ACTIVE", skills:["MEDIC","SUPPLY"] },
    { first_name:"Zara", last_name:"Ali", phone:"+919876543239", lat:22.30, lng:73.17, status:"EN_ROUTE", skills:["SECURITY"] },
    { first_name:"Nikhil", last_name:"Bhatt", phone:"+919876543240", lat:20.94, lng:72.96, status:"ACTIVE", skills:["COUNSELOR","LOGISTICS"] },
    { first_name:"Avni", last_name:"Pillai", phone:"+919876543241", lat:18.51, lng:73.87, status:"STANDBY", skills:["MEDIC","EVAC"] },
    { first_name:"Tanish", last_name:"Dutta", phone:"+919876543242", lat:17.40, lng:78.50, status:"ACTIVE", skills:["FOOD_AID","SUPPLY"] },
    { first_name:"Aisha", last_name:"Chopra", phone:"+919876543243", lat:13.07, lng:80.26, status:"ACTIVE", skills:["TECH_SUPPORT","SECURITY"] },
    { first_name:"Om", last_name:"Srivastava", phone:"+919876543244", lat:22.56, lng:88.35, status:"EN_ROUTE", skills:["LOGISTICS"] },
    { first_name:"Siya", last_name:"Hegde", phone:"+919876543245", lat:26.92, lng:75.78, status:"ACTIVE", skills:["MEDIC","COUNSELOR"] },
    { first_name:"Dev", last_name:"Banerjee", phone:"+919876543246", lat:26.84, lng:80.94, status:"STANDBY", skills:["EVAC","FOOD_AID"] },
    { first_name:"Aanya", last_name:"Jain", phone:"+919876543247", lat:23.27, lng:77.42, status:"ACTIVE", skills:["SUPPLY","SECURITY"] },
    { first_name:"Shaurya", last_name:"Rathore", phone:"+919876543248", lat:25.62, lng:85.15, status:"ACTIVE", skills:["TECH_SUPPORT","MEDIC"] },
    { first_name:"Mira", last_name:"Nanda", phone:"+919876543249", lat:19.06, lng:72.86, status:"EN_ROUTE", skills:["LOGISTICS","COUNSELOR"] },
    { first_name:"Harsh", last_name:"Goyal", phone:"+919876543250", lat:28.61, lng:77.19, status:"ACTIVE", skills:["EVAC","SUPPLY"] },
    { first_name:"Trisha", last_name:"Sethi", phone:"+919876543251", lat:12.99, lng:77.61, status:"STANDBY", skills:["FOOD_AID","MEDIC"] },
    { first_name:"Parth", last_name:"Awasthi", phone:"+919876543252", lat:23.04, lng:72.59, status:"ACTIVE", skills:["SECURITY","TECH_SUPPORT"] },
    { first_name:"Naina", last_name:"Das", phone:"+919876543253", lat:21.19, lng:72.85, status:"ACTIVE", skills:["COUNSELOR","EVAC"] },
    { first_name:"Ayaan", last_name:"Mukherjee", phone:"+919876543254", lat:22.32, lng:73.19, status:"EN_ROUTE", skills:["LOGISTICS","FOOD_AID"] },
    { first_name:"Radhika", last_name:"Sinha", phone:"+919876543255", lat:20.96, lng:72.94, status:"ACTIVE", skills:["MEDIC","SUPPLY"] },
    { first_name:"Laksh", last_name:"Chawla", phone:"+919876543256", lat:18.54, lng:73.84, status:"STANDBY", skills:["SECURITY","COUNSELOR"] },
    { first_name:"Myra", last_name:"Dubey", phone:"+919876543257", lat:17.37, lng:78.47, status:"ACTIVE", skills:["TECH_SUPPORT","LOGISTICS"] },
    { first_name:"Advait", last_name:"Naidu", phone:"+919876543258", lat:13.10, lng:80.29, status:"ACTIVE", skills:["EVAC","MEDIC"] },
    { first_name:"Ira", last_name:"Garg", phone:"+919876543259", lat:22.59, lng:88.38, status:"EN_ROUTE", skills:["FOOD_AID","SUPPLY"] },
  ];
  const createdVols = [];
  for (const v of vols) {
    const vol = await prisma.volunteer.create({
      data: { first_name: v.first_name, last_name: v.last_name, phone: v.phone,
        current_lat: v.lat, current_lng: v.lng, status: v.status,
        skills: { create: v.skills.map(s => ({ skill: { connect: { skill_name: s } } })) } }
    });
    createdVols.push(vol);
  }
  console.log(`Seeded ${createdVols.length} Volunteers`);

  // 30 Reports
  const descriptions = [
    "Flood affected 200 families in Zone 4, need food and medical support immediately",
    "Earthquake damage to residential block, 50 people displaced need shelter",
    "Severe water shortage in rural area, 300 families affected",
    "Cyclone warning issued, need evacuation support for coastal villages",
    "Food distribution center overwhelmed, need additional volunteers",
    "Medical camp required for 150 elderly patients in slum area",
    "Bridge collapse blocking supply route, alternate logistics needed",
    "Fire outbreak in warehouse district, security and evacuation needed",
    "Monsoon flooding in low-lying areas, 100 families need relocation",
    "Outbreak of waterborne disease, urgent medical intervention required",
    "Landslide blocked access road, emergency supplies running low",
    "Refugee camp overcrowded, need counselors and food aid workers",
    "Power grid failure affecting hospital operations, tech support urgent",
    "Drought conditions worsening, water tanker distribution needed",
    "School building damaged by storm, children need temporary shelter",
    "Chemical spill near river, health screening required for 500 residents",
    "Post-flood sanitization drive needed across 3 wards",
    "Missing persons reported after flash flood, search teams required",
    "Road accident involving supply truck, logistics rerouting needed",
    "Temporary medical facility needs additional staff and equipment",
    "Community kitchen running low on supplies, 400 people depending daily",
    "Damaged water purification plant, technical repair team needed",
    "Elderly care facility needs evacuation due to structural damage",
    "Relief material distribution bottleneck at railway station",
    "Mental health crisis support needed for disaster survivors",
    "Telecommunication tower down, coordination severely impacted",
    "Livestock rescue operation needed in flooded agricultural zone",
    "Emergency blood bank running critically low on O-negative supply",
    "Sanitation facilities collapsed in relief camp, disease risk rising",
    "Solar-powered equipment failure at remote aid station",
  ];
  const urgencies = ["LOW","MEDIUM","CRITICAL"];
  const createdReports = [];
  for (let i = 0; i < 30; i++) {
    const r = await prisma.report.create({
      data: { center_id: createdCenters[i % createdCenters.length].center_id,
        description: descriptions[i], urgency_level: urgencies[i % 3],
        timestamp: new Date(Date.now() - Math.random() * 30 * 86400000) }
    });
    createdReports.push(r);
  }
  console.log(`Seeded ${createdReports.length} Reports`);

  // 60 Needs
  const createdNeeds = [];
  for (let i = 0; i < 60; i++) {
    const skillName = skillNames[i % skillNames.length];
    const n = await prisma.need.create({
      data: { report_id: createdReports[i % createdReports.length].report_id,
        skill_id: skillMap[skillName], quantity_required: (i % 8) + 1,
        status: i < 35 ? "PENDING" : "FULFILLED" }
    });
    createdNeeds.push(n);
  }
  console.log(`Seeded ${createdNeeds.length} Needs`);

  // 25 Dispatches
  const dStatuses = ["EN_ROUTE","ARRIVED","COMPLETED"];
  for (let i = 0; i < 25; i++) {
    await prisma.dispatch.create({
      data: { need_id: createdNeeds[i % createdNeeds.length].need_id,
        volunteer_id: createdVols[i % createdVols.length].volunteer_id,
        eta_minutes: Math.floor(Math.random() * 45) + 5,
        status: dStatuses[i % 3],
        dispatched_at: new Date(Date.now() - Math.random() * 7 * 86400000) }
    });
  }
  console.log("Seeded 25 Dispatches");

  // 10 KnowledgeBase entries
  const kbEntries = [
    { title: "Flood Response Protocol", content: "During flood emergencies, priority is given to evacuation of vulnerable populations including elderly, children, and disabled persons. Deploy EVAC teams first, followed by MEDIC units for triage. FOOD_AID distribution should begin within 6 hours of initial response. Establish temporary shelters at pre-designated NGO centers." },
    { title: "Medical Triage Guidelines", content: "Field medics must follow START triage protocol. RED tags for immediate life-threatening conditions. YELLOW for delayed but serious injuries. GREEN for walking wounded. BLACK for deceased. Each triage station needs minimum 2 MEDIC volunteers and 1 COUNSELOR for psychological first aid." },
    { title: "Supply Chain Management", content: "Relief supplies must be tracked using the Aegis inventory system. Priority items: clean water, non-perishable food, medicines, blankets, and hygiene kits. LOGISTICS volunteers coordinate with local transport. SUPPLY volunteers manage warehouse operations. Reorder triggers at 30% stock level." },
    { title: "Volunteer Safety Protocols", content: "All volunteers must complete safety briefing before deployment. Buddy system mandatory in hazardous zones. SECURITY teams sweep areas before civilian entry. Communication check-ins every 30 minutes. Emergency extraction protocol: 3 short whistle blasts." },
    { title: "Community Needs Assessment", content: "Assessment teams conduct door-to-door surveys using standardized forms. Key data points: family size, medical needs, food security status, shelter condition, water access. Data entered into Aegis system within 2 hours. CRITICAL needs flagged for immediate dispatch." },
    { title: "Mental Health Support Framework", content: "COUNSELOR volunteers provide psychological first aid following WHO guidelines. Group sessions for adults, specialized play therapy for children. Identify and refer severe cases to professional psychiatrists. Maintain confidentiality at all times. Follow-up within 72 hours." },
    { title: "Disaster Communication Plan", content: "TECH_SUPPORT teams establish mesh network communication when cellular is down. Satellite phones for command centers. HAM radio operators at each NGO center. Social media monitoring for real-time community reports. Hourly situation reports to central command." },
    { title: "Food Distribution Standards", content: "FOOD_AID volunteers ensure minimum 2100 kcal per person per day. Special dietary needs documented and accommodated. Distribution points staffed 6AM-8PM. Queue management by SECURITY volunteers. Cold chain maintained for perishable medical supplies." },
    { title: "Evacuation Route Planning", content: "EVAC teams use pre-mapped routes updated in real-time via Aegis GPS. Primary and secondary routes for each zone. Assembly points at NGO centers. Vehicle capacity tracking prevents overcrowding. Special transport for mobility-impaired individuals." },
    { title: "Post-Disaster Recovery Guide", content: "Recovery phase begins 72 hours post-disaster. Damage assessment by TECH_SUPPORT teams using drone imagery. Debris clearing coordinated with local authorities. Livelihood restoration programs initiated within 2 weeks. Long-term mental health support continues for 6 months minimum." },
  ];
  for (const kb of kbEntries) {
    const emb = await getEmbedding(kb.content);
    const vecStr = `[${emb.join(',')}]`;
    await prisma.$executeRawUnsafe(
      `INSERT INTO "KnowledgeBase" (id, title, content, embedding) VALUES (gen_random_uuid(), $1, $2, $3::vector)`,
      kb.title, kb.content, vecStr
    );
  }
  console.log("Seeded 10 KnowledgeBase entries");
  console.log("✅ Seeding complete!");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
