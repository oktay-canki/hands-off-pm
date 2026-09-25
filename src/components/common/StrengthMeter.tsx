import Tooltip from '@/components/common/Tooltip';
import { PasswordStrength } from '@/modules/password-generator/PasswordGenerator';
import cn from '@/utils/cn';
import { Info } from 'lucide-react';

type StrengthLabel = PasswordStrength['label'];

const strengthStyles: Record<StrengthLabel, { width: string; color: string }> =
  {
    'Very Weak': {
      width: 'w-2/12',
      color: 'bg-danger',
    },
    Weak: {
      width: 'w-4/12',
      color: 'bg-danger',
    },
    Reasonable: {
      width: 'w-8/12',
      color: 'bg-accent',
    },
    Strong: {
      width: 'w-10/12',
      color: 'bg-accent',
    },
    'Very Strong': {
      width: 'w-full',
      color: 'bg-surface',
    },
  };

type Props = {
  strength?: StrengthLabel;
};

export default function StrengthMeter({ strength }: Props) {
  if (!strength) return null;

  const styles = strengthStyles[strength];

  return (
    <div className="flex w-full items-center gap-3 px-1">
      <div
        className="h-2 flex-1 overflow-hidden rounded-full bg-primary"
        role="progressbar"
        aria-label="Password strength"
        aria-valuetext={strength}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            styles.width,
            styles.color,
          )}
        />
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <span className="text-sm font-medium text-surface">{strength}</span>

        <Tooltip
          label={
            <Info
              className="size-4 text-surface/50 transition-colors hover:text-surface"
              aria-hidden="true"
            />
          }
          content={
            <p className="max-w-xs text-sm leading-relaxed">
              This estimate is based on character variety and length only. It
              does not check for common passwords, keyboard patterns, or
              predictable sequences. A password can look strong here and still
              be easy to guess. For better passwords, use the generator.
            </p>
          }
        />
      </div>
    </div>
  );
}
