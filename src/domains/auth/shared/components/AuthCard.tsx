import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Field, FieldGroup } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import AuthError from './AuthError';
import logoPng from '@/public/favicon.png';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import React from 'react';
import AuthField from './AuthField';
import { LoginInput, RegisterUserInput } from '@/graphql';

type AuthInput = LoginInput | RegisterUserInput;

type AuthCardProps<T extends AuthInput> = {
  title: string;
  description: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>, input: T) => void;
  input: T;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  errorMessage: string | null;
};

const isRegisterInput = (input: AuthInput): input is RegisterUserInput => {
  return 'firstName' in input && 'lastName' in input && 'username' in input;
};

const AuthCard = <T extends AuthInput>({
  title,
  description,
  onSubmit,
  input,
  onInputChange,
  loading,
  errorMessage,
}: AuthCardProps<T>) => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="items-center text-center pb-2">
        <div className="mb-4 rounded-2xl from-primary/10 to-primary/5 p-4 flex items-center justify-center">
          <Image src={logoPng} alt="Logo" width={100} height={100} className="drop-shadow-md" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={(e) => onSubmit(e, input)}>
          <FieldGroup className="gap-5">
            {isRegisterInput(input) && (
              <>
                <AuthField
                  label="First Name"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  value={input.firstName}
                  onChange={onInputChange}
                  required={true}
                  disabled={loading}
                />
                <AuthField
                  label="Last Name"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={input.lastName}
                  onChange={onInputChange}
                  required={true}
                  disabled={loading}
                />
                <AuthField
                  label="Username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  value={input.username}
                  onChange={onInputChange}
                  required={true}
                  disabled={loading}
                />
              </>
            )}
            <AuthField
              label="Email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={input.email}
              onChange={onInputChange}
              required={true}
              disabled={loading}
            />
            <AuthField
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={input.password}
              onChange={onInputChange}
              required={true}
              disabled={loading}
            />
            <AuthError errorMessage={errorMessage} />
            <Field className="pt-2">
              <Button
                type="submit"
                size="lg"
                className="w-full h-11 text-base font-medium cursor-pointer"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" /> : isRegisterInput(input) ? 'Sign up' : 'Sign in'}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default AuthCard;
