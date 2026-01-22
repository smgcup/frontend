import React from 'react';
import AuthCard from '../shared/components/AuthCard';
import { RegisterUserInput } from '@/graphql';

type RegisterViewUiProps = {
  onRegister: (e: React.FormEvent<HTMLFormElement>, registerInput: RegisterUserInput) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  registerUserLoading: boolean;
  registerInput: RegisterUserInput;
  errorMessage: string | null;
};
const RegisterViewUi = ({
  onRegister,
  onInputChange,
  registerUserLoading,
  registerInput,
  errorMessage,
}: RegisterViewUiProps) => {
  return (
    <AuthCard
      title="Create an account!"
      description="Create an account to access your account."
      onSubmit={onRegister}
      input={registerInput}
      onInputChange={onInputChange}
      loading={registerUserLoading}
      errorMessage={errorMessage}
    />
  );
};

export default RegisterViewUi;
