import React from "react"
import GamemodeNavbar from '@/components/GamemodeNavbar/GamemodeNavbar';

export default function PredictorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="predictor-theme min-h-screen">
      <GamemodeNavbar gamemode="predictor" />
      {children}
    </div>
  );
}
