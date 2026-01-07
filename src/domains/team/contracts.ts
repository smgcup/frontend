export type Team = {
  id: string;
  name: string;
};

export type TeamWithPlayers = {
  id: string;
  name: string;
  players: import('../player/contracts').PlayerListItem[];
};
