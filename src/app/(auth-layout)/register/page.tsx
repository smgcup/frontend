import { Suspense } from 'react';
import RegisterView from '@/domains/auth/register/RegisterView';

const page = () => {
  return (
    <Suspense fallback={null}>
      <RegisterView />
    </Suspense>
  );
};

export default page;
