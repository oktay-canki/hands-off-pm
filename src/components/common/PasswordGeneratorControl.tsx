'use client';

import PasswordGenerator, {
  DEFAULT_GENERATOR_OPTIONS,
} from '@/modules/password-generator/PasswordGenerator';
import { useEffect, useState } from 'react';

type Props = {
  value?: string;
  onChange?: (password: string) => void;
};

export default function PasswordGeneratorControl({ value, onChange }: Props) {
  const [generatedPassword, setGeneratedPassword] = useState(value ?? '');

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
    function generate() {
      const generator = new PasswordGenerator();
      const pw = generator.generate();
      setGeneratedPassword(pw);
    }

    if (!generatedPassword) generate();
  }, [generatedPassword]);

  useEffect(() => {
    onChange?.(generatedPassword);
  }, [onChange, generatedPassword]);

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
    } catch (error) {
      if (error instanceof Error) {
        alert(
          error.message ??
            'An error occured while generating password with given options.',
        );
      }
    }
  }

  return (
    <div>
      <div>
        <div>
          <input
            id="pw-length"
            type="number"
            onChange={(e) => setLength(Number(e.target.value))}
            min={8}
            max={32}
            defaultValue={8}
          />
        </div>
        <div>
          <input
            id="opt-uppercase"
            type="checkbox"
            checked={includeUppercase}
            onChange={(e) => setIncludeUpperCase(e.target.checked)}
          />
          <label htmlFor="opt-uppercase">A-Z</label>
        </div>
        <div>
          <input
            id="opt-lowercase"
            type="checkbox"
            checked={includeLowercase}
            onChange={(e) => setIncludeLowerCase(e.target.checked)}
          />
          <label htmlFor="opt-lowercase">a-z</label>
        </div>
        <div>
          <input
            id="opt-numbers"
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
          />
          <label htmlFor="opt-numbers">0-9</label>
        </div>
        <div>
          <input
            id="opt-symbols"
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
          />
          <label htmlFor="opt-symbols">!@#$%^&*</label>
        </div>
        <div>
          <input
            id="opt-exclude-similar"
            type="checkbox"
            checked={excludeSimilarCharacters}
            onChange={(e) => setExcludeSimilarCharacters(e.target.checked)}
          />
          <label htmlFor="opt-exclude-similar">
            Exclude similar characters
          </label>
        </div>
        <div>
          <input
            id="opt-exclude-ambiguous"
            type="checkbox"
            checked={excludeAmbiguousSymbols}
            onChange={(e) => setExcludeAmbiguousSymbols(e.target.checked)}
          />
          <label htmlFor="opt-exclude-ambiguous">
            Exclude Ambiguous Symbols
          </label>
        </div>
      </div>
      <button type="button" onClick={generateNewPassword}>
        Generate Password
      </button>
    </div>
  );
}
