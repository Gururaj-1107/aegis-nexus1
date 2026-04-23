"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'MEDIC', needs: 35 },
  { name: 'FOOD', needs: 50 },
  { name: 'EVAC', needs: 25 },
  { name: 'SUPPLY', needs: 40 },
  { name: 'SECURITY', needs: 20 },
  { name: 'LOGISTICS', needs: 30 },
  { name: 'COUNSEL', needs: 15 },
];

export function NeedsBarChart() {
  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A0ADB8', fontSize: 10 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A0ADB8', fontSize: 12 }} />
          <Tooltip 
            cursor={{ fill: 'rgba(99,102,241,0.06)' }}
            contentStyle={{ background: '#070A12', border: '1px solid rgba(99,102,241,0.22)', borderRadius: 12, color: '#fff' }}
          />
          <Bar dataKey="needs" fill="#6366F1" radius={[6, 6, 0, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CircularProgress({ progress, label }: { progress: number, label: string }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative inline-flex items-center justify-center">
        <svg className="transform -rotate-90 w-24 h-24">
          <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/10" />
          <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            className="text-[#6366F1] transition-all duration-1000 ease-in-out" />
        </svg>
        <span className="absolute text-xl font-semibold text-white">{progress}%</span>
      </div>
      <span className="text-sm text-gray-400 mt-2 font-medium">{label}</span>
    </div>
  );
}
