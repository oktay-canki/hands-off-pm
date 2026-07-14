'use client';
import { useState } from 'react';

type Props = {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function PasswordInput({
  value,
  onChange,
  placeholder = 'Password',
  disabled = false,
}: Props) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <input
        type={isVisible ? 'text' : 'password'}
        value={value}
        onChange={(e) => {
          if (onChange) onChange(e.target.value);
        }}
        autoComplete="off"
        placeholder={placeholder}
        disabled={disabled}
      />
      <button
        type="button"
        onClick={() => setIsVisible((prev) => !prev)}
        aria-label={isVisible ? 'Hide password' : 'Show password'}
        aria-pressed={isVisible}
      >
        {isVisible ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}
