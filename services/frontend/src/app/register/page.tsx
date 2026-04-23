"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, CheckCircle, MapPin } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://aegis-backend-75btxxix5a-uc.a.run.app';
const SKILL_OPTIONS = ["MEDIC", "FOOD_AID", "EVAC", "SUPPLY", "SECURITY", "LOGISTICS", "COUNSELOR", "TECH_SUPPORT"];

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const toggleSkill = (s: string) => {
    setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => { setLat(pos.coords.latitude); setLng(pos.coords.longitude); },
        () => { setLat(20.5937); setLng(78.9629); }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !phone || lat == null || lng == null || skills.length === 0) {
      setError('Please fill all fields and select at least one skill');
      return;
    }
    setSubmitting(true); setError('');
    try {
      const res = await fetch(`${API_BASE}/api/volunteers/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, phone, current_lat: lat, current_lng: lng, skills }),
      });
      if (!res.ok) throw new Error('Registration failed');
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally { setSubmitting(false); }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#0A0F0A] p-4">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="glass-panel p-12 max-w-md w-full text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
              <CheckCircle className="w-20 h-20 text-[#00FF88] mx-auto mb-6" />
            </motion.div>
            <h2 className="font-heading text-3xl font-extrabold text-white mb-3">Welcome Aboard!</h2>
            <p className="text-gray-400 text-sm">You have been successfully registered as a volunteer.</p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 max-w-lg w-full space-y-5">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00FF88] to-[#00C4A7] flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-7 h-7 text-[#0A0F0A]" />
              </div>
              <h2 className="font-heading text-2xl font-extrabold text-white">Volunteer Registration</h2>
              <p className="text-gray-400 text-sm mt-1">Join the Aegis Nexus volunteer network</p>
            </div>

            {error && <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-xs text-red-400 text-center">{error}</div>}

            <div className="grid grid-cols-2 gap-3">
              <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00FF88]/30" />
              <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00FF88]/30" />
            </div>

            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone (+91...)"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00FF88]/30" />

            {/* Location */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Location</label>
                <button type="button" onClick={useCurrentLocation}
                  className="text-xs text-[#00FF88] hover:text-[#00C4A7] font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Use My Location
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" step="any" value={lat ?? ''} onChange={e => setLat(parseFloat(e.target.value))} placeholder="Latitude"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00FF88]/30" />
                <input type="number" step="any" value={lng ?? ''} onChange={e => setLng(parseFloat(e.target.value))} placeholder="Longitude"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00FF88]/30" />
              </div>
            </div>

            {/* Skills Multi-select */}
            <div>
              <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-2">Skills (select multiple)</label>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map(s => (
                  <button key={s} type="button" onClick={() => toggleSkill(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                      skills.includes(s) ? 'bg-[#00FF88]/20 border-[#00FF88]/40 text-[#00FF88]' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}>{s}</button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={submitting}
              className="premium-button w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider disabled:opacity-40">
              {submitting ? 'Registering...' : 'Register as Volunteer'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
