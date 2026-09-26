import cn from '@/utils/cn';
import { TextareaHTMLAttributes } from 'react';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Textarea({ className, ...rest }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'min-h-40 w-full resize-y rounded-md border bg-transparent px-3 py-2',
        'text-sm text-surface transition-colors outline-none',
        'border-secondary bg-secondary/30',
        'placeholder:text-surface/40',
        'hover:border-secondary/80',
        'focus:border-surface focus-visible:ring-2 focus-visible:ring-surface',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...rest}
    />
  );
}
