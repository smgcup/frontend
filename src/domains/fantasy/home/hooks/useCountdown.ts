import { useState, useEffect } from 'react';

type CountdownResult = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
};

function computeCountdown(target: Date): CountdownResult {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isExpired: false,
  };
}

export function useCountdown(targetDate: Date): CountdownResult {
  const [countdown, setCountdown] = useState<CountdownResult>(() => computeCountdown(targetDate));

  useEffect(() => {
    setCountdown(computeCountdown(targetDate));
    const id = setInterval(() => {
      const next = computeCountdown(targetDate);
      setCountdown(next);
      if (next.isExpired) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return countdown;
}
