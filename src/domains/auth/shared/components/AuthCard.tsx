import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Field, FieldGroup } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import AuthError from './AuthError';
import logoPng from '@/public/favicon.png';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import React from 'react';
import AuthField from './AuthField';
import { LoginInput } from '@/graphql';

type AuthCardProps = {
  //   children: React.ReactNode;
  title: string;
  description: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>, loginInput: LoginInput) => void;
  input: LoginInput;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  errorMessage: string | null;
};

const AuthCard = ({
  //   children,
  title,
  description,
  onSubmit,
  input,
  onInputChange,
  loading,
  errorMessage,
}: AuthCardProps) => {
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
                {loading ? <Loader2 className="animate-spin" /> : 'Sign in'}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default AuthCard;
