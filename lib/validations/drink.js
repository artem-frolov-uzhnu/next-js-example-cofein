// Тиждень 10: Zod-схема валідації для напоїв

import { z } from "zod";

export const createDrinkSchema = z.object({
  name: z
    .string({ required_error: "Назва обов'язкова" })
    .min(1, "Назва обов'язкова")
    .max(100, "Максимум 100 символів")
    .trim(),
  description: z
    .string()
    .max(500, "Максимум 500 символів")
    .trim()
    .optional()
    .default(""),
  price: z
    .number({
      required_error: "Ціна обов'язкова",
      invalid_type_error: "Ціна має бути числом",
    })
    .min(0, "Ціна не може бути від'ємною"),
  emoji: z.string().max(10).optional().default("☕"),
  category: z.enum(["Кава", "Чай", "Їжа", "Інше"], {
    errorMap: () => ({ message: "Категорія має бути: Кава, Чай, Їжа або Інше" }),
  }),
  available: z.boolean().optional().default(true),
});

// Для PUT — всі поля необов'язкові
export const updateDrinkSchema = createDrinkSchema.partial();
