import cn from '@/utils/cn';
import { InputHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  variant?: Variant;
  size?: Size;
};

const baseStyles =
  'rounded-md border-2 outline-none transition-colors disabled:opacity-50 disabled:pointer-events-none placeholder:text-surface/50';

const variantStyles: Record<Variant, string> = {
  primary: 'bg-secondary border-secondary focus:border-surface',
  secondary: 'bg-primary border-primary focus:border-background',
  outline: 'bg-transparent border-secondary focus:border-surface',
  ghost:
    'bg-transparent border-transparent hover:bg-mutedbackground focus:border-surface',
};

const sizeStyles: Record<Size, string> = {
  sm: 'py-1 px-3 text-sm',
  md: 'py-2 px-4 text-base',
  lg: 'py-3 px-6 text-lg',
};

export default function Input({
  className,
  type = 'text',
  variant = 'primary',
  size = 'md',
  ...rest
}: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...rest}
    />
  );
}
