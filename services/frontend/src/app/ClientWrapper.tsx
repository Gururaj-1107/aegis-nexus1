"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import VoiceAssistantMic from '@/components/VoiceAssistantMic';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/login';
  const isRegister = pathname === '/register';
  const hideChrome = isLogin || isRegister;

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your-client-id'}>
      {!hideChrome && <Header />}
      {!hideChrome && <VoiceAssistantMic />}
      <div className={`relative z-10 mx-auto flex flex-col ${
        !hideChrome 
          ? 'p-4 md:p-6 lg:p-8 max-w-[1600px] pt-0 overflow-y-auto h-[calc(100vh-56px)]' 
          : ''
      }`}>
        {children}
      </div>
    </GoogleOAuthProvider>
  );
}
