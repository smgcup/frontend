'use client';

import React from 'react';
import { useAuthView } from '../shared/hooks/useAuthView';
import RegisterViewUi from './RegisterViewUi';
const RegisterView = () => {
  const { onRegister, onRegisterInputChange, registerUserLoading, registerErrorMessage, registerInput } = useAuthView();

  return (
    <RegisterViewUi
      onRegister={onRegister}
      onInputChange={onRegisterInputChange}
      registerUserLoading={registerUserLoading}
      registerInput={registerInput}
      errorMessage={registerErrorMessage}
    />
  );
};

export default RegisterView;
