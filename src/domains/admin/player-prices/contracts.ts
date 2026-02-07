export type PlayerPriceEntry = {
  playerId: string;
  firstName: string;
  lastName: string;
  position?: string;
  teamName: string;
  displayName: string;
  price: string;
  hasFantasyData: boolean;
};

export type SortField = 'name' | 'team';
