import React from 'react';
import { FieldLabel } from '@/components/ui/field';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

type AuthFieldProps = {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required: boolean;
  disabled: boolean;
};
const AuthField = ({ label, name, type, placeholder, value, onChange, required, disabled }: AuthFieldProps) => {
  return (
    <Field>
      <FieldLabel htmlFor="email">{label}</FieldLabel>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="h-10"
      />
    </Field>
  );
};

export default AuthField;
