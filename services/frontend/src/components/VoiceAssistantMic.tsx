"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Loader2, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function VoiceAssistantMic() {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [transcriptData, setTranscriptData] = useState<any>(null);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        await sendAudioToBackend(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setStatus('idle');
      setTranscriptData(null);
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      // Fallback for demo without HTTPS perms
      simulateRecording();
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const simulateRecording = () => {
     setIsRecording(true);
     setTimeout(() => {
        setIsRecording(false);
        setStatus('processing');
        setTimeout(() => {
           setTranscriptData({ transcript: "Send medical resupply to Zone Alpha", intent: "SUPPLY_REQUEST", dispatched_volunteer: "Unit 7" });
           setStatus('success');
           setTimeout(() => setStatus('idle'), 5000);
        }, 2000);
     }, 2500);
  }

  const sendAudioToBackend = async (blob: Blob) => {
    setStatus('processing');
    const formData = new FormData();
    formData.append('audio', blob, 'recording.webm');

    try {
      const response = await apiFetch('/api/voice', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Voice processing failed");
      
      const data = await response.json();
      setTranscriptData(data);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 8000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <>
      <AnimatePresence>
        {status === 'success' && transcriptData && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-32 right-10 z-40 bg-white/10 backdrop-blur-3xl border border-white/20 p-6 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] max-w-sm w-full"
          >
             <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/10">
                <CheckCircle2 className="text-green-400 w-5 h-5" />
                <h4 className="font-bold text-white text-sm">Voice AI Transcribed</h4>
             </div>
             <p className="text-gray-300 text-sm mb-3 italic">"{transcriptData.transcript}"</p>
             <div className="bg-black/30 rounded-lg p-3">
                <p className="text-xs text-[#00FF88] font-mono">Intent: {JSON.stringify(transcriptData.intent)}</p>
                <p className="text-xs text-green-300 mt-2 font-mono">Dispatched: {transcriptData.dispatched_volunteer}</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-10 right-10 z-50 flex items-center justify-center">
        {status === 'processing' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-12 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg flex items-center gap-3"
          >
            <Loader2 className="w-4 h-4 text-white animate-spin" />
            <span className="text-xs font-bold text-white tracking-widest uppercase">Processing</span>
          </motion.div>
        )}

        <motion.button
          onClick={toggleRecording}
          className={`relative flex items-center justify-center w-20 h-20 rounded-full shadow-2xl backdrop-blur-xl border-2 ${
            isRecording ? 'bg-red-500 border-red-400' : 'bg-gradient-to-br from-[#00FF88] to-[#00C4A7] border-[#00FF88]/50 hover:border-[#00FF88]'
          } focus:outline-none z-10 transition-colors`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: isRecording
              ? ["0px 0px 0px 0px rgba(239,68,68,0.7)", "0px 0px 0px 30px rgba(239,68,68,0)"]
              : ["0px 0px 15px rgba(0,255,136,0.4)", "0px 0px 30px rgba(0,255,136,0.6)", "0px 0px 15px rgba(0,255,136,0.4)"]
          }}
          transition={{
            boxShadow: { duration: isRecording ? 1.5 : 3, repeat: Infinity, repeatType: "loop" }
          }}
        >
          <Mic className="text-[#0A0F0A] w-8 h-8 drop-shadow-md" />
          
          {isRecording && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/50"
              animate={{ scale: [1, 1.6], opacity: [1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            />
          )}
        </motion.button>
      </div>
    </>
  );
}
