export type PlayerTeam = {
  id: string;
  name: string;
};

export type PlayerListItem = {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  yearOfBirth: number;
  height: number;
  weight: number;
  preferredFoot: string;
};

// Domain enums mirror API values but stay decoupled from GraphQL-generated types.
export enum PlayerPosition {
  Goalkeeper = 'GOALKEEPER',
  Defender = 'DEFENDER',
  Midfielder = 'MIDFIELDER',
  Forward = 'FORWARD',
}

export enum PreferredFoot {
  Left = 'LEFT',
  Right = 'RIGHT',
  Both = 'BOTH',
}

export type PlayerEdit = {
  id: string;
  firstName: string;
  lastName: string;
  yearOfBirth: number;
  height: number;
  weight: number;
  imageUrl?: string | null;
  preferredFoot: PreferredFoot;
  position: PlayerPosition;
  team?: PlayerTeam | null;
};

export type PlayerUpdate = Partial<{
  firstName: string;
  lastName: string;
  teamId: string;
  height: number;
  weight: number;
  yearOfBirth: number;
  imageUrl: string;
  position: PlayerPosition;
  preferredFoot: PreferredFoot;
}>;

export type PlayerCreate = {
  firstName: string;
  lastName: string;
  teamId: string;
  height: number;
  weight: number;
  yearOfBirth: number;
  imageUrl: string;
  position: PlayerPosition;
  preferredFoot: PreferredFoot;
};
