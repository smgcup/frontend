import PlayerStandingsView from '@/domains/player-standings/PlayerStandingsView';

// ISR: Revalidate every 10 minutes
export const revalidate = 600;

export default function PlayerStandingsPage() {
  return <PlayerStandingsView />;
}
