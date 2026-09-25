import { SyncLoader } from 'react-spinners';

type Props = {
  size?: number;
};

export default function ButtonLoader({ size = 6 }: Props) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className="inline-flex items-center justify-center"
    >
      <SyncLoader size={size} color="var(--color-surface)" aria-hidden="true" />
    </span>
  );
}
