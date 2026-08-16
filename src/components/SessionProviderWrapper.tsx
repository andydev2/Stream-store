"use client";

import { SessionProvider } from "next-auth/react";
import AuthModal from "./AuthModal";

export default function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      {children}
      <AuthModal />
    </SessionProvider>
  );
}
