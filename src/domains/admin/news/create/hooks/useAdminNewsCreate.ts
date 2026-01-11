import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { CreateNewsDocument, CreateNewsMutation, CreateNewsMutationVariables } from '@/graphql';
import type { NewsCreate } from '@/domains/news/contracts';
import { mapNewsCreateToDto } from '@/domains/news/mappers/mapNewsDto';

export const useAdminNewsCreate = () => {
  const router = useRouter();

  const [createNewsMutation, { loading: createLoading, error: createError }] = useMutation<
    CreateNewsMutation,
    CreateNewsMutationVariables
  >(CreateNewsDocument);

  const handleCreateNews = async (createNews: NewsCreate) => {
    const { data } = await createNewsMutation({
      variables: { createNewsDto: mapNewsCreateToDto(createNews) },
    });

    if (data?.createNews.id) {
      router.push('/admin/news');
    }

    return data;
  };

  return {
    createLoading,
    createError,
    onCreateNews: handleCreateNews,
  };
};
