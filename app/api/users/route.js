// Тиждень 9: API для списку користувачів (тільки admin)

import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { authorize } from "@/lib/authorize";

// GET /api/users — список користувачів (тільки admin)
export async function GET() {
  const { session, error } = await authorize("admin");
  if (error) return error;

  await dbConnect();

  // Отримуємо всіх користувачів без паролів
  const users = await User.find()
    .select("-password")
    .sort({ createdAt: -1 });

  return Response.json(users);
}
