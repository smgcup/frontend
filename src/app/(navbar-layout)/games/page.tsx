import { ComingSoon } from '@/components/ComingSoon';

// ISR: Revalidate every 10 minutes
export const revalidate = 600;

const GamesPage = () => {
  return (
    <ComingSoon
      title="Games"
      description="Game schedules, live scores, and highlights will be available soon. Don't miss the action!!!"
    />
  );
};

export default GamesPage;
