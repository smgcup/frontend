import { Suspense } from 'react';
import FantasyView from '@/domains/fantasy/gamemode/FantasyView';

const MyTeamPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07000f]" />}>
      <FantasyView />
    </Suspense>
  );
};

export default MyTeamPage;
