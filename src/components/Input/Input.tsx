import type { InputProps } from './Input.types';
import './Input.scss';

export default function Input({
  type = 'text',
  className = '',
  ...props
}: InputProps) {
  const classes = `input ${className}`.trim();

  return (
    <input
      type={type}
      className={classes}
      {...props}
    />
  );
}
