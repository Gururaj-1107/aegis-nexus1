"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Radio, ShieldAlert, Zap, CheckCircle, Loader2 } from 'lucide-react';
import MapComponent from '@/components/MapComponent';
import { apiFetch } from '@/lib/api';

export default function DispatchPage() {
  const [needs, setNeeds] = useState<any[]>([]);
  const [dispatching, setDispatching] = useState<string | null>(null);
  const [dispatchResult, setDispatchResult] = useState<any>(null);

  useEffect(() => {
    // Fetch pending needs from dispatches/recent as a proxy
    apiFetch('/api/dispatches/recent').then(r => r.ok ? r.json() : []).then(setNeeds).catch(() => {});
  }, []);

  const autoDispatch = async (needId: string) => {
    setDispatching(needId);
    try {
      const res = await apiFetch('/api/dispatch/auto', {
        method: 'POST', body: JSON.stringify({ need_id: needId }),
      });
      const data = await res.json();
      if (data.success) {
        setDispatchResult(data);
        setTimeout(() => setDispatchResult(null), 5000);
      }
    } catch {} finally { setDispatching(null); }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white mb-2">Live Dispatch Interface</h2>
          <p className="text-gray-400 text-sm">Spatial tracking and volunteer assignments across India.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#6366F1]/10 border border-[#6366F1]/25 text-[#6366F1] px-4 py-2 rounded-xl text-sm font-semibold">
          <Globe className="w-4 h-4" /> India Operations
        </div>
      </div>

      {/* Auto-dispatch success notification */}
      <AnimatePresence>
        {dispatchResult && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="glass-panel p-4 border-l-4 border-l-[#6366F1] flex items-center gap-4">
            <CheckCircle className="w-6 h-6 text-[#6366F1]" />
            <div>
              <p className="text-white font-bold text-sm">Auto-Dispatch Successful!</p>
              <p className="text-gray-400 text-xs">
                Matched <span className="text-[#6366F1] font-semibold">{dispatchResult.volunteer_name}</span> — 
                {dispatchResult.distance_km}km away, ETA {dispatchResult.eta_minutes}min
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 grid grid-cols-12 gap-6 pb-8">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="col-span-12 lg:col-span-9 rounded-2xl overflow-hidden border border-[rgba(99,102,241,0.14)] relative shadow-2xl">
          <div className="absolute top-4 left-4 z-20 bg-[#070A12]/90 backdrop-blur-md px-4 py-3 rounded-xl border border-[rgba(99,102,241,0.18)] shadow-lg">
            <h4 className="text-white font-bold text-sm mb-1">Operations Center</h4>
            <p className="text-xs text-gray-400">Live volunteer positions across India</p>
          </div>
          <MapComponent />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="col-span-12 lg:col-span-3 glass-panel p-6 flex flex-col gap-4 bg-black/20">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Radio className="w-5 h-5 text-[#6366F1] animate-pulse" />
            <h3 className="text-lg font-bold text-white">Live Operations</h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {needs.length > 0 ? needs.slice(0, 6).map((n, i) => (
              <div key={n.id || i} className={`bg-white/5 border-l-2 p-4 rounded-r-xl ${
                n.urgency === 'CRITICAL' ? 'border-[#FF4444]' : n.urgency === 'MEDIUM' ? 'border-[#FFB800]' : 'border-[#6366F1]'
              }`}>
                <div className="flex gap-2 items-start mb-2">
                  <ShieldAlert className={`w-4 h-4 mt-0.5 ${n.urgency === 'CRITICAL' ? 'text-[#FF4444]' : 'text-[#FFB800]'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{n.skill} — {n.volunteer_name}</p>
                    <p className="text-xs text-gray-400">{n.status} · ETA {n.eta_minutes}m</p>
                  </div>
                </div>
              </div>
            )) : (
              <>
                <div className="bg-white/5 border-l-2 border-[#FF4444] p-4 rounded-r-xl">
                  <div className="flex gap-2 items-start mb-2">
                    <ShieldAlert className="w-4 h-4 text-[#FF4444] mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-white">Critical Evac</p>
                      <p className="text-xs text-gray-400">Mumbai Zone — T+4:00m</p>
                    </div>
                  </div>
                  <button className="w-full mt-2 premium-button text-xs py-2 rounded font-medium flex items-center justify-center gap-2">
                    <Zap className="w-3 h-3" /> Auto-Dispatch
                  </button>
                </div>
                <div className="bg-white/5 border-l-2 border-[#6366F1] p-4 rounded-r-xl">
                  <div className="flex gap-2 items-start mb-2">
                    <Radio className="w-4 h-4 text-[#6366F1] mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-white">Supply Drop</p>
                      <p className="text-xs text-gray-400">Delhi Sector — Dispatched</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
