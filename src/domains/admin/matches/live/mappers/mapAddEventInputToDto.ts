import type { CreateMatchEventDto } from '@/graphql';
import type { MatchEventType as GqlMatchEventType } from '@/graphql';
import type { AddEventInput } from '../contracts';

/**
 * Maps AddEventInput to CreateMatchEventDto for GraphQL mutation
 *
 * @param input - The AddEventInput from the form
 * @param matchId - The ID of the match
 * @returns CreateMatchEventDto ready for GraphQL mutation
 */
export const mapAddEventInputToDto = (input: AddEventInput, matchId: string): CreateMatchEventDto => {
  return {
    matchId,
    teamId: input.teamId,
    playerId: input.playerId ?? null,
    type: input.type as unknown as GqlMatchEventType,
    minute: input.minute,
    payload: input.payload ?? null,
  };
};
