'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const router = useRouter();
  const { login, register, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        router.push('/dashboard');
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        router.push('/login');
      }
    } catch (err: unknown) {
      let message = 'An unexpected error occurred';

      if (axios.isAxiosError(err)) {
        message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          message;
      }

      setError(message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === 'register' && (
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          data-cy="name-input"
        />
      )}

      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        data-cy="email-input"
      />

      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        data-cy="password-input"
      />

      {mode === 'register' && (
        <input
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          data-cy="confirm-password-input"
        />
      )}

      {error && (
        <div data-cy="auth-error" className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        data-cy={mode === 'login' ? 'login-submit' : 'register-submit'}
      >
        {isLoading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
};
