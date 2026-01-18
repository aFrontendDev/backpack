import type { ReactNode } from 'react';
import type { MessageProps } from './Message.types';
import './Message.scss';

interface Props extends MessageProps {
  children?: ReactNode;
}

export default function Message({
  type = 'info',
  id,
  className = '',
  children,
}: Props) {
  const classes = `message ${type} ${className}`.trim();

  return (
    <p className={classes} id={id}>
      {children}
    </p>
  );
}
