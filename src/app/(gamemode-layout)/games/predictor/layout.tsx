import React from "react"
import GamemodeNavbar from '@/components/GamemodeNavbar/GamemodeNavbar';
import { AuthProvider } from '@/contexts/AuthContext';

export default function PredictorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <div className="predictor-theme min-h-screen">
        <GamemodeNavbar gamemode="predictor" />
        {children}
      </div>
    </AuthProvider>
  );
}
