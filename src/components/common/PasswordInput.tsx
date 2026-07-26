'use client';
import Button from '@/components/common/Button';
import Input, { InputProps } from '@/components/common/Input';
import StrengthMeter from '@/components/common/StrengthMeter';
import PasswordGenerator from '@/modules/password-generator/PasswordGenerator';
import cn from '@/utils/cn';
import { Eye, EyeOff } from 'lucide-react';
import { useMemo, useState } from 'react';

export type PasswordInputProps = InputProps & {
  containerClassName?: string;
  visible?: boolean;
  strengthMeter?: boolean;
};

const iconStyles = {
  sm: 'h-8 w-8',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
};

export default function PasswordInput({
  visible,
  placeholder = 'Password',
  className,
  containerClassName,
  value,
  onChange,
  strengthMeter = false,
  size = 'md',
  ...rest
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  const passwordStrength = useMemo(() => {
    const trimmed = typeof value === 'string' ? value.trim() : '';
    if (!trimmed) return undefined;
    return new PasswordGenerator().estimateStrength(trimmed).label;
  }, [value]);

  const showText = visible || isVisible;

  return (
    <div className={cn('flex flex-col gap-2', containerClassName)}>
      <div className="flex items-center gap-2">
        <Input
          type={showText ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          className={cn('flex-1', className)}
          autoComplete="off"
          size={size}
          onChange={onChange}
          {...rest}
        />

        <Button
          onClick={() => setIsVisible((prev) => !prev)}
          aria-label={showText ? 'Hide password' : 'Show password'}
          aria-pressed={showText}
          className={cn('rounded-full p-0', iconStyles[size])}
          variant="accent"
        >
          {showText ? <EyeOff size={24} /> : <Eye size={24} />}
        </Button>
      </div>
      {strengthMeter && <StrengthMeter strength={passwordStrength} />}
    </div>
  );
}
