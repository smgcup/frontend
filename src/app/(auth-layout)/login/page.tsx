import { Suspense } from 'react';
import LoginView from '@/domains/auth/login/LoginView';

const page = () => {
  return (
    <Suspense fallback={null}>
      <LoginView />
    </Suspense>
  );
};

export default page;
