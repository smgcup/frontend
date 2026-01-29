'use client';

import { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client/react';
import { type ErrorLike } from '@apollo/client';
import {
  CreatePredictionDocument,
  UpdatePredictionDocument,
  type CreatePredictionMutation,
  type CreatePredictionMutationVariables,
  type UpdatePredictionMutation,
  type UpdatePredictionMutationVariables,
} from '@/graphql';
import { getTranslationCodeMessage } from '@/errors/getTranslationCode';

type UsePredictionReturn = {
  savePrediction: (
    matchId: string,
    predictedScore1: number,
    predictedScore2: number,
    existingPredictionId?: string,
  ) => Promise<string | null>;
  loading: boolean;
  submittingMatchId: string | null;
  errorMessage: string | null;
  clearError: () => void;
};

export const usePrediction = (): UsePredictionReturn => {
  const [submittingMatchId, setSubmittingMatchId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [createPrediction, { loading: createLoading }] = useMutation<
    CreatePredictionMutation,
    CreatePredictionMutationVariables
  >(CreatePredictionDocument);

  const [updatePrediction, { loading: updateLoading }] = useMutation<
    UpdatePredictionMutation,
    UpdatePredictionMutationVariables
  >(UpdatePredictionDocument);

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const savePrediction = useCallback(
    async (
      matchId: string,
      predictedScore1: number,
      predictedScore2: number,
      existingPredictionId?: string,
    ): Promise<string | null> => {
      setSubmittingMatchId(matchId);
      setErrorMessage(null);

      try {
        if (existingPredictionId) {
          const result = await updatePrediction({
            variables: {
              id: existingPredictionId,
              input: { predictedScore1, predictedScore2 },
            },
          });
          // TODO: Add toast notification for successful update
          return result.data?.updatePrediction.id ?? null;
        } else {
          const result = await createPrediction({
            variables: {
              input: { matchId, predictedScore1, predictedScore2 },
            },
          });
          // TODO: Add toast notification for successful create
          return result.data?.createPrediction.id ?? null;
        }
      } catch (error) {
        const message = getTranslationCodeMessage(error as ErrorLike);
        setErrorMessage(message);
        // TODO: Add toast notification for error
        return null;
      } finally {
        setSubmittingMatchId(null);
      }
    },
    [createPrediction, updatePrediction],
  );

  return {
    savePrediction,
    loading: createLoading || updateLoading,
    submittingMatchId,
    errorMessage,
    clearError,
  };
};
