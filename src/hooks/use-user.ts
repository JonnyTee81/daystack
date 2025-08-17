"use client";

import { useSession } from "next-auth/react";

export function useUser() {
  const { data: session, status } = useSession();

  return {
    user: session?.user ?? null,
    isAuthenticated: !!session?.user,
    isLoading: status === "loading",
    session,
  };
}