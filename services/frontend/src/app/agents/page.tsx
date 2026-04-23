"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, Crosshair, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function AgentsPage() {
  const [agents, setAgents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await apiFetch('/api/volunteers');
        if (!res.ok) throw new Error('Failed to fetch agents');
        const data = await res.json();
        setAgents(data);
      } catch (err: any) {
        console.error('Fetch Error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAgents();
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white mb-2">Volunteer Network</h2>
          <p className="text-gray-400 text-sm">Comprehensive directory of all deployed resources.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#00FF88]/10 border border-[#00FF88]/20 text-[#00FF88] px-4 py-2 rounded-xl text-sm font-semibold">
          <Users className="w-4 h-4" /> {agents.length || 0} Total Active
        </div>
      </div>

      <div className="glass-panel w-full flex-1 overflow-hidden flex flex-col">
        <div className="grid grid-cols-5 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-white/10 p-6 bg-black/20">
          <div className="col-span-1">Registry ID</div>
          <div className="col-span-1">Operative Name</div>
          <div className="col-span-1">Classification</div>
          <div className="col-span-1">Current Sector</div>
          <div className="col-span-1">Live Status</div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {loading ? (
             <div className="flex items-center justify-center py-20 text-gray-500 gap-3">
               <Loader2 className="w-5 h-5 animate-spin" /> Fetching agent registry...
             </div>
          ) : error ? (
             <div className="flex items-center justify-center py-20 text-red-400 font-semibold px-10 text-center">
               ⚠️ ERROR: {error}. Please ensure you are logged in and the backend is reachable.
             </div>
          ) : agents.length === 0 ? (
             <div className="flex items-center justify-center py-20 text-gray-500">
               No agents found in registry.
             </div>
          ) : (
            agents.map((agent, i) => (
              <motion.div 
                key={agent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-5 items-center p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-[rgba(0,255,136,0.1)] transition-colors cursor-pointer group"
              >
                <div className="col-span-1 font-mono text-sm text-[#00FF88] font-bold flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-gray-500 group-hover:text-[#00FF88] transition-colors" />
                  {agent.id.slice(0, 5).toUpperCase()}
                </div>
                <div className="col-span-1 font-semibold text-white text-sm">{agent.name}</div>
                <div className="col-span-1 text-gray-400 text-sm">{agent.role}</div>
                <div className="col-span-1 text-gray-300 text-sm">{agent.location}</div>
                <div className="col-span-1">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    agent.status === 'Active' ? 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/20' :
                    agent.status === 'En-route' || agent.status === 'En-Route' ? 'bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/20' :
                    agent.status === 'Standby' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                  }`}>
                      {agent.status === 'Active' && <Activity className="w-3 h-3" />}
                      {agent.status}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
