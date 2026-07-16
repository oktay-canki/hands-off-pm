'use client';

import PasswordInput from '@/components/common/PasswordInput';
import { InputHTMLAttributes, useState } from 'react';
import PasswordGeneratorControl from '@/components/common/PasswordGeneratorControl';

type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
> & {
  value: string;
  onChange: (password: string) => void;
};

export default function PasswordInputWithGenerator({
  value,
  onChange,
  ...rest
}: Props) {
  const [showGenerator, setShowGenerator] = useState(false);

  return (
    <>
      <PasswordInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        visible={showGenerator}
        {...rest}
      />

      {showGenerator && (
        <>
          <button
            type="button"
            onClick={() => {
              setShowGenerator(false);
            }}
          >
            Use this password
          </button>
          <button
            type="button"
            onClick={() => {
              onChange('');
              setShowGenerator(false);
            }}
          >
            Cancel
          </button>
          <PasswordGeneratorControl
            value={value}
            onChange={(pw) => onChange(pw)}
          />
        </>
      )}

      {!showGenerator && (
        <button onClick={() => setShowGenerator(true)}>
          Password Generator
        </button>
      )}
    </>
  );
}
