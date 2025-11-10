import React from "react";
import Hero from "@/components/LandingPage/Hero";
import UpcomingMatches from "@/components/LandingPage/UpcomingMatches";
import TournamentStatistics from "@/components/LandingPage/TournamentStatistics";
import News from "@/components/LandingPage/News";
export default function Home() {
  return (
    <div>
      <Hero />
      <UpcomingMatches />
      <TournamentStatistics />
      <News />
    </div>
  );
}
