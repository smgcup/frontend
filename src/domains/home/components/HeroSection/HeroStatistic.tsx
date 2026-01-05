import React from 'react';
import Image from 'next/image';
import { AnimatedNumber } from '@/components/motion/AnimatedNumber';

type HeroStatisticProps = {
  icon: string;
  value: number;
  label: string;
};
const HeroStatistic = ({ icon, value, label }: HeroStatisticProps) => {
  return (
    <div className="flex flex-col items-center rounded-xl px-4 py-3 transition-colors hover:bg-background/40">
      <div className="mb-2 rounded-full bg-primary/10 p-3 shadow-sm">
        <Image src={icon} alt={label} width={32} height={32} loading="lazy" />
      </div>
      <div className="text-3xl font-bold tabular-nums">
        <AnimatedNumber value={value} />
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
};

export default HeroStatistic;
