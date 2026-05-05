// Тиждень 10: API для реєстрації (з валідацією zod)

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { registerSchema } from "@/lib/validations/user";
import { stripHtml } from "@/lib/sanitize";

export async function POST(request) {
  try {
    await dbConnect();

    const data = await request.json();

    // Тиждень 10: валідація через zod (замість ручної)
    const result = registerSchema.safeParse(data);
    if (!result.success) {
      const messages = result.error.errors.map((e) => e.message);
      return NextResponse.json(
        { error: messages.join(", ") },
        { status: 400 }
      );
    }

    // Тиждень 10: санітизація імені
    const { email, password } = result.data;
    const name = stripHtml(result.data.name);

    // Перевірка, чи існує користувач з таким email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "Користувач з таким email вже існує" },
        { status: 409 }
      );
    }

    // Хешування пароля з bcrypt (10 раундів)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створення нового користувача
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: "Користувача успішно створено",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // Дублікат email (MongoDB unique index)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Користувач з таким email вже існує" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Помилка сервера" },
      { status: 500 }
    );
  }
}
