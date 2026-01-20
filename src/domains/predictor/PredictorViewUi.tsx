'use client';

import { useState } from 'react';
import { Trophy, Target, Zap, Clock } from 'lucide-react';
import type { Match } from '@/domains/matches/contracts';
import { MatchStatus } from '@/graphql';
import PredictionCard from './components/PredictionCard';

type PredictorViewUiProps = {
  matches: Match[];
};

const PredictorViewUi = ({ matches }: PredictorViewUiProps) => {
  const [predictions, setPredictions] = useState<Record<string, string>>({});

  // Filter to only show scheduled matches that can be predicted
  const predictableMatches = matches.filter((match) => match.status === MatchStatus.Scheduled);

  const handlePrediction = (matchId: string, prediction: string) => {
    setPredictions((prev) => ({
      ...prev,
      [matchId]: prediction,
    }));
  };

  const stats = [
    { icon: <Target className="h-5 w-5" />, label: 'Your Accuracy', value: '—' },
    { icon: <Zap className="h-5 w-5" />, label: 'Total Points', value: '0' },
    { icon: <Trophy className="h-5 w-5" />, label: 'Rank', value: '—' },
  ];

  return (
    <div className="min-h-[calc(100vh-60px)]">
      {/* Hero Section with Orange Theme */}
      <div className="relative overflow-hidden bg-linear-to-br from-orange-500 to-orange-400">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        <div className="relative container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Match Predictor</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
              Predict match outcomes and earn points. The more accurate your predictions, the higher you climb!
            </p>
          </div>

          {/* Stats Row */}
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-sm px-5 py-3 border border-white/20"
              >
                <div className="text-white/80">{stat.icon}</div>
                <div>
                  <div className="text-xs text-white/60 font-medium">{stat.label}</div>
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Matches Section */}
      <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <h2 className="text-2xl font-bold">Upcoming Matches</h2>
          </div>
          <p className="text-muted-foreground">Select your predicted winner for each match before the deadline.</p>
        </div>

        {predictableMatches.length === 0 ? (
          <div className="text-center py-16 bg-muted/30 rounded-xl border border-dashed">
            <Trophy className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Upcoming Matches</h3>
            <p className="text-muted-foreground">Check back later for new matches to predict.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {predictableMatches.map((match) => (
              <PredictionCard
                key={match.id}
                match={match}
                currentPrediction={predictions[match.id]}
                onPredict={(prediction) => handlePrediction(match.id, prediction)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictorViewUi;
