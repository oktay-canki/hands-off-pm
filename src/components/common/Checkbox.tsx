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
  sm: { box: 'w-4 h-4', icon: 'w-3 h-3', text: 'text-sm', gap: 'gap-2' },
  md: { box: 'w-5 h-5', icon: 'w-3.5 h-3.5', text: 'text-sm', gap: 'gap-3' },
  lg: { box: 'w-6 h-6', icon: 'w-4 h-4', text: 'text-base', gap: 'gap-3' },
};

export default function Checkbox({
  checked = false,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className = '',
  id,
  name,
}: Props) {
  return (
    <label
      htmlFor={id}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      className={cn(
        'inline-flex items-start select-none cursor-pointer',
        sizeStyles[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      <span
        className="relative inline-flex shrink-0 mt-0.5"
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => {
            onChange?.(e.target.checked);
          }}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          className={`
            peer appearance-none ${sizeStyles[size].box} rounded-sm border-2
            border-surface bg-primary
            transition-all duration-150 ease-out
            checked:bg-surface checked:border-primary
            hover:border-secondary peer-checked:hover:border-secondary
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2
            disabled:cursor-not-allowed hover:cursor-pointer
          `}
        />
        <Check
          strokeWidth={3}
          className={`
            ${sizeStyles[size].box} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            text-primary opacity-0 scale-50
            peer-checked:opacity-100 peer-checked:scale-100
            transition-all duration-150 ease-out
            pointer-events-none block
          `}
        />
      </span>

      {label && (
        <span className="flex flex-col">
          <span
            className={`${sizeStyles[size].text} font-medium text-gray-900`}
          >
            {label}
          </span>
        </span>
      )}
    </label>
  );
}
