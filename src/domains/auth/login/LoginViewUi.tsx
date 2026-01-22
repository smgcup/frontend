import React from 'react';

import { LoginInput } from '@/graphql';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthError from '../shared/components/AuthError';
import logoPng from '@/public/favicon.png';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import AuthCard from '../shared/components/AuthCard';
type LoginViewUiProps = {
  onLogin: (e: React.FormEvent<HTMLFormElement>, loginInput: LoginInput) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loginUserLoading: boolean;
  loginInput: LoginInput;
  errorMessage: string | null;
};

const LoginViewUi = ({ onLogin, onInputChange, loginUserLoading, loginInput, errorMessage }: LoginViewUiProps) => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-linear-to-b from-background to-muted/30 p-6 md:p-10">
      <div className="w-full max-w-md">
        <AuthCard
          // children={<></>}
          title="Welcome back!"
          description="Login to access your account."
          onSubmit={onLogin}
          input={loginInput}
          onInputChange={onInputChange}
          loading={loginUserLoading}
          errorMessage={errorMessage}
        />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <a href="#" className="text-primary hover:underline font-medium">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginViewUi;
