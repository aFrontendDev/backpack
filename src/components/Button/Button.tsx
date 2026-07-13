import type { ReactNode } from 'react';
import type { ButtonProps } from './Button.types';
import './Button.scss';

interface Props extends ButtonProps {
  children?: ReactNode;
}

export default function Button({
  type = 'button',
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const classes = `button ${variant} ${className}`.trim();

  return (
    <button
      type={type}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}
