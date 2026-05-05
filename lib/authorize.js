// Тиждень 9: Хелпер для перевірки авторизації в API Routes

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Перевіряє авторизацію користувача
 * @param {string|null} requiredRole — необхідна роль (null = будь-який аутентифікований)
 * @returns {{ session, error }} — сесія або Response з помилкою
 */
export async function authorize(requiredRole = null) {
  const session = await getServerSession(authOptions);

  // Не аутентифікований
  if (!session) {
    return {
      session: null,
      error: Response.json(
        { error: "Необхідно увійти в систему" },
        { status: 401 }
      ),
    };
  }

  // Перевірка ролі (якщо вказана)
  if (requiredRole && session.user.role !== requiredRole) {
    return {
      session: null,
      error: Response.json(
        { error: `Потрібна роль: ${requiredRole}` },
        { status: 403 }
      ),
    };
  }

  // Все ОК
  return { session, error: null };
}
