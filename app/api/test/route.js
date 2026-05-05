// Тиждень 7: Тестовий endpoint з перевіркою підключення до MongoDB
// GET /api/test — повертає статус підключення

import dbConnect from "@/lib/db";

export async function GET() {
  try {
    await dbConnect();

    return Response.json({
      message: "API працює! Кав'ярня «Кофеїн». MongoDB підключено!",
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(
      {
        message: "Помилка підключення до MongoDB",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
