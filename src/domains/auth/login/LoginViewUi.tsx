import React from 'react';
import { AlertCircle } from 'lucide-react';

import { LoginInput } from '@/graphql';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type LoginViewUiProps = {
  onLogin: (e: React.FormEvent<HTMLFormElement>, loginInput: LoginInput) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loginUserLoading: boolean;
  loginInput: LoginInput;
  errorMessage: string | null;
};

const LoginViewUi = ({ onLogin, onInputChange, loginUserLoading, loginInput, errorMessage }: LoginViewUiProps) => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-xl">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Team Login</CardTitle>
              <CardDescription>Enter your credentials to access your team account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => onLogin(e, loginInput)}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="team@example.com"
                      value={loginInput.email}
                      onChange={(e) => onInputChange(e)}
                      required
                      disabled={loginUserLoading}
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
                    />
                  </Field>
                  {errorMessage && (
                    <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive dark:bg-destructive/20 dark:border-destructive/30">
                      <AlertCircle className="mt-0.5 size-4 shrink-0" />
                      <p className="flex-1">{errorMessage}</p>
                    </div>
                  )}
                  <Field>
                    <Button type="submit" className="w-full" disabled={loginUserLoading}>
                      {loginUserLoading ? 'Signing in...' : 'Sign in'}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginViewUi;
