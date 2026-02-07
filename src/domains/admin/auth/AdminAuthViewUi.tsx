import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ErrorLike } from '@apollo/client';
import { Input } from '@/components/ui/input';
type AdminAuthViewUiProps = {
  onAdminLogin: (passkey: string) => void;
  adminLoginLoading: boolean;
  adminLoginError: ErrorLike | null;
};
const AdminAuthViewUi = ({ onAdminLogin, adminLoginLoading, adminLoginError }: AdminAuthViewUiProps) => {
  const [input, setInput] = useState<{ passkey: string }>({ passkey: '' });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, passkey: e.target.value });
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Admin Auth</h1>
      <Input
        type="text"
        placeholder="Passkey"
        className="w-full max-w-md mt-4"
        value={input.passkey}
        onChange={handleInputChange}
      />
      <Button
        type="button"
        disabled={adminLoginLoading}
        onClick={() => onAdminLogin(input.passkey)}
        className="w-full max-w-md mt-4"
      >
        Login
      </Button>
    </div>
  );
};

export default AdminAuthViewUi;
