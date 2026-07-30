import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
};

export default function Modal({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  closeOnOverlayClick = true,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if the click was on the overlay itself, not something bubbling
    // up from inside the card.
    if (
      closeOnOverlayClick &&
      cardRef.current &&
      !cardRef.current.contains(e.target as Node)
    ) {
      onClose?.();
    }
  };

  return (
    <div
      onMouseDown={handleOverlayClick}
      className="bg-black/40 fixed inset-0 flex items-center justify-center z-1000 p-4"
      role="presentation"
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        className="relative bg-background rounded-md p-6 max-w-xl w-10/12 mx-auto max-h-90dvh overflow-y-auto"
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 6,
              borderRadius: 6,
              display: 'flex',
              color: '#666',
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) =>
              (e.currentTarget.style.background = '#f0f0f0')
            }
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) =>
              (e.currentTarget.style.background = 'none')
            }
          >
            <X size={18} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
