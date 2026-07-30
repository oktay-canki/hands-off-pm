'use client';

import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import PasswordGenerator, {
  DEFAULT_GENERATOR_OPTIONS,
} from '@/modules/password-generator/PasswordGenerator';
import cn from '@/utils/cn';
import { Shuffle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Props = {
  value?: string;
  onChange?: (password: string) => void;
  onUsePassword?: (password: string) => void;
};

export default function PasswordGeneratorControl({
  value,
  onChange,
  onUsePassword,
}: Props) {
  const [generatedPassword, setGeneratedPassword] = useState(() => {
    if (value) return value;
    const generator = new PasswordGenerator();
    return generator.generate();
  });

  // generator options
  const [length, setLength] = useState(DEFAULT_GENERATOR_OPTIONS.length);
  const [includeLowercase, setIncludeLowerCase] = useState(
    DEFAULT_GENERATOR_OPTIONS.includeLowercase,
  );
  const [includeUppercase, setIncludeUpperCase] = useState(
    DEFAULT_GENERATOR_OPTIONS.includeUppercase,
  );
  const [includeNumbers, setIncludeNumbers] = useState(
    DEFAULT_GENERATOR_OPTIONS.includeNumbers,
  );
  const [includeSymbols, setIncludeSymbols] = useState(
    DEFAULT_GENERATOR_OPTIONS.includeSymbols,
  );
  const [excludeSimilarCharacters, setExcludeSimilarCharacters] = useState(
    DEFAULT_GENERATOR_OPTIONS.excludeSimilarCharacters,
  );
  const [excludeAmbiguousSymbols, setExcludeAmbiguousSymbols] = useState(
    DEFAULT_GENERATOR_OPTIONS.excludeAmbiguousSymbols,
  );

  useEffect(() => {
    if (!value && generatedPassword) {
      onChange?.(generatedPassword);
    }
  }, [value, onChange, generatedPassword]);

  function generateNewPassword() {
    try {
      const generator = new PasswordGenerator();
      const pw = generator.generate({
        length,
        includeLowercase,
        includeUppercase,
        includeNumbers,
        includeSymbols,
        excludeSimilarCharacters,
        excludeAmbiguousSymbols,
      });
      setGeneratedPassword(pw);
      onChange?.(pw);
    } catch (error) {
      let msg =
        'An error occured while generating password with given options.';
      if (error instanceof Error && error.message) {
        msg = error.message;
      }

      toast.error(msg);
    }
  }

  return (
    <>
      <div className="flex gap-2 mb-2">
        <Button
          className="flex-1"
          onClick={() => onUsePassword?.(generatedPassword)}
          variant="outline"
        >
          Use this password
        </Button>
        <Button className="flex-1 gap-2" onClick={generateNewPassword}>
          Generate <Shuffle size={16} />
        </Button>
      </div>
      <div className="w-full mb-4">
        <label htmlFor="pw-length" className="block text-center">
          Length
        </label>
        <Input
          id="pw-length"
          type="number"
          min={8}
          max={32}
          defaultValue={8}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full text-center"
        />
      </div>

      <div className="flex items-center justify-center mb-4 gap-2 border border-surface px-2 pt-6 pb-4 rounded-md relative">
        <label className="block absolute top-0 left-0 translate-x-4 -translate-y-1/2 bg-background px-2">
          Characters
        </label>
        <Button
          className={cn(
            'block shrink-0 flex-1',
            !includeUppercase && 'line-through hover:no-underline',
            includeUppercase && 'hover:line-through',
          )}
          variant={includeUppercase ? 'primary' : 'ghost'}
          onClick={() => setIncludeUpperCase((prev) => !prev)}
        >
          A - Z
        </Button>

        <Button
          className={cn(
            'block shrink-0 flex-1',
            !includeLowercase && 'line-through hover:no-underline',
            includeLowercase && 'hover:line-through',
          )}
          variant={includeLowercase ? 'primary' : 'ghost'}
          onClick={() => setIncludeLowerCase((prev) => !prev)}
        >
          a - z
        </Button>

        <Button
          className={cn(
            'block shrink-0 flex-1',
            !includeNumbers && 'line-through hover:no-underline',
            includeNumbers && 'hover:line-through',
          )}
          variant={includeNumbers ? 'primary' : 'ghost'}
          onClick={() => setIncludeNumbers((prev) => !prev)}
        >
          0-9
        </Button>

        <Button
          className={cn(
            'block shrink-0 flex-2',
            !includeSymbols && 'line-through hover:no-underline',
            includeSymbols && 'hover:line-through',
          )}
          variant={includeSymbols ? 'primary' : 'ghost'}
          onClick={() => setIncludeSymbols((prev) => !prev)}
        >
          !@#$%^&*
        </Button>
      </div>

      <div className="flex flex-col gap-2 items-center justify-center border border-surface px-2 pt-6 pb-4 rounded-sm relative">
        <label className="block absolute top-0 left-0 translate-x-4 -translate-y-1/2 bg-background px-2">
          Other
        </label>
        <Button
          className={cn('block shrink-0 w-full')}
          variant={excludeSimilarCharacters ? 'primary' : 'outline'}
          onClick={() => setExcludeSimilarCharacters((prev) => !prev)}
        >
          Exclude similar characters
        </Button>

        <Button
          className={cn('block shrink-0 w-full')}
          variant={excludeAmbiguousSymbols ? 'primary' : 'outline'}
          onClick={() => setExcludeAmbiguousSymbols((prev) => !prev)}
        >
          Exclude Ambiguous Symbols
        </Button>
      </div>
    </>
  );
}
