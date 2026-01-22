"use client";

import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
        <AuthForm mode="login" />
        <p className="mt-4 text-center text-sm">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
