import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-linear-to-b from-background to-muted/30 p-6 md:p-10">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
};

export default AuthLayout;
