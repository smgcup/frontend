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
        <Card className="shadow-lg">
          <CardHeader className="items-center text-center pb-2">
            <div className="mb-4 rounded-2xl from-primary/10 to-primary/5 p-4 flex items-center justify-center">
              <Image src={logoPng} alt="Logo" width={100} height={100} className="drop-shadow-md" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome back!</CardTitle>
            <CardDescription className="text-muted-foreground">Login to access your account.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={(e) => onLogin(e, loginInput)}>
              <FieldGroup className="gap-5">
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginInput.email}
                    onChange={(e) => onInputChange(e)}
                    required
                    disabled={loginUserLoading}
                    className="h-10"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={loginInput.password}
                    onChange={(e) => onInputChange(e)}
                    required
                    disabled={loginUserLoading}
                    className="h-10"
                  />
                </Field>
                <AuthError errorMessage={errorMessage} />
                <Field className="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-11 text-base font-medium cursor-pointer"
                    disabled={loginUserLoading}
                  >
                    {loginUserLoading ? <Loader2 className="animate-spin" /> : 'Sign in'}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
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
