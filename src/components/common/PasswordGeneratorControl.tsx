'use client';

import Checkbox from '@/components/common/Checkbox';
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

const passwordGenerator = new PasswordGenerator();

export default function PasswordGeneratorControl({
  value,
  onChange,
  onUsePassword,
}: Props) {
  const [generatedPassword, setGeneratedPassword] = useState(() => {
    if (value) return value;
    return passwordGenerator.generate();
  });

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
      const password = passwordGenerator.generate({
        length,
        includeLowercase,
        includeUppercase,
        includeNumbers,
        includeSymbols,
        excludeSimilarCharacters,
        excludeAmbiguousSymbols,
      });

      setGeneratedPassword(password);
      onChange?.(password);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'An error occurred while generating the password with the given options.';

      toast.error(message);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Generated password */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="generated-password"
          className="text-sm font-medium text-surface"
        >
          Generated password
        </label>

        <div className="relative">
          <Input
            id="generated-password"
            value={generatedPassword}
            readOnly
            className="pr-12 font-mono"
          />

          <button
            type="button"
            onClick={generateNewPassword}
            aria-label="Generate new password"
            className={cn(
              'absolute right-1 top-1/2 flex size-8 -translate-y-1/2',
              'items-center justify-center rounded-md',
              'text-surface/60 transition-colors',
              'hover:bg-primary hover:text-surface',
              'focus-visible:ring-2 focus-visible:ring-accent',
            )}
          >
            <Shuffle className="size-4" />
          </button>
        </div>
      </div>

      {/* Length */}
      <div className="flex flex-col gap-2">
        <label htmlFor="pw-length" className="text-sm font-medium text-surface">
          Length
        </label>

        <Input
          id="pw-length"
          type="number"
          min={8}
          max={32}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="text-center font-mono"
        />
      </div>

      {/* Character options */}
      <fieldset className="rounded-lg border border-secondary/50 p-4">
        <legend className="px-2 text-sm font-medium text-surface">
          Characters
        </legend>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button
            type="button"
            aria-pressed={includeUppercase}
            onClick={() => setIncludeUpperCase((prev) => !prev)}
            className={cn(
              'h-10 rounded-md border px-3 text-sm font-medium',
              'transition-colors focus-visible:ring-2 focus-visible:ring-accent',
              includeUppercase
                ? 'border-accent bg-accent text-background'
                : 'border-secondary bg-primary text-surface/60 hover:border-surface hover:text-surface',
            )}
          >
            A-Z
          </button>

          <button
            type="button"
            aria-pressed={includeLowercase}
            onClick={() => setIncludeLowerCase((prev) => !prev)}
            className={cn(
              'h-10 rounded-md border px-3 text-sm font-medium',
              'transition-colors focus-visible:ring-2 focus-visible:ring-accent',
              includeLowercase
                ? 'border-accent bg-accent text-background'
                : 'border-secondary bg-primary text-surface/60 hover:border-surface hover:text-surface',
            )}
          >
            a-z
          </button>

          <button
            type="button"
            aria-pressed={includeNumbers}
            onClick={() => setIncludeNumbers((prev) => !prev)}
            className={cn(
              'h-10 rounded-md border px-3 text-sm font-medium',
              'transition-colors focus-visible:ring-2 focus-visible:ring-accent',
              includeNumbers
                ? 'border-accent bg-accent text-background'
                : 'border-secondary bg-primary text-surface/60 hover:border-surface hover:text-surface',
            )}
          >
            0-9
          </button>

          <button
            type="button"
            aria-pressed={includeSymbols}
            onClick={() => setIncludeSymbols((prev) => !prev)}
            className={cn(
              'h-10 rounded-md border px-3 text-sm font-medium',
              'transition-colors focus-visible:ring-2 focus-visible:ring-accent',
              includeSymbols
                ? 'border-accent bg-accent text-background'
                : 'border-secondary bg-primary text-surface/60 hover:border-surface hover:text-surface',
            )}
          >
            !@#$%^&*
          </button>
        </div>
      </fieldset>

      {/* Other options */}
      <fieldset className="flex flex-col gap-3 rounded-lg border border-secondary/50 p-4">
        <legend className="px-2 text-sm font-medium text-surface">Other</legend>

        <Checkbox
          checked={excludeSimilarCharacters}
          onChange={setExcludeSimilarCharacters}
          label="Exclude similar characters"
        />

        <Checkbox
          checked={excludeAmbiguousSymbols}
          onChange={setExcludeAmbiguousSymbols}
          label="Exclude ambiguous symbols"
        />
      </fieldset>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          className="flex-1"
          variant="outline"
          onClick={() => onUsePassword?.(generatedPassword)}
        >
          Use this password
        </Button>

        <Button
          className="flex-1 gap-2"
          variant="accent"
          onClick={generateNewPassword}
        >
          Generate
          <Shuffle className="size-4" />
        </Button>
      </div>
    </div>
  );
}
