'use client';

import { useAuthView } from './hooks/useAuthView';
import LoginViewUi from './LoginViewUi';

const LoginView = () => {
  const { onLogin, onInputChange, loginUserLoading, errorMessage, loginInput } = useAuthView();

  return (
    <LoginViewUi
      onLogin={onLogin}
      onInputChange={onInputChange}
      loginUserLoading={loginUserLoading}
      loginInput={loginInput}
      errorMessage={errorMessage}
    />
  );
};

export default LoginView;
