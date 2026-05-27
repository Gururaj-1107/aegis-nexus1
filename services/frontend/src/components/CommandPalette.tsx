"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  Users,
  Radio,
  Brain,
  Megaphone,
  BarChart3,
  ArrowRight,
  Command,
} from 'lucide-react';

const COMMANDS = [
  { id: 'dashboard', label: 'Dashboard', description: 'Command overview & metrics', icon: LayoutDashboard, href: '/' },
  { id: 'volunteers', label: 'Volunteers', description: 'Agent network directory', icon: Users, href: '/agents' },
  { id: 'dispatch', label: 'Dispatch', description: 'Mission control & map', icon: Radio, href: '/dispatch' },
  { id: 'intelligence', label: 'Intelligence', description: 'AI chat & documents', icon: Brain, href: '/vault' },
  { id: 'announcements', label: 'Announcements', description: 'Broadcasts & alerts', icon: Megaphone, href: '/announcements' },
  { id: 'analytics', label: 'Analytics', description: 'Performance data', icon: BarChart3, href: '/analytics' },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = COMMANDS.filter(
    cmd =>
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const navigate = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => (i + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      navigate(filtered[selectedIndex].href);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[90] w-full max-w-lg"
          >
            <div className="bg-[#0A0E18]/98 backdrop-blur-2xl rounded-2xl border border-[rgba(99,102,241,0.18)] shadow-2xl shadow-black/40 overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search pages..."
                  className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
                />
                <kbd className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-mono text-gray-500 border border-white/10">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="py-2 max-h-[320px] overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <p className="text-gray-500 text-sm">No results found</p>
                  </div>
                ) : (
                  filtered.map((cmd, i) => {
                    const Icon = cmd.icon;
                    const isSelected = i === selectedIndex;
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => navigate(cmd.href)}
                        onMouseEnter={() => setSelectedIndex(i)}
                        className={`w-full flex items-center gap-4 px-5 py-3 transition-colors ${
                          isSelected ? 'bg-[#6366F1]/10' : 'hover:bg-white/5'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-[#6366F1]/20 text-[#6366F1]' : 'bg-white/5 text-gray-500'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                            {cmd.label}
                          </p>
                          <p className="text-[11px] text-gray-500">{cmd.description}</p>
                        </div>
                        {isSelected && (
                          <ArrowRight className="w-4 h-4 text-[#6366F1]" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 px-5 py-3 border-t border-white/5 text-[10px] text-gray-600">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 font-mono">↑↓</kbd> Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 font-mono">↵</kbd> Open
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 font-mono">Esc</kbd> Close
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
