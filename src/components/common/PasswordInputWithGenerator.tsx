'use client';

import PasswordInput, {
  PasswordInputProps,
} from '@/components/common/PasswordInput';
import { useState } from 'react';
import PasswordGeneratorControl from '@/components/common/PasswordGeneratorControl';

import Button from '@/components/common/Button';
import { Dices, X } from 'lucide-react';
import cn from '@/utils/cn';

type Props = Omit<PasswordInputProps, 'value' | 'onChange'> & {
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
    <div>
      <div className="flex flex-1 mb-2">
        <PasswordInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          visible={showGenerator}
          containerClassName="w-full"
          className={cn(showGenerator && 'text-center tracking-widest')}
          {...rest}
        />

        <Button
          onClick={() => setShowGenerator((prev) => !prev)}
          variant="ghost"
          className="p-2 ml-2"
        >
          {!showGenerator ? <Dices size={24} /> : <X size={24} />}
        </Button>
      </div>
      {showGenerator && (
        <PasswordGeneratorControl
          value={value}
          onChange={(pw) => onChange(pw)}
          onUsePassword={() => setShowGenerator(false)}
        />
      )}
    </div>
  );
}
