import type { ReactNode } from 'react';
import type { CardProps } from './Card.types';
import './Card.scss';

interface Props extends CardProps {
  children?: ReactNode;
}

export default function Card({
  className = '',
  padding = 'medium',
  children,
}: Props) {
  const classes = `card padding-${padding} ${className}`.trim();

  return (
    <div className={classes}>
      {children}
    </div>
  );
}
