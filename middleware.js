// Тиждень 9: Middleware для захисту маршрутів
// Перехоплює запити до /dashboard/* і перевіряє JWT-токен

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  // Отримуємо JWT-токен із cookie
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Якщо токена немає — redirect на сторінку логіну
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    // Зберігаємо URL, куди хотів потрапити користувач
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Токен є — пропускаємо запит далі
  return NextResponse.next();
}

// Конфігурація: які маршрути захищати
export const config = {
  matcher: ["/dashboard/:path*"],
};
