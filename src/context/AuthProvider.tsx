"use client";
import { SessionProvider } from "next-auth/react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode; // Adjust the type as needed
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
 