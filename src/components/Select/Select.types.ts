import type { SelectHTMLAttributes, ReactNode } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  children?: ReactNode; // allow standard <option> children as well
}
