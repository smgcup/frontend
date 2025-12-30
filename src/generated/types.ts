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
};

export type AdminLoginResult = {
  __typename?: 'AdminLoginResult';
  ok: Scalars['Boolean']['output'];
};

export type CreatePlayerDto = {
  firstName: Scalars['String']['input'];
  height: Scalars['Float']['input'];
  imageUrl: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  teamId: Scalars['String']['input'];
  yearOfBirth: Scalars['Float']['input'];
};

export type CreateTeamDto = {
  name: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  adminLogin: AdminLoginResult;
  adminLogout: AdminLoginResult;
  createPlayer: Player;
  createTeam: Team;
};


export type MutationAdminLoginArgs = {
  passkey: Scalars['String']['input'];
};


export type MutationCreatePlayerArgs = {
  createPlayerDto: CreatePlayerDto;
};


export type MutationCreateTeamArgs = {
  createTeamDto: CreateTeamDto;
};

export type Player = {
  __typename?: 'Player';
  firstName: Scalars['String']['output'];
  height: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  lastName: Scalars['String']['output'];
  team: Team;
  yearOfBirth: Scalars['Float']['output'];
};

export type Query = {
  __typename?: 'Query';
  health: Scalars['String']['output'];
  playerById: Player;
  teamById: Team;
  teams: Array<Team>;
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


export enum Queries {
  __typename = '__typename',
  health = 'health',
  playerById = 'playerById',
  teamById = 'teamById',
  teams = 'teams',
}
