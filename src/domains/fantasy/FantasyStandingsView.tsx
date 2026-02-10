'use client';

import FantasyStandingsViewUi from './FantasyStandingsViewUi';
import type { FantasyStandingsEntry } from './contracts';

const managers = [
  { managerName: 'Nasko', teamName: 'Nasko FC', isCurrentUser: true },
  { managerName: 'Anton', teamName: 'Anton United' },
  { managerName: 'Georgi', teamName: 'Georgi City' },
  { managerName: 'Stefan', teamName: 'Stefan Wanderers' },
  { managerName: 'Dimitar', teamName: 'Dimitar Athletic' },
  { managerName: 'Ivan', teamName: 'Ivan Rangers' },
  { managerName: 'Petar', teamName: 'Petar Town' },
  { managerName: 'Nikolay', teamName: 'Nikolay Villa' },
  { managerName: 'Todor', teamName: 'Todor Palace' },
  { managerName: 'Hristo', teamName: 'Hristo Rovers' },
  { managerName: 'Martin', teamName: 'Martin Albion' },
  { managerName: 'Kaloyan', teamName: 'Kaloyan Borough' },
  { managerName: 'Vasil', teamName: 'Vasil Hotspur' },
  { managerName: 'Boris', teamName: 'Boris Wednesday' },
  { managerName: 'Yordan', teamName: 'Yordan City' },
];

const generateGameweekStandings = (gw: number): FantasyStandingsEntry[] => {
  // Use gameweek number as seed for deterministic but varied results
  const seed = gw * 7;
  return managers
    .map((m, i) => ({
      ...m,
      gameweekPoints: 20 + ((seed + i * 13) % 60),
      totalPoints: 0, // filled after sort
    }))
    .sort((a, b) => b.gameweekPoints - a.gameweekPoints)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));
};

const generateOverallStandings = (): FantasyStandingsEntry[] => {
  // Sum up points across all 10 gameweeks
  const totals: Record<string, { gwTotal: number; manager: typeof managers[number] }> = {};
  for (const m of managers) {
    totals[m.managerName] = { gwTotal: 0, manager: m };
  }
  for (let gw = 1; gw <= 10; gw++) {
    const gwStandings = generateGameweekStandings(gw);
    for (const entry of gwStandings) {
      totals[entry.managerName].gwTotal += entry.gameweekPoints;
    }
  }
  return Object.values(totals)
    .map((t) => ({
      ...t.manager,
      gameweekPoints: generateGameweekStandings(3).find((e) => e.managerName === t.manager.managerName)
        ?.gameweekPoints ?? 0,
      totalPoints: t.gwTotal,
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));
};

const mockGameweekStandings: Record<number, FantasyStandingsEntry[]> = {};
for (let gw = 1; gw <= 10; gw++) {
  const gwEntries = generateGameweekStandings(gw);
  // Compute running totals up to this gameweek
  const runningTotals: Record<string, number> = {};
  for (let g = 1; g <= gw; g++) {
    for (const e of generateGameweekStandings(g)) {
      runningTotals[e.managerName] = (runningTotals[e.managerName] ?? 0) + e.gameweekPoints;
    }
  }
  mockGameweekStandings[gw] = gwEntries.map((e) => ({
    ...e,
    totalPoints: runningTotals[e.managerName] ?? 0,
  }));
}

const mockOverallStandings = generateOverallStandings();

const FantasyStandingsView = () => {
  return (
    <FantasyStandingsViewUi
      gameweekStandings={mockGameweekStandings}
      overallStandings={mockOverallStandings}
      totalGameweeks={10}
      currentGameweek={3}
    />
  );
};

export default FantasyStandingsView;
