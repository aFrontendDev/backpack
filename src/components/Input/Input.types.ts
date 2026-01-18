import type { ChangeEvent } from 'react';

export interface InputProps {
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
  name: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  className?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
