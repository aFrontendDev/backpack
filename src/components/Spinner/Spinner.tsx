import './Spinner.scss';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function Spinner({ size = 'medium', className = '' }: SpinnerProps) {
  return (
    <span
      className={`spinner spinner-${size} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
