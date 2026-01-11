export type Team = {
  id: string;
  name: string;
};

export type TeamWithPlayers = {
  id: string;
  name: string;
  players: import('../player/contracts').Player[];
};

export type TeamCreate = {
  name: string;
};

export type TeamUpdate = {
  name: string;
};
