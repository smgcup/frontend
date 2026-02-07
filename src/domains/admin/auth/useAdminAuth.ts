import { useMutation } from '@apollo/client/react';
import { AdminLoginDocument, AdminLoginMutation, AdminLoginMutationVariables } from '@/graphql/';
import { setCookie } from '@/lib/cookies';
import { ADMIN_AUTH_COOKIE_NAME } from '@/lib/auth';
import { useRouter } from 'next/navigation';
export const useAdminAuth = () => {
  // GraphQL Mutations
  const router = useRouter();
  const [adminLoginMutation, { loading: adminLoginLoading, error: adminLoginError }] = useMutation<
    AdminLoginMutation,
    AdminLoginMutationVariables
  >(AdminLoginDocument);

  const handleAdminLogin = async (passkey: string) => {
    try {
      const { data, error } = await adminLoginMutation({
        variables: { passkey },
      });
      if (error || !data?.adminLogin?.ok || !data?.adminLogin?.token) {
        // throw error;
        return;
      }

      setCookie(ADMIN_AUTH_COOKIE_NAME, data.adminLogin.token, 7);
      router.push('/admin');
    } catch (error) {
      console.error(error);
    }
  };
  return {
    adminLoginLoading,
    adminLoginError: adminLoginError ?? null,
    onAdminLogin: handleAdminLogin,
  };
};
