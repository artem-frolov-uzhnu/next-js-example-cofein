// Тиждень 10: API для колекції напоїв (MongoDB)
// GET /api/drinks — публічний (список + ?category= + ?search=)
// POST /api/drinks — тільки admin (створення нового напою + валідація zod)

import dbConnect from "@/lib/db";
import Drink from "@/lib/models/Drink";
import { authorize } from "@/lib/authorize";
import { createDrinkSchema } from "@/lib/validations/drink";
import { sanitizeObject } from "@/lib/sanitize";

export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const filter = {};

  if (category && category !== "Всі") {
    filter.category = category;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const drinks = await Drink.find(filter).sort({ createdAt: -1 });

  return Response.json(drinks);
}

export async function POST(request) {
  // Перевірка авторизації — тільки admin
  const { session, error } = await authorize("admin");
  if (error) return error;

  await dbConnect();

  try {
    const data = await request.json();

    // Тиждень 10: валідація через zod
    const result = createDrinkSchema.safeParse(data);
    if (!result.success) {
      const messages = result.error.errors.map((e) => e.message);
      return Response.json({ errors: messages }, { status: 400 });
    }

    // Тиждень 10: санітизація — видалення HTML-тегів
    const sanitized = sanitizeObject(result.data);

    const drink = await Drink.create(sanitized);

    return Response.json(drink, { status: 201 });
  } catch (error) {
    if (error.message === "Unexpected end of JSON input" || error instanceof SyntaxError) {
      return Response.json(
        { error: "Невалідний JSON у тілі запиту" },
        { status: 400 }
      );
    }

    return Response.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
