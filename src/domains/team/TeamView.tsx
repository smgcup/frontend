import type { Team } from './contracts';
import { TeamViewUi } from './TeamViewUi';

export function TeamView({ team }: { team: Team }) {
  return <TeamViewUi team={team} />;
}
