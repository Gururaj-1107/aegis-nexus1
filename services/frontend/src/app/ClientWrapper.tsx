"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CommandPalette from '@/components/CommandPalette';
import Breadcrumb from '@/components/Breadcrumb';
import PageTransition from '@/components/PageTransition';
import VoiceAssistantMic from '@/components/VoiceAssistantMic';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/login';
  const isRegister = pathname === '/register';
  const hideChrome = isLogin || isRegister;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const toggleSearch = useCallback(() => setSearchOpen(prev => !prev), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your-client-id'}>
      {!hideChrome && (
        <Header
          onToggleSidebar={toggleSidebar}
          onToggleSearch={toggleSearch}
        />
      )}
      {!hideChrome && (
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      {!hideChrome && (
        <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      )}
      {!hideChrome && <VoiceAssistantMic />}
      <div className={`relative z-10 mx-auto flex flex-col ${
        !hideChrome 
          ? 'p-4 md:p-6 lg:p-8 max-w-[1600px] pt-0 overflow-y-auto h-[calc(100vh-56px)]' 
          : ''
      }`}>
        {!hideChrome && <Breadcrumb />}
        <PageTransition>
          {children}
        </PageTransition>
      </div>
    </GoogleOAuthProvider>
  );
}
