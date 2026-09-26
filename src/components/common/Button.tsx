import cn from '@/utils/cn';
import { ButtonHTMLAttributes } from 'react';

type Variant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'accent'
  | 'accent-outline'
  | 'destructive';

type Size = 'sm' | 'md' | 'lg' | 'icon';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const baseStyles =
  'inline-flex items-center justify-center rounded-md font-medium transition-colors outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-surface';

const variantStyles: Record<Variant, string> = {
  primary: 'bg-primary text-surface hover:bg-primary/80 active:bg-primary/70',

  secondary:
    'bg-secondary text-surface hover:bg-secondary/80 active:bg-secondary/70',

  outline:
    'border border-secondary bg-transparent text-surface hover:bg-primary active:bg-primary/80',

  ghost: 'bg-transparent text-surface hover:bg-primary active:bg-primary/80',

  accent: 'bg-accent text-background hover:bg-accent/90 active:bg-accent/80',

  'accent-outline':
    'border border-accent bg-transparent text-accent hover:bg-accent hover:text-background active:bg-accent/90',

  destructive: 'bg-danger text-white hover:bg-danger/90 active:bg-danger/80',
};

const sizeStyles: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'size-10',
};

export default function Button({
  className,
  type = 'button',
  variant = 'primary',
  size = 'md',
  ...rest
}: ButtonProps) {
  return (
    <button
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
