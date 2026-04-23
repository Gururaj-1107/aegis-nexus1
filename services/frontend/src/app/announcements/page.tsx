"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Plus, Trash2, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('NORMAL');
  const [expiresAt, setExpiresAt] = useState('');

  const fetchAnnouncements = async () => {
    try {
      const res = await apiFetch('/api/announcements');
      if (res.ok) setAnnouncements(await res.json());
    } catch {}
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    await apiFetch('/api/announcements', {
      method: 'POST',
      body: JSON.stringify({ title, content, priority, expires_at: expiresAt || null }),
    });
    setTitle(''); setContent(''); setPriority('NORMAL'); setExpiresAt(''); setShowForm(false);
    fetchAnnouncements();
  };

  const handleDelete = async (id: string) => {
    await apiFetch(`/api/announcements/${id}`, { method: 'DELETE' });
    fetchAnnouncements();
  };

  const borderColor = (p: string) => p === 'CRITICAL' ? 'border-l-[#FF4444]' : p === 'URGENT' ? 'border-l-[#FFB800]' : 'border-l-[#00FF88]';
  const PriorityIcon = (p: string) => p === 'CRITICAL' ? AlertCircle : p === 'URGENT' ? AlertTriangle : Info;

  return (
    <div className="w-full flex flex-col gap-6 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white mb-1">Announcements & Notices</h2>
          <p className="text-gray-400 text-sm">Operational broadcasts and priority alerts</p>
        </div>
        <button onClick={() => setShowForm(p => !p)}
          className="premium-button px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {showForm && (
        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 space-y-4">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00FF88]/30" />
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm h-24 resize-none focus:outline-none focus:border-[#00FF88]/30" />
          <div className="flex gap-3 items-center">
            <div className="flex gap-2">
              {['NORMAL', 'URGENT', 'CRITICAL'].map(p => (
                <button key={p} type="button" onClick={() => setPriority(p)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                    priority === p ? (p === 'CRITICAL' ? 'bg-red-500/20 border-red-500/40 text-red-400' : p === 'URGENT' ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400' : 'bg-green-500/20 border-green-500/40 text-green-400')
                    : 'bg-white/5 border-white/10 text-gray-400'
                  }`}>{p}</button>
              ))}
            </div>
            <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none" />
            <button type="submit" className="premium-button px-6 py-2 rounded-full text-sm font-bold ml-auto">Post</button>
          </div>
        </motion.form>
      )}

      <div className="space-y-4">
        {announcements.map((a, i) => {
          const Icon = PriorityIcon(a.priority);
          return (
            <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`glass-panel p-6 border-l-4 ${borderColor(a.priority)} flex gap-4`}>
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${a.priority === 'CRITICAL' ? 'text-[#FF4444]' : a.priority === 'URGENT' ? 'text-[#FFB800]' : 'text-[#00FF88]'}`} />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-white font-bold text-lg">{a.title}</h3>
                  <button onClick={() => handleDelete(a.id)} className="text-gray-500 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-300 text-sm mt-2 leading-relaxed">{a.content}</p>
                <div className="flex gap-3 mt-3 text-xs text-gray-500">
                  <span>{new Date(a.created_at).toLocaleDateString()}</span>
                  {a.expires_at && <span>Expires: {new Date(a.expires_at).toLocaleDateString()}</span>}
                </div>
              </div>
            </motion.div>
          );
        })}
        {announcements.length === 0 && <p className="text-gray-500 text-center py-10">No announcements yet</p>}
      </div>
    </div>
  );
}
