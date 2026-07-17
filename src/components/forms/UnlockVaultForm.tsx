'use client';
import PasswordInput from '@/components/common/PasswordInput';
import { CircleUserRound, RotateCw } from 'lucide-react';
import { SubmitEvent, useState } from 'react';

import { motion, type Variants } from 'framer-motion';
import ButtonLoader from '@/components/common/ButtonLoader';

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, x: 12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const rotatingCircle: Variants = {
  hidden: { y: 4, rotate: -30 },
  show: {
    y: 0,
    rotate: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const slideInText: Variants = {
  hidden: { opacity: 0, x: 24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

type Props = {
  username: string;
  onSubmit: (username: string, password: string) => void;
  onSwitchUser: () => void;
  isLoading: boolean;
};

export default function UnlockVaultForm({
  username,
  onSubmit,
  onSwitchUser,
  isLoading,
}: Props) {
  const [masterPassword, setMasterPassword] = useState('');

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    onSubmit(username, masterPassword);
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 mb-8 relative">
          <div className="w-fit relative mx-auto">
            <motion.div variants={item}>
              <CircleUserRound size={84} strokeWidth={0.4} />
            </motion.div>
            <motion.div variants={rotatingCircle}>
              <button
                type="button"
                onClick={onSwitchUser}
                className="absolute z-50 p-1 rounded-full right-2 bottom-1 bg-accent"
              >
                <RotateCw size={18} className="text-background" />
              </button>
            </motion.div>
          </div>
          <motion.div variants={slideInText}>
            <h3 className="title w-full text-center">{username}</h3>
          </motion.div>
        </div>

        <motion.div variants={item}>
          <PasswordInput
            value={masterPassword}
            onChange={(e) => setMasterPassword(e.target.value)}
            autoFocus={true}
            className="input muted-input large-text"
          />
        </motion.div>

        <motion.div variants={item}>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-secondary w-full mt-4"
          >
            {isLoading ? <ButtonLoader /> : 'Unlock Vault'}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}
