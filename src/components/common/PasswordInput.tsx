'use client';
import cn from '@/utils/cn';
import { Eye, EyeOff } from 'lucide-react';
import { InputHTMLAttributes, useState } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  visible?: boolean;
};

export default function PasswordInput({
  visible,
  placeholder = 'Password',
  className,
  ...rest
}: Props) {
  const [isVisible, setIsVisible] = useState(false);

  const showText = visible || isVisible;

  return (
    <div className="w-full flex items-center justify-center">
      <input
        type={showText ? 'text' : 'password'}
        autoComplete="off"
        placeholder={placeholder}
        className={cn(
          'flex-1 rounded-md px-4 py-2 text-lg text-center',
          className,
        )}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setIsVisible((prev) => !prev)}
        aria-label={showText ? 'Hide password' : 'Show password'}
        aria-pressed={showText}
        className="rounded-full w-10 h-10 flex items-center justify-center"
      >
        {showText ? <EyeOff size={24} /> : <Eye size={24} />}
      </button>
    </div>
  );
}
