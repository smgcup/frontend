import React from 'react';
import GamemodeNavbar from '@/components/GamemodeNavbar/GamemodeNavbar';
import { AuthProvider } from '@/contexts/AuthContext';

export default function FantasyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <div className="fantasy-theme min-h-screen">
        <GamemodeNavbar gamemode="fantasy" />
        {children}
      </div>
    </AuthProvider>
  );
}
