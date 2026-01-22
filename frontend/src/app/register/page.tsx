"use client";

import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        <AuthForm mode="register" />
        <p className="mt-4 text-center text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
