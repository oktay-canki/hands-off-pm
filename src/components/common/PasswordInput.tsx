'use client';

import Input, { InputProps } from '@/components/common/Input';
import StrengthMeter from '@/components/common/StrengthMeter';
import PasswordGenerator from '@/modules/password-generator/PasswordGenerator';
import cn from '@/utils/cn';
import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, useMemo, useState } from 'react';

const generator = new PasswordGenerator();

export type PasswordInputProps = InputProps & {
  containerClassName?: string;
  visibilityButtonClassName?: string;
  endAction?: React.ReactNode;
  forceVisible?: boolean;
  strengthMeter?: boolean;
};

const iconSizes = {
  sm: 'size-8',
  md: 'size-9',
  lg: 'size-10',
};

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      forceVisible,
      placeholder = 'Password',
      className,
      containerClassName,
      visibilityButtonClassName,
      value,
      onChange,
      endAction,
      strengthMeter = false,
      size = 'md',
      ...rest
    },
    ref,
  ) {
    const [internalVisible, setInternalVisible] = useState(false);

    const showPassword = forceVisible || internalVisible;

    const passwordStrength = useMemo(() => {
      const password = typeof value === 'string' ? value.trim() : '';

      if (!password) {
        return undefined;
      }

      return generator.estimateStrength(password).label;
    }, [value]);

    return (
      <div className={cn('flex w-full flex-col gap-2', containerClassName)}>
        <div className="relative w-full">
          <Input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            autoComplete="new-password"
            size={size}
            className={cn('pr-24', className)}
            {...rest}
          />

          <button
            type="button"
            onClick={() => setInternalVisible((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2',
              'flex items-center justify-center rounded-md',
              'text-surface/60 transition-colors',
              'hover:bg-primary hover:text-surface',
              'focus-visible:ring-2 focus-visible:ring-accent',
              iconSizes[size],
              visibilityButtonClassName,
            )}
          >
            {showPassword ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>

          {endAction}
        </div>

        {strengthMeter && <StrengthMeter strength={passwordStrength} />}
      </div>
    );
  },
);

export default PasswordInput;
