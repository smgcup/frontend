import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <div className="flex min-h-svh flex-col items-center justify-center bg-linear-to-b from-background to-muted/30 p-6 md:p-10">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </AuthProvider>
  );
};

export default AuthLayout;
