import Tooltip from '@/components/common/Tooltip';
import { PasswordStrength } from '@/modules/password-generator/PasswordGenerator';
import cn from '@/utils/cn';
import { Info } from 'lucide-react';

type StrengthLabel = PasswordStrength['label'];

const strengthStyles: Record<StrengthLabel, string> = {
  'Very Weak': 'w-2/12',
  Weak: 'w-4/12',
  Reasonable: 'w-8/12',
  Strong: 'w-10/12',
  'Very Strong': 'w-12/12',
};

type Props = {
  strength?: StrengthLabel;
};

export default function StrengthMeter({ strength }: Props) {
  if (!strength) return null;
  return (
    <div className="flex items-center justify-center w-11/12 gap-4 px-2">
      <div className="bg-primary flex-1 h-2 rounded-full">
        <div
          className={cn(
            'bg-surface rounded-full h-full',
            strengthStyles[strength],
          )}
        ></div>
      </div>

      <div className="flex gap-2 items-center">
        <span className="block label shrink-0">{strength}</span>

        <Tooltip
          label={<Info size={20} />}
          content={
            <>
              This estimate is based on character variety and length only —{' '}
              <br />
              it doesn&apos;t check for common passwords, keyboard patterns, or{' '}
              <br />
              predictable sequences. A password can look &quot;strong&quot; here
              but <br />
              still be easy to guess. For better passwords use the generator.
            </>
          }
        />
      </div>
    </div>
  );
}
