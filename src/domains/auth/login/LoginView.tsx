'use client';

import { useAuthView } from '../shared/hooks/useAuthView';
import LoginViewUi from './LoginViewUi';

const LoginView = () => {
  const { onLogin, onLoginInputChange, loginUserLoading, loginErrorMessage, loginInput } = useAuthView();

  return (
    <LoginViewUi
      onLogin={onLogin}
      onInputChange={onLoginInputChange}
      loginUserLoading={loginUserLoading}
      loginInput={loginInput}
      errorMessage={loginErrorMessage}
    />
  );
};

export default LoginView;
