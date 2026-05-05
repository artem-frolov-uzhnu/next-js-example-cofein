// Тиждень 8: Конфігурація NextAuth.js

import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

export const authOptions = {
  // Провайдери аутентифікації
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        // 1. Підключення до бази даних
        await dbConnect();

        // 2. Пошук користувача за email (включаючи поле password)
        const user = await User.findOne({ email: credentials.email }).select(
          "+password"
        );

        if (!user) {
          throw new Error("Користувача з таким email не знайдено");
        }

        // 3. Перевірка пароля через bcrypt
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Невірний пароль");
        }

        // 4. Повертаємо дані користувача (без пароля)
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  // Стратегія сесії — JWT (без таблиці сесій у БД)
  session: {
    strategy: "jwt",
  },

  // Callbacks для додавання даних до токена та сесії
  callbacks: {
    // Викликається при створенні/оновленні JWT токена
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },

    // Викликається при доступі до сесії
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.id = token.id;
      return session;
    },
  },

  // Кастомні сторінки
  pages: {
    signIn: "/login",
  },

  // Секрет для підпису JWT
  secret: process.env.NEXTAUTH_SECRET,
};
