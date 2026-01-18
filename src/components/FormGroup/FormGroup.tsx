import type { ReactNode } from 'react';
import type { FormGroupProps } from './FormGroup.types';
import './FormGroup.scss';

interface Props extends FormGroupProps {
  children?: ReactNode;
}

export default function FormGroup({
  label,
  htmlFor,
  hint,
  error,
  required = false,
  className = '',
  children,
}: Props) {
  const classes = `form-group ${className}`.trim();

  return (
    <div className={classes}>
      {label && (
        <label htmlFor={htmlFor} className={required ? 'required' : ''}>
          {label}
        </label>
      )}
      {children}
      {hint && !error && <small className="hint">{hint}</small>}
      {error && <small className="error-message">{error}</small>}
    </div>
  );
}
