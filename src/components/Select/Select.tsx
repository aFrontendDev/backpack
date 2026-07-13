import type { SelectProps } from './Select.types';
import './Select.scss';

export default function Select({
  className = '',
  options,
  children,
  ...props
}: SelectProps) {
  const classes = `select ${className}`.trim();

  return (
    <select
      className={classes}
      {...props}
    >
      {options ? (
        options.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))
      ) : (
        children
      )}
    </select>
  );
}
