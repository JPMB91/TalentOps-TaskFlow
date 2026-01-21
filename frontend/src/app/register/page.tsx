'use client';

import { AuthForm } from '@/components/AuthForm';

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        <AuthForm mode="register" />
      </div>
    </div>
  );
}