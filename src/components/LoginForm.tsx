use client
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Login logic here
  };

  return (
    <form onSubmit={handleSubmit} className={twMerge(clsx('flex flex-col gap-4'))}>
      {/* Form fields */}
    </form>
  );
}