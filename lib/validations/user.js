// Тиждень 10: Zod-схеми валідації для користувачів

import { z } from "zod";

// Схема для реєстрації
export const registerSchema = z.object({
  name: z
    .string({ required_error: "Ім'я обов'язкове" })
    .min(2, "Мінімум 2 символи")
    .max(50, "Максимум 50 символів")
    .trim(),
  email: z
    .string({ required_error: "Email обов'язковий" })
    .email("Некоректний формат email")
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: "Пароль обов'язковий" })
    .min(6, "Мінімум 6 символів")
    .max(100, "Максимум 100 символів"),
});

// Схема для зміни ролі
export const updateRoleSchema = z.object({
  role: z.enum(["user", "admin"], {
    errorMap: () => ({ message: "Роль має бути 'user' або 'admin'" }),
  }),
});
