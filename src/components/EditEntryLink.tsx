import Link from 'next/link';

type Props = {
  itemId: string;
};

export default function EditEntryLink({ itemId }: Props) {
  return <Link href={`/vault/items/${itemId}/edit`}>Edit</Link>;
}
