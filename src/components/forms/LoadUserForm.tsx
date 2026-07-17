'use client';
import { FingerprintPattern } from 'lucide-react';
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
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const rotatingCircle: Variants = {
  hidden: { opacity: 0.8, y: 16, rotate: -30 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const slideInText: Variants = {
  hidden: { opacity: 0, x: -24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

type Props = {
  onSubmit: (username: string) => void;
  isLoading: boolean;
};

export default function LoadUserForm({ onSubmit, isLoading }: Props) {
  const [username, setUsername] = useState('');

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    onSubmit(username);
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 mb-14">
          <motion.div variants={rotatingCircle}>
            <FingerprintPattern size={84} className="mx-auto" />
          </motion.div>
          <motion.div variants={slideInText}>
            <h2 className="title w-full text-center">Welcome</h2>
          </motion.div>
        </div>
        <motion.div variants={item}>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            className="input muted-input w-full large-text mb-4"
            autoFocus={true}
          />
        </motion.div>
        <motion.div variants={item}>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-secondary w-full"
          >
            {isLoading ? <ButtonLoader /> : 'Continue'}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}
