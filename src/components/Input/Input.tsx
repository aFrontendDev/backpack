import type { InputProps } from './Input.types';
import './Input.scss';

export default function Input({
  type = 'text',
  name,
  id,
  placeholder = '',
  required = false,
  disabled = false,
  value,
  minLength,
  maxLength,
  pattern,
  className = '',
  onChange,
}: InputProps) {
  const classes = `input ${className}`.trim();

  return (
    <input
      type={type}
      name={name}
      id={id ?? name}
      className={classes}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      value={value}
      minLength={minLength}
      maxLength={maxLength}
      pattern={pattern}
      onChange={onChange}
    />
  );
}
