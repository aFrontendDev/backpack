import type { ReactNode } from 'react';
import type { ButtonProps } from './Button.types';
import './Button.scss';

interface Props extends ButtonProps {
  children?: ReactNode;
}

export default function Button({
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  id,
  children,
}: Props) {
  const classes = `button ${variant} ${className}`.trim();

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      id={id}
    >
      {children}
    </button>
  );
}
