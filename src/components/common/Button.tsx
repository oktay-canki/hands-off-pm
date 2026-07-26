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
  'inline-flex items-center justify-center rounded-md font-medium transition-colors outline-none disabled:opacity-50 disabled:pointer-events-none outline-none';

const variantStyles: Record<Variant, string> = {
  primary: 'bg-primary hover:bg-primary/90',
  secondary: 'bg-secondary hover:bg-secondary/80',
  outline:
    'border-2 border-primary bg-transparent hover:bg-primary hover:text-surface',
  ghost: 'bg-transparent hover:bg-primary',
  accent: 'bg-accent text-gray-900 hover:bg-accent/90',
  'accent-outline':
    'border-2 border-accent bg-transparent text-accent hover:bg-accent hover:text-gray-900',
  destructive: 'bg-danger text-white',
};

const sizeStyles: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-6 text-lg',
  icon: 'h-10 px-4',
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
