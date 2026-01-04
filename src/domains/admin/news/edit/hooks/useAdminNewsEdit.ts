import { useQuery, useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import {
  GetNewsByIdDocument,
  GetNewsByIdQuery,
  GetNewsByIdQueryVariables,
  UpdateNewsDocument,
  UpdateNewsMutation,
  UpdateNewsMutationVariables,
  UpdateNewsDto,
} from '@/graphql';

export const useAdminNewsEdit = (newsId: string) => {
  const router = useRouter();

  const {
    data,
    loading: newsLoading,
    error: newsError,
  } = useQuery<GetNewsByIdQuery, GetNewsByIdQueryVariables>(GetNewsByIdDocument, {
    variables: { newsByIdId: newsId },
    skip: !newsId,
  });

  const [updateNewsMutation, { loading: updateLoading, error: updateError }] = useMutation<
    UpdateNewsMutation,
    UpdateNewsMutationVariables
  >(UpdateNewsDocument);

  const handleUpdateNews = async (updateNewsDto: UpdateNewsDto) => {
    const { data } = await updateNewsMutation({
      variables: {
        id: newsId,
        updateNewsDto,
      },
    });

    if (data?.updateNews.id) {
      router.push('/admin/news');
    }

    return data;
  };

  return {
    news: data?.newsById ?? null,
    newsLoading,
    newsError,
    updateLoading,
    updateError,
    onUpdateNews: handleUpdateNews,
  };
};
