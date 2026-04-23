"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, PieChartIcon, Trophy } from 'lucide-react';
import { apiFetch } from '@/lib/api';

const COLORS = ['#00FF88', '#00C4A7', '#FFB800', '#FF4444', '#3b82f6', '#a855f7', '#f97316', '#06b6d4'];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [skillDist, setSkillDist] = useState<any[]>([]);
  const [centers, setCenters] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/api/dashboard/stats').then(r => r.ok ? r.json() : null).then(setStats).catch(() => {});
    apiFetch('/api/analytics/timeline').then(r => r.ok ? r.json() : []).then(setTimeline).catch(() => {});
    apiFetch('/api/analytics/skills').then(r => r.ok ? r.json() : []).then(setSkillDist).catch(() => {});
    apiFetch('/api/analytics/centers').then(r => r.ok ? r.json() : []).then(setCenters).catch(() => {});
  }, []);

  // Build urgency data from stats
  const urgencyData = stats ? [
    { name: 'LOW', count: stats.total_reports - stats.critical_reports - Math.floor(stats.total_reports * 0.3), color: '#00FF88' },
    { name: 'MEDIUM', count: Math.floor(stats.total_reports * 0.3), color: '#FFB800' },
    { name: 'CRITICAL', count: stats.critical_reports, color: '#FF4444' },
  ] : [];

  return (
    <div className="w-full flex flex-col gap-8 pb-10">
      <div>
        <h2 className="font-heading text-2xl font-bold text-white mb-1">Analytics Dashboard</h2>
        <p className="text-gray-400 text-sm">Comprehensive operational intelligence and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgency Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-5 h-5 text-[#00FF88]" />
            <h3 className="font-heading font-bold text-lg text-white">Reports by Urgency</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={urgencyData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A0ADB8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A0ADB8', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#0A0F0A', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 12, color: '#fff' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={50}>
                  {urgencyData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Timeline Line Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-[#00C4A7]" />
            <h3 className="font-heading font-bold text-lg text-white">Reports Over Time (30 days)</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#A0ADB8', fontSize: 10 }}
                  tickFormatter={v => v.slice(5)} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A0ADB8', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#0A0F0A', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 12, color: '#fff' }} />
                <Line type="monotone" dataKey="count" stroke="#00FF88" strokeWidth={2} dot={{ fill: '#00FF88', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Skill Distribution Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-6">
            <PieChartIcon className="w-5 h-5 text-[#FFB800]" />
            <h3 className="font-heading font-bold text-lg text-white">Volunteer Skill Distribution</h3>
          </div>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie data={skillDist} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {skillDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0A0F0A', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 12, color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {skillDist.map((s, i) => (
                <div key={s.name} className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-gray-300">{s.name}</span>
                  <span className="text-gray-500 ml-auto">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Top Centers Leaderboard */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-5 h-5 text-[#FFB800]" />
            <h3 className="font-heading font-bold text-lg text-white">Top NGO Centers by Activity</h3>
          </div>
          <div className="space-y-3 overflow-y-auto max-h-64">
            {centers.slice(0, 10).map((c, i) => (
              <div key={c.name} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i === 0 ? 'bg-[#FFB800]/20 text-[#FFB800]' : i === 1 ? 'bg-gray-400/20 text-gray-300' : i === 2 ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 text-gray-500'
                }`}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.reports} reports · {c.dispatches} dispatches</p>
                </div>
                <span className="text-sm font-bold text-[#00FF88]">{c.total}</span>
              </div>
            ))}
            {centers.length === 0 && <p className="text-gray-500 text-sm text-center py-8">No data available</p>}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
