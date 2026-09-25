'use client';

import cn from '@/utils/cn';
import { forwardRef, InputHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  variant?: Variant;
  size?: Size;
};

const baseStyles =
  'w-full rounded-md border bg-transparent text-surface transition-colors outline-none placeholder:text-surface/40 focus-visible:ring-2 focus-visible:ring-surface disabled:cursor-not-allowed disabled:opacity-50';

const variantStyles: Record<Variant, string> = {
  primary: 'border-secondary bg-secondary/30 hover:border-secondary/80',
  secondary: 'border-primary bg-primary hover:border-secondary ',
  outline: 'border-secondary bg-transparent hover:border-secondary/80 ',
  ghost: 'border-transparent bg-transparent hover:bg-primary/60 ',
};

const sizeStyles: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = 'text', variant = 'primary', size = 'md', ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
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
});

export default Input;
