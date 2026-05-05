// Тиждень 8: Client wrapper для NextAuth SessionProvider

"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
