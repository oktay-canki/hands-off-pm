import IncompatibleEnvironmentError from '@/modules/password-generator/errors/IncompatibleEnvironmentError';
import InvalidCharIndexError from '@/modules/password-generator/errors/InvalidCharIndexError';
import InvalidPasswordLengthError from '@/modules/password-generator/errors/InvalidPasswordLengthError';
import NoCharacterCategoryError from '@/modules/password-generator/errors/NoCharacterCategoryError';
import ShortPasswordLengthError from '@/modules/password-generator/errors/ShortPasswordLengthError';

export interface PasswordOptions {
  length?: number;
  includeLowercase?: boolean;
  includeUppercase?: boolean;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
  excludeSimilarCharacters?: boolean;
  excludeAmbiguousSymbols?: boolean;
  customSymbols?: string;
  requireEveryCategory?: boolean;
}

export interface PasswordStrength {
  entropyBits: number;
  label: 'Very Weak' | 'Weak' | 'Reasonable' | 'Strong' | 'Very Strong';
  poolSize: number;
}

export const DEFAULT_GENERATOR_OPTIONS: Required<
  Omit<PasswordOptions, 'customSymbols'>
> & {
  customSymbols?: string;
} = {
  length: 8,
  includeLowercase: true,
  includeUppercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeSimilarCharacters: false,
  excludeAmbiguousSymbols: false,
  requireEveryCategory: true,
  customSymbols: undefined,
};

const CHAR_SETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?/~',
};

const SIMILAR_CHARS = 'lI1O0o';
const AMBIGUOUS_SYMBOLS = '\'"\\`.';

class PasswordGenerator {
  generate(options: PasswordOptions = {}): string {
    const opts = { ...DEFAULT_GENERATOR_OPTIONS, ...options };

    if (!Number.isInteger(opts.length) || opts.length < 1) {
      throw new InvalidPasswordLengthError();
    }

    const categories = this.buildCategories(opts);

    if (categories.length === 0) {
      throw new NoCharacterCategoryError();
    }

    if (opts.requireEveryCategory && opts.length < categories.length) {
      throw new ShortPasswordLengthError();
    }

    const fullPool = categories.join('');
    const passwordChars: string[] = [];

    if (opts.requireEveryCategory) {
      for (const category of categories) {
        passwordChars.push(this.randomChar(category));
      }
    }

    while (passwordChars.length < opts.length) {
      passwordChars.push(this.randomChar(fullPool));
    }

    return this.shuffle(passwordChars).join('');
  }

  generateMany(count: number, options: PasswordOptions = {}): string[] {
    return Array.from({ length: count }, () => this.generate(options));
  }

  /**
   * Rough entropy-based strength estimate
   */
  estimateStrength(password: string): PasswordStrength {
    let poolSize = 0;
    if (/[a-z]/.test(password)) poolSize += CHAR_SETS.lowercase.length;
    if (/[A-Z]/.test(password)) poolSize += CHAR_SETS.uppercase.length;
    if (/[0-9]/.test(password)) poolSize += CHAR_SETS.numbers.length;
    if (/[^a-zA-Z0-9]/.test(password)) poolSize += CHAR_SETS.symbols.length;

    const entropyBits =
      poolSize > 0 ? Math.log2(poolSize) * password.length : 0;

    let label: PasswordStrength['label'];
    if (entropyBits < 28) label = 'Very Weak';
    else if (entropyBits < 36) label = 'Weak';
    else if (entropyBits < 60) label = 'Reasonable';
    else if (entropyBits < 100) label = 'Strong';
    else label = 'Very Strong';

    return { entropyBits: Math.round(entropyBits), label, poolSize };
  }

  private buildCategories(
    opts: Required<Omit<PasswordOptions, 'customSymbols'>> & {
      customSymbols?: string;
    },
  ): string[] {
    const categories: string[] = [];

    if (opts.includeLowercase) {
      categories.push(this.filterChars(CHAR_SETS.lowercase, opts));
    }
    if (opts.includeUppercase) {
      categories.push(this.filterChars(CHAR_SETS.uppercase, opts));
    }
    if (opts.includeNumbers) {
      categories.push(this.filterChars(CHAR_SETS.numbers, opts));
    }
    if (opts.includeSymbols) {
      const symbolSet = opts.customSymbols ?? CHAR_SETS.symbols;
      categories.push(this.filterChars(symbolSet, opts));
    }

    return categories.filter((c) => c.length > 0);
  }

  private filterChars(
    chars: string,
    opts: {
      excludeSimilarCharacters?: boolean;
      excludeAmbiguousSymbols?: boolean;
    },
  ): string {
    let result = chars;
    if (opts.excludeSimilarCharacters) {
      result = [...result].filter((c) => !SIMILAR_CHARS.includes(c)).join('');
    }
    if (opts.excludeAmbiguousSymbols) {
      result = [...result]
        .filter((c) => !AMBIGUOUS_SYMBOLS.includes(c))
        .join('');
    }
    return result;
  }

  private randomChar(pool: string): string {
    const index = this.secureRandomInt(pool.length);
    if (!pool[index]) throw new InvalidCharIndexError();
    return pool[index];
  }

  /**
   * Cryptographically secure random integer in [0, max), avoiding
   * modulo bias via rejection sampling.
   */
  private secureRandomInt(max: number): number {
    if (max <= 0) throw new Error('max must be greater than 0');

    const cryptoObj = this.getCrypto();
    const range = 256; // one byte
    const limit = range - (range % max);

    let byte: number;
    do {
      const arr = new Uint8Array(1);
      cryptoObj.getRandomValues(arr);
      byte = arr[0]!;
    } while (byte >= limit);

    return byte % max;
  }

  /** Fisher-Yates shuffle using the CSPRNG, so ordering isn't guessable. */
  private shuffle<T>(items: T[]): T[] {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = this.secureRandomInt(i + 1);
      [arr[i], arr[j]] = [arr[j]!, arr[i]!];
    }
    return arr;
  }

  private getCrypto(): Crypto {
    if (typeof window !== 'undefined' && window.crypto) {
      return window.crypto;
    }
    if (typeof globalThis !== 'undefined' && globalThis.crypto) {
      return globalThis.crypto as Crypto;
    }
    throw new IncompatibleEnvironmentError();
  }
}

export default PasswordGenerator;
