// Тиждень 12: Zod-схеми для auth-форм (login, register)
// Та сама схема працює і на клієнті (через zodResolver у RHF), і на сервері (parse у API).

import { z } from "zod";

// Login: email + password
export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email обов'язковий" })
    .email("Некоректний формат email")
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: "Пароль обов'язковий" })
    .min(1, "Пароль обов'язковий"),
});

// Register: name + email + password + confirmPassword (UI-only поле для перевірки)
// confirmPassword не передається на сервер; перевіряється через .refine()
export const registerFormSchema = z
  .object({
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
    confirmPassword: z
      .string({ required_error: "Підтвердження обов'язкове" })
      .min(6, "Мінімум 6 символів"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Паролі не збігаються",
    path: ["confirmPassword"],
  });
