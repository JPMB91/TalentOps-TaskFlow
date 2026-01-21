"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import axios from "axios";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  return <>{children}</>;
};
