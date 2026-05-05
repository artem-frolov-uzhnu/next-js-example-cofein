// Тиждень 10: API для окремого напою (MongoDB)
// GET /api/drinks/[id] — публічний
// PUT /api/drinks/[id] — тільки admin (+ валідація zod)
// DELETE /api/drinks/[id] — тільки admin

import dbConnect from "@/lib/db";
import Drink from "@/lib/models/Drink";
import { authorize } from "@/lib/authorize";
import { updateDrinkSchema } from "@/lib/validations/drink";
import { sanitizeObject } from "@/lib/sanitize";

export async function GET(request, { params }) {
  await dbConnect();
  const { id } = await params;

  try {
    const drink = await Drink.findById(id);

    if (!drink) {
      return Response.json({ error: "Напій не знайдено" }, { status: 404 });
    }

    return Response.json(drink);
  } catch (error) {
    return Response.json({ error: "Невалідний ID" }, { status: 400 });
  }
}

export async function PUT(request, { params }) {
  // Перевірка авторизації — тільки admin
  const { session, error } = await authorize("admin");
  if (error) return error;

  await dbConnect();
  const { id } = await params;

  try {
    const data = await request.json();

    // Тиждень 10: валідація через zod (partial — всі поля необов'язкові)
    const result = updateDrinkSchema.safeParse(data);
    if (!result.success) {
      const messages = result.error.errors.map((e) => e.message);
      return Response.json({ errors: messages }, { status: 400 });
    }

    // Тиждень 10: санітизація — видалення HTML-тегів
    const sanitized = sanitizeObject(result.data);

    const drink = await Drink.findByIdAndUpdate(id, sanitized, {
      new: true,
      runValidators: true,
    });

    if (!drink) {
      return Response.json({ error: "Напій не знайдено" }, { status: 404 });
    }

    return Response.json(drink);
  } catch (error) {
    return Response.json({ error: "Помилка сервера" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  // Перевірка авторизації — тільки admin
  const { session, error } = await authorize("admin");
  if (error) return error;

  await dbConnect();
  const { id } = await params;

  try {
    const drink = await Drink.findByIdAndDelete(id);

    if (!drink) {
      return Response.json({ error: "Напій не знайдено" }, { status: 404 });
    }

    return Response.json({ message: `Напій "${drink.name}" видалено` });
  } catch (error) {
    return Response.json({ error: "Невалідний ID" }, { status: 400 });
  }
}
