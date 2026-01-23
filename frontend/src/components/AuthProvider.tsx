"use client";
import { Navigation } from "./Navigation";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
};
