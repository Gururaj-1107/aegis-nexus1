"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Radio,
  Brain,
  Megaphone,
  BarChart3,
  X,
  Shield,
  Zap,
  ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, description: 'Command overview' },
  { href: '/agents', label: 'Volunteers', icon: Users, description: 'Agent network' },
  { href: '/dispatch', label: 'Dispatch', icon: Radio, description: 'Mission control' },
  { href: '/vault', label: 'Intelligence', icon: Brain, description: 'AI & documents' },
  { href: '/announcements', label: 'Announcements', icon: Megaphone, description: 'Broadcasts' },
  { href: '/analytics', label: 'Analytics', icon: BarChart3, description: 'Performance data' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sidebar panel */}
          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 z-[70] h-full w-[300px] bg-[#070A12]/95 backdrop-blur-2xl border-r border-[rgba(99,102,241,0.14)] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#22D3EE] flex items-center justify-center shadow-lg shadow-[#6366F1]/20">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-heading text-base font-extrabold tracking-wider text-white">
                    AEGIS
                  </h2>
                  <p className="text-[10px] text-gray-500 font-semibold tracking-widest uppercase">
                    Command Center
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>

            {/* System status */}
            <div className="px-6 py-4">
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#6366F1]/5 border border-[#6366F1]/10">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6366F1] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#6366F1]" />
                </span>
                <span className="text-[10px] font-bold tracking-[0.15em] text-[#6366F1] uppercase">
                  Systems Operational
                </span>
              </div>
            </div>

            {/* Navigation label */}
            <div className="px-6 pt-2 pb-3">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                Navigation
              </p>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} onClick={onClose}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group cursor-pointer ${
                        active
                          ? 'bg-[#6366F1]/10 border border-[#6366F1]/20'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b from-[#6366F1] to-[#22D3EE]"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                          active
                            ? 'bg-[#6366F1]/20 text-[#6366F1]'
                            : 'bg-white/5 text-gray-500 group-hover:text-gray-300 group-hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-semibold ${
                            active ? 'text-white' : 'text-gray-400 group-hover:text-white'
                          }`}
                        >
                          {item.label}
                        </p>
                        <p className="text-[10px] text-gray-600 truncate">{item.description}</p>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 transition-all ${
                          active
                            ? 'text-[#6366F1] opacity-100'
                            : 'text-gray-700 opacity-0 group-hover:opacity-100'
                        }`}
                      />
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-white/5">
              <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gradient-to-r from-[#6366F1]/5 to-[#22D3EE]/5 border border-white/5">
                <Zap className="w-4 h-4 text-[#22D3EE]" />
                <div>
                  <p className="text-xs font-bold text-white">Aegis Nexus v2.0</p>
                  <p className="text-[10px] text-gray-500">AI-Powered Platform</p>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
