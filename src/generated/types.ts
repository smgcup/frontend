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
  Date: { input: string; output: string; }
  DateSimple: { input: string; output: string; }
};

export type AdminLoginResult = {
  __typename?: 'AdminLoginResult';
  ok: Scalars['Boolean']['output'];
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  /** JWT access token */
  accessToken: Scalars['String']['output'];
  /** Authenticated user */
  user: User;
};

export type CreateMatchDto = {
  date?: InputMaybe<Scalars['Date']['input']>;
  firstOpponentId: Scalars['String']['input'];
  location?: InputMaybe<MatchLocation>;
  round: Scalars['Int']['input'];
  secondOpponentId: Scalars['String']['input'];
  status: MatchStatus;
};

export type CreateMatchEventDto = {
  assistPlayerId?: InputMaybe<Scalars['String']['input']>;
  matchId: Scalars['String']['input'];
  minute: Scalars['Int']['input'];
  playerId?: InputMaybe<Scalars['String']['input']>;
  teamId: Scalars['String']['input'];
  type: MatchEventType;
};

export type CreateNewsDto = {
  category: Scalars['String']['input'];
  content: Scalars['String']['input'];
  image: ImageUploadInput;
  title: Scalars['String']['input'];
};

export type CreatePlayerDto = {
  class?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth: Scalars['Date']['input'];
  firstName: Scalars['String']['input'];
  height: Scalars['Float']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  lastName: Scalars['String']['input'];
  position: PlayerPosition;
  preferredFoot: PreferredFoot;
  teamId: Scalars['String']['input'];
  weight: Scalars['Float']['input'];
};

export type CreateTeamDto = {
  name: Scalars['String']['input'];
};

export type ImageUploadInput = {
  fileBase64: Scalars['String']['input'];
  mimeType: Scalars['String']['input'];
};

export enum LeaderboardSortType {
  Assists = 'ASSISTS',
  CleanSheets = 'CLEAN_SHEETS',
  Goals = 'GOALS',
  RedCards = 'RED_CARDS',
  YellowCards = 'YELLOW_CARDS'
}

export type LoginInput = {
  /** Email address */
  email: Scalars['String']['input'];
  /** Password */
  password: Scalars['String']['input'];
};

export type Match = {
  __typename?: 'Match';
  date?: Maybe<Scalars['Date']['output']>;
  firstOpponent: Team;
  id: Scalars['ID']['output'];
  location?: Maybe<MatchLocation>;
  round: Scalars['Int']['output'];
  score1?: Maybe<Scalars['Int']['output']>;
  score2?: Maybe<Scalars['Int']['output']>;
  secondOpponent: Team;
  status: MatchStatus;
};

export type MatchEvent = {
  __typename?: 'MatchEvent';
  assistPlayer?: Maybe<Player>;
  assistPlayerId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  match: Match;
  minute: Scalars['Float']['output'];
  player?: Maybe<Player>;
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

export enum MatchLocation {
  CkGreenSport = 'CK_GREEN_SPORT',
  SmgArena = 'SMG_ARENA'
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
  login: AuthResponse;
  register: AuthResponse;
  startMatch: Match;
  updateMatch: Match;
  updateNews: Scalars['Boolean']['output'];
  updatePlayer: Player;
  updateTeam: Team;
  uploadFile: UploadResponse;
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


export type MutationLoginArgs = {
  loginInput: LoginInput;
};


export type MutationRegisterArgs = {
  registerInput: RegisterUserInput;
};


export type MutationStartMatchArgs = {
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


export type MutationUploadFileArgs = {
  uploadFileDto: UploadFileDto;
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

export type PaginatedPlayersResponse = {
  __typename?: 'PaginatedPlayersResponse';
  hasMore: Scalars['Boolean']['output'];
  players: Array<Player>;
  totalCount: Scalars['Int']['output'];
};

export type Player = {
  __typename?: 'Player';
  age: Scalars['Float']['output'];
  class?: Maybe<Scalars['String']['output']>;
  dateOfBirth: Scalars['Date']['output'];
  firstName: Scalars['String']['output'];
  height: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  lastName: Scalars['String']['output'];
  position: PlayerPosition;
  preferredFoot: PreferredFoot;
  stats?: Maybe<PlayerStats>;
  team: Team;
  weight: Scalars['Float']['output'];
};

export enum PlayerPosition {
  Defender = 'DEFENDER',
  Forward = 'FORWARD',
  Goalkeeper = 'GOALKEEPER',
  Midfielder = 'MIDFIELDER'
}

export type PlayerStats = {
  __typename?: 'PlayerStats';
  assists: Scalars['Float']['output'];
  goalkeeperSaves: Scalars['Float']['output'];
  goals: Scalars['Float']['output'];
  penaltiesMissed: Scalars['Float']['output'];
  penaltiesScored: Scalars['Float']['output'];
  playerId: Scalars['ID']['output'];
  redCards: Scalars['Float']['output'];
  yellowCards: Scalars['Float']['output'];
};

export enum PreferredFoot {
  Both = 'BOTH',
  Left = 'LEFT',
  Right = 'RIGHT'
}

export type Query = {
  __typename?: 'Query';
  health: Scalars['String']['output'];
  matchById: Match;
  matchEvents: Array<MatchEvent>;
  matches: Array<Match>;
  news: Array<News>;
  newsById: News;
  playerById: Player;
  playersLeaderboard: PaginatedPlayersResponse;
  teamById: Team;
  teams: Array<Team>;
  user: User;
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


export type QueryPlayersLeaderboardArgs = {
  limit?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
  sortBy: LeaderboardSortType;
};


export type QueryTeamByIdArgs = {
  id: Scalars['String']['input'];
};

export type RegisterUserInput = {
  /** Email address */
  email: Scalars['String']['input'];
  /** First name */
  firstName: Scalars['String']['input'];
  /** Last name */
  lastName: Scalars['String']['input'];
  /** Password */
  password: Scalars['String']['input'];
  /** Username */
  username: Scalars['String']['input'];
};

export type Team = {
  __typename?: 'Team';
  captain?: Maybe<Player>;
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  players: Array<Player>;
};

export type UpdateMatchDto = {
  date?: InputMaybe<Scalars['Date']['input']>;
  firstOpponentId?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<MatchLocation>;
  round?: InputMaybe<Scalars['Int']['input']>;
  score1?: InputMaybe<Scalars['Int']['input']>;
  score2?: InputMaybe<Scalars['Int']['input']>;
  secondOpponentId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<MatchStatus>;
};

export type UpdateNewsDto = {
  category?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<ImageUploadInput>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePlayerDto = {
  class?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['Date']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['Float']['input']>;
  image?: InputMaybe<ImageUploadInput>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<PlayerPosition>;
  preferredFoot?: InputMaybe<PreferredFoot>;
  teamId?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateTeamDto = {
  captainId?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UploadFileDto = {
  bucket?: InputMaybe<Scalars['String']['input']>;
  fileBase64: Scalars['String']['input'];
  fileName: Scalars['String']['input'];
  mimeType: Scalars['String']['input'];
};

export type UploadResponse = {
  __typename?: 'UploadResponse';
  path: Scalars['String']['output'];
  signedUrl: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['Date']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  password: Scalars['String']['output'];
  username: Scalars['String']['output'];
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
  playersLeaderboard = 'playersLeaderboard',
  teamById = 'teamById',
  teams = 'teams',
  user = 'user',
}
