// Тиждень 8: NextAuth.js route handler
// Обробляє всі auth-запити: /api/auth/signin, /api/auth/signout, /api/auth/session тощо

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
