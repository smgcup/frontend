import { AlertCircle } from 'lucide-react';
import React from 'react';

type AuthErrorProps = {
  errorMessage: string | null;
};

const AuthError = ({ errorMessage }: AuthErrorProps) => {
  if (!errorMessage) return null;

  return (
    <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive dark:bg-destructive/20 dark:border-destructive/30">
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <p className="flex-1">{errorMessage}</p>
    </div>
  );
};

export default AuthError;
