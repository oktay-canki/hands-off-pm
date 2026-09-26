import { Check } from 'lucide-react';
import cn from '@/utils/cn';

type Props = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
  name?: string;
};

const sizeStyles = {
  sm: {
    box: 'size-4',
    icon: 'size-3',
    text: 'text-sm',
    gap: 'gap-2',
  },
  md: {
    box: 'size-5',
    icon: 'size-3.5',
    text: 'text-sm',
    gap: 'gap-2.5',
  },
  lg: {
    box: 'size-6',
    icon: 'size-4',
    text: 'text-base',
    gap: 'gap-3',
  },
};

export default function Checkbox({
  checked = false,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className,
  id,
  name,
}: Props) {
  const styles = sizeStyles[size];

  return (
    <label
      htmlFor={id}
      className={cn(
        'inline-flex items-center select-none',
        styles.gap,
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className,
      )}
    >
      <span className="relative inline-flex shrink-0">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className={cn(
            'peer appearance-none rounded-sm border bg-primary transition-colors',
            styles.box,
            'border-secondary',
            'hover:border-surface',
            'checked:border-accent checked:bg-accent',
            'focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:cursor-not-allowed',
          )}
        />

        <Check
          strokeWidth={3}
          className={cn(
            'pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
            styles.icon,
            'text-background opacity-0 transition-opacity',
            'peer-checked:opacity-100',
          )}
        />
      </span>

      {label && (
        <span className={cn(styles.text, 'font-medium text-surface')}>
          {label}
        </span>
      )}
    </label>
  );
}
