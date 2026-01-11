import { useQuery, useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import {
  GetNewsByIdDocument,
  GetNewsByIdQuery,
  GetNewsByIdQueryVariables,
  UpdateNewsDocument,
  UpdateNewsMutation,
  UpdateNewsMutationVariables,
} from '@/graphql';
import type { NewsUpdate } from '@/domains/news/contracts';
import { mapNewsById } from '@/domains/news/mappers/mapNews';
import { mapNewsUpdateToDto } from '@/domains/news/mappers/mapNewsDto';

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

  const handleUpdateNews = async (updateNews: NewsUpdate) => {
    const { data } = await updateNewsMutation({
      variables: {
        id: newsId,
        updateNewsDto: mapNewsUpdateToDto(updateNews),
      },
    });

    if (data?.updateNews.id) {
      router.push('/admin/news');
    }

    return data;
  };

  return {
    news: data?.newsById ? mapNewsById(data.newsById) : null,
    newsLoading,
    newsError,
    updateLoading,
    updateError,
    onUpdateNews: handleUpdateNews,
  };
};
