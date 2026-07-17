'use client';
import PasswordInput from '@/components/common/PasswordInput';
import { useVault } from '@/context/VaultContext';
import { Vault } from 'lucide-react';
import { useState } from 'react';
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

const rotatingVault: Variants = {
  hidden: { opacity: 0.8, y: 16, rotate: 360 },
  show: {
    opacity: 1,
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

const RegisterForm = () => {
  const vaultService = useVault();
  const [username, setUsername] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function clearFormFields() {
    setUsername('');
    setMasterPassword('');
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register();
    } finally {
      setIsLoading(false);
    }
  }

  async function register() {
    if (await vaultService.vaultExists(username)) {
      alert('A vault with this username already exists');
      return;
    }

    if (!username || !masterPassword) return;

    try {
      await vaultService.register(username.trim(), masterPassword);
      clearFormFields();
      alert('Successfully created a new vault registry');
    } catch (error) {
      if (error instanceof Error)
        alert(error.message || 'Failed to create new vault registry');
      console.log(error);
    }
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <form onSubmit={handleSubmit}>
        <div className="mb-14">
          <motion.div variants={rotatingVault}>
            <Vault size={82} strokeWidth={1} className="mx-auto mb-4" />
          </motion.div>
          <motion.div variants={slideInText}>
            <h2 className="title w-full text-center">Create Vault</h2>
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
          <PasswordInput
            value={masterPassword}
            onChange={(e) => setMasterPassword(e.target.value)}
            className="muted-input"
          />
        </motion.div>
        <motion.div variants={item}>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-secondary w-full mt-4"
          >
            {isLoading ? <ButtonLoader /> : 'Create'}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default RegisterForm;
