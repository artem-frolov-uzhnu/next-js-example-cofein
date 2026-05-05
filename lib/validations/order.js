// Тиждень 11: Zod-схеми валідації для замовлень (many-to-many через OrderItem)
// Клієнт шле items: [{ drink, quantity }], а priceAtOrder і totalPrice
// обчислюються на сервері (zero trust — ніколи не довіряємо ціні з клієнта).

import { z } from "zod";

// ObjectId — 24 hex символи
const objectIdSchema = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, "Невалідний ідентифікатор");

const ORDER_STATUSES = [
  "pending",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

// Одна позиція у замовленні: посилання на drink + кількість
const orderItemInputSchema = z.object({
  drink: objectIdSchema,
  quantity: z
    .number({
      required_error: "Кількість обов'язкова",
      invalid_type_error: "Кількість має бути числом",
    })
    .int("Лише цілі числа")
    .min(1, "Мінімум 1")
    .max(20, "Максимум 20"),
});

export const createOrderSchema = z.object({
  // user — опціональний; враховується тільки коли запит від admin.
  // Звичайний user не може створити замовлення на чуже ім'я: сервер
  // у цьому випадку поле ігнорує та бере session.user.id.
  user: objectIdSchema.optional(),
  items: z
    .array(orderItemInputSchema)
    .min(1, "Замовлення має містити хоча б одну позицію")
    .max(20, "Максимум 20 позицій у замовленні"),
  notes: z
    .string()
    .max(300, "Максимум 300 символів")
    .trim()
    .optional()
    .default(""),
});

// Редагування замовлення адміном: лише верхній рівень (статус, коментар).
// Редагування самих items (додавання/видалення позицій) — у бонусних завданнях.
export const updateOrderSchema = z
  .object({
    status: z
      .enum(ORDER_STATUSES, {
        errorMap: () => ({ message: "Некоректний статус замовлення" }),
      })
      .optional(),
    notes: z.string().max(300).trim().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Немає даних для оновлення",
  });

// Користувач (не admin) може лише скасувати своє pending-замовлення
export const userUpdateOrderSchema = z.object({
  status: z.literal("cancelled", {
    errorMap: () => ({ message: "Ви можете лише скасувати замовлення" }),
  }),
});
