export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateSimple: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type AdminLoginResult = {
  __typename?: 'AdminLoginResult';
  ok: Scalars['Boolean']['output'];
};

export type CreateMatchDto = {
  date: Scalars['Date']['input'];
  firstOpponentId: Scalars['String']['input'];
  secondOpponentId: Scalars['String']['input'];
  status: MatchStatus;
};

export type CreateMatchEventDto = {
  matchId: Scalars['String']['input'];
  minute: Scalars['Int']['input'];
  payload?: InputMaybe<Scalars['JSON']['input']>;
  playerId?: InputMaybe<Scalars['String']['input']>;
  teamId: Scalars['String']['input'];
  type: MatchEventType;
};

export type CreateNewsDto = {
  category: Scalars['String']['input'];
  content: Scalars['String']['input'];
  imageUrl: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreatePlayerDto = {
  firstName: Scalars['String']['input'];
  height: Scalars['Float']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  lastName: Scalars['String']['input'];
  position: PlayerPosition;
  prefferedFoot: PreferredFoot;
  teamId: Scalars['String']['input'];
  weight: Scalars['Float']['input'];
  yearOfBirth: Scalars['Float']['input'];
};

export type CreateTeamDto = {
  name: Scalars['String']['input'];
};

export type Match = {
  __typename?: 'Match';
  date: Scalars['Date']['output'];
  firstOpponent: Team;
  id: Scalars['ID']['output'];
  score1?: Maybe<Scalars['Int']['output']>;
  score2?: Maybe<Scalars['Int']['output']>;
  secondOpponent: Team;
  status: MatchStatus;
};

export type MatchEvent = {
  __typename?: 'MatchEvent';
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  match: Match;
  minute: Scalars['Float']['output'];
  payload?: Maybe<Scalars['JSON']['output']>;
  player?: Maybe<Player>;
  team: Team;
  type: MatchEventType;
};

export enum MatchEventType {
  FullTime = 'FULL_TIME',
  Goal = 'GOAL',
  GoalkeeperSave = 'GOALKEEPER_SAVE',
  HalfTime = 'HALF_TIME',
  PenaltyMissed = 'PENALTY_MISSED',
  PenaltyScored = 'PENALTY_SCORED',
  RedCard = 'RED_CARD',
  YellowCard = 'YELLOW_CARD'
}

export enum MatchStatus {
  Cancelled = 'CANCELLED',
  Finished = 'FINISHED',
  Live = 'LIVE',
  Scheduled = 'SCHEDULED'
}

export type Mutation = {
  __typename?: 'Mutation';
  adminLogin: AdminLoginResult;
  adminLogout: AdminLoginResult;
  createMatch: Match;
  createMatchEvent: MatchEvent;
  createNews: News;
  createPlayer: Player;
  createTeam: Team;
  deleteMatch: Match;
  deleteMatchEvent: MatchEvent;
  deleteNews: News;
  deletePlayer: Player;
  deleteTeam: Team;
  updateMatch: Match;
  updateNews: News;
  updatePlayer: Player;
  updateTeam: Team;
};


export type MutationAdminLoginArgs = {
  passkey: Scalars['String']['input'];
};


export type MutationCreateMatchArgs = {
  createMatchDto: CreateMatchDto;
};


export type MutationCreateMatchEventArgs = {
  createMatchEventDto: CreateMatchEventDto;
};


export type MutationCreateNewsArgs = {
  createNewsDto: CreateNewsDto;
};


export type MutationCreatePlayerArgs = {
  createPlayerDto: CreatePlayerDto;
};


export type MutationCreateTeamArgs = {
  createTeamDto: CreateTeamDto;
};


export type MutationDeleteMatchArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteMatchEventArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteNewsArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeletePlayerArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteTeamArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateMatchArgs = {
  id: Scalars['String']['input'];
  updateMatchDto: UpdateMatchDto;
};


export type MutationUpdateNewsArgs = {
  id: Scalars['String']['input'];
  updateNewsDto: UpdateNewsDto;
};


export type MutationUpdatePlayerArgs = {
  id: Scalars['String']['input'];
  updatePlayerDto: UpdatePlayerDto;
};


export type MutationUpdateTeamArgs = {
  id: Scalars['String']['input'];
  updateTeamDto: UpdateTeamDto;
};

export type News = {
  __typename?: 'News';
  category: Scalars['String']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  imageUrl: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type Player = {
  __typename?: 'Player';
  firstName: Scalars['String']['output'];
  height: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  lastName: Scalars['String']['output'];
  position: PlayerPosition;
  prefferedFoot: PreferredFoot;
  team: Team;
  weight: Scalars['Float']['output'];
  yearOfBirth: Scalars['Float']['output'];
};

export enum PlayerPosition {
  Defender = 'DEFENDER',
  Forward = 'FORWARD',
  Goalkeeper = 'GOALKEEPER',
  Midfielder = 'MIDFIELDER'
}

export enum PreferredFoot {
  Both = 'BOTH',
  Left = 'LEFT',
  Right = 'RIGHT'
}

export type Query = {
  __typename?: 'Query';
  health: Scalars['String']['output'];
  matchById?: Maybe<Match>;
  matchEvents: Array<MatchEvent>;
  matches: Array<Match>;
  news: Array<News>;
  newsById: News;
  playerById: Player;
  teamById: Team;
  teams: Array<Team>;
};


export type QueryMatchByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryMatchEventsArgs = {
  matchId: Scalars['String']['input'];
};


export type QueryNewsByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryPlayerByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryTeamByIdArgs = {
  id: Scalars['String']['input'];
};

export type Team = {
  __typename?: 'Team';
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  players?: Maybe<Array<Player>>;
};

export type UpdateMatchDto = {
  date?: InputMaybe<Scalars['Date']['input']>;
  firstOpponentId?: InputMaybe<Scalars['String']['input']>;
  score1?: InputMaybe<Scalars['Int']['input']>;
  score2?: InputMaybe<Scalars['Int']['input']>;
  secondOpponentId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<MatchStatus>;
};

export type UpdateNewsDto = {
  category?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePlayerDto = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['Float']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<PlayerPosition>;
  prefferedFoot?: InputMaybe<PreferredFoot>;
  teamId?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['Float']['input']>;
  yearOfBirth?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateTeamDto = {
  name?: InputMaybe<Scalars['String']['input']>;
};


export enum Queries {
  __typename = '__typename',
  health = 'health',
  matchById = 'matchById',
  matchEvents = 'matchEvents',
  matches = 'matches',
  news = 'news',
  newsById = 'newsById',
  playerById = 'playerById',
  teamById = 'teamById',
  teams = 'teams',
}
