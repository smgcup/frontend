import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { CreateNewsDocument, CreateNewsMutation, CreateNewsMutationVariables, CreateNewsDto } from '@/graphql';

export const useAdminNewsCreate = () => {
  const router = useRouter();

  const [createNewsMutation, { loading: createLoading, error: createError }] = useMutation<
    CreateNewsMutation,
    CreateNewsMutationVariables
  >(CreateNewsDocument);

  const handleCreateNews = async (createNewsDto: CreateNewsDto) => {
    const { data } = await createNewsMutation({
      variables: { createNewsDto },
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
