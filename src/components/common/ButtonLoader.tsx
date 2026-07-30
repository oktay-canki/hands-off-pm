import { SyncLoader } from 'react-spinners';

type Props = {
  size?: number;
};

export default function ButtonLoader({ size = 6 }: Props) {
  return <SyncLoader size={size} color="var(--color-surface)" />;
}
