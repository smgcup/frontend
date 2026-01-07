import { useQuery, useMutation } from '@apollo/client/react';
import {
  GetNewsDocument,
  GetNewsQuery,
  DeleteNewsDocument,
  DeleteNewsMutation,
  DeleteNewsMutationVariables,
} from '@/graphql';
import { mapNews } from '@/domains/news/mappers/mapNews';

export const useAdminNewsList = () => {
  const { data, loading: newsLoading, error: newsError, refetch } = useQuery<GetNewsQuery>(GetNewsDocument);

  const [deleteNewsMutation, { loading: deleteLoading }] = useMutation<DeleteNewsMutation, DeleteNewsMutationVariables>(
    DeleteNewsDocument,
  );

  const handleDeleteNews = async (id: string) => {
    await deleteNewsMutation({
      variables: { id },
    });
    await refetch();
  };

  return {
    news: (data?.news ?? []).map(mapNews),
    newsLoading,
    newsError,
    deleteLoading,
    onDeleteNews: handleDeleteNews,
    refetch,
  };
};
