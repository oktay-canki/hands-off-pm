'use client';

import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  entryTitle: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export default function DeleteEntryModal({
  entryTitle,
  onConfirm,
  onCancel,
}: Props) {
  const [confirmTitle, setConfirmTitle] = useState('');

  function handleConfirm() {
    if (confirmTitle != entryTitle) {
      toast.error('Confirm title does not match actual title!');
      return;
    }

    onConfirm();
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onCancel} // click outside closes
    >
      <div
        style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '4px',
          minWidth: '300px',
        }}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <h3>
          You are trying to delete &quot;{entryTitle}&quot;. This can&apos;t be
          undone.
        </h3>
        <p>Type &quot;{entryTitle}&quot; to confirm</p>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <input
            type="text"
            placeholder={`type: ${entryTitle}`}
            onChange={(e) => setConfirmTitle(e.target.value.trim())}
          />
          <button onClick={handleConfirm}>Delete</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
