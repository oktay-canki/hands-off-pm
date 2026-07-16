'use client';
import { InputHTMLAttributes, useState } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  visible?: boolean;
};

export default function PasswordInput({
  visible,
  placeholder = 'Password',
  ...rest
}: Props) {
  const [isVisible, setIsVisible] = useState(false);

  const showText = visible || isVisible;

  return (
    <div>
      <input
        type={showText ? 'text' : 'password'}
        autoComplete="off"
        placeholder={placeholder}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setIsVisible((prev) => !prev)}
        aria-label={showText ? 'Hide password' : 'Show password'}
        aria-pressed={showText}
      >
        {showText ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}
