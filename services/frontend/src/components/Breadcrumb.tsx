"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const PAGE_LABELS: Record<string, string> = {
  '/': 'Dashboard',
  '/agents': 'Volunteers',
  '/dispatch': 'Dispatch',
  '/vault': 'Intelligence',
  '/announcements': 'Announcements',
  '/analytics': 'Analytics',
};

export default function Breadcrumb() {
  const pathname = usePathname();

  if (pathname === '/') return null;

  const label = PAGE_LABELS[pathname] || pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex items-center gap-2 text-xs text-gray-500 px-2 pt-4 pb-1"
      aria-label="Breadcrumb"
    >
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-gray-300 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      <ChevronRight className="w-3 h-3 text-gray-700" />
      <span className="text-gray-300 font-semibold">{label}</span>
    </motion.nav>
  );
}
