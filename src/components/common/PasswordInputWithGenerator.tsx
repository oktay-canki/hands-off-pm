'use client';

import PasswordInput, {
  PasswordInputProps,
} from '@/components/common/PasswordInput';
import PasswordGeneratorControl from '@/components/common/PasswordGeneratorControl';
import cn from '@/utils/cn';
import { Dices, X } from 'lucide-react';
import { useState } from 'react';

type Props = Omit<PasswordInputProps, 'value' | 'onChange'> & {
  value: string;
  onChange: (password: string) => void;
};

export default function PasswordInputWithGenerator({
  value,
  onChange,
  className,
  ...rest
}: Props) {
  const [showGenerator, setShowGenerator] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <PasswordInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        containerClassName="w-full"
        className={className}
        visibilityButtonClassName="right-11"
        endAction={
          <button
            type="button"
            onClick={() => setShowGenerator((prev) => !prev)}
            aria-label={
              showGenerator
                ? 'Hide password generator'
                : 'Show password generator'
            }
            aria-expanded={showGenerator}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2',
              'flex size-9 items-center justify-center rounded-md',
              'text-surface/60 transition-colors',
              'hover:bg-primary hover:text-surface',
              'focus-visible:ring-2 focus-visible:ring-accent',
            )}
          >
            {showGenerator ? (
              <X className="size-5" />
            ) : (
              <Dices className="size-5" />
            )}
          </button>
        }
        {...rest}
      />

      {showGenerator && (
        <div className="rounded-lg border border-secondary/50 bg-primary/30 p-4">
          <PasswordGeneratorControl
            value={value}
            onChange={onChange}
            onUsePassword={() => setShowGenerator(false)}
          />
        </div>
      )}
    </div>
  );
}
