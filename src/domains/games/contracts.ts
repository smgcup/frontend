import React from 'react';

export type GameStat = {
  icon: React.ReactNode;
  label: string;
};

export type Gamemode = {
  title: string;
  subtitle: string;
  badge: {
    text: string;
    variant: 'popular' | 'new-season';
  };
  backgroundImage: string;
  stats: GameStat[];
  href: string;
};
