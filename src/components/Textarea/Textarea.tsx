import type { TextareaProps } from './Textarea.types';
import './Textarea.scss';

export default function Textarea({
  className = '',
  ...props
}: TextareaProps) {
  const classes = `textarea ${className}`.trim();

  return (
    <textarea
      className={classes}
      {...props}
    />
  );
}
