import cn from '@/utils/cn';
import { TextareaHTMLAttributes } from 'react';

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  children?: React.ReactNode;
  className?: string;
};

export default function Textarea({ children, className, ...rest }: Props) {
  return (
    <textarea
      className={cn(
        'w-full h-40 px-4 py-2 rounded-md bg-secondary border-2 border-secondary focus:border-surface outline-none',
        className,
      )}
      {...rest}
    >
      {children}
    </textarea>
  );
}
