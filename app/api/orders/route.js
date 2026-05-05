// Тиждень 11: API для колекції замовлень (MongoDB з many-to-many через OrderItem)
// GET  /api/orders — admin бачить усе, user — лише свої (+ ?status= ?drink=)
// POST /api/orders — аутентифікований, user береться з session, totalPrice — з сервера

import dbConnect from "@/lib/db";
import Order from "@/lib/models/Order";
import OrderItem from "@/lib/models/OrderItem";
import Drink from "@/lib/models/Drink";
import User from "@/lib/models/User"; // register model for populate
import { authorize } from "@/lib/authorize";
import { createOrderSchema } from "@/lib/validations/order";
import { sanitizeObject } from "@/lib/sanitize";

// Явна реєстрація моделей для populate() — інакше при hot-reload буде
// "Schema hasn't been registered for model ..."
void [User, Drink, OrderItem];

export async function GET(request) {
  const { session, error } = await authorize();
  if (error) return error;

  await dbConnect();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const drink = searchParams.get("drink");

  const filter =
    session.user.role === "admin" ? {} : { user: session.user.id };

  if (status) filter.status = status;

  // ?drink=<id> — показати лише замовлення, що містять цей напій.
  // Шукаємо через OrderItem і звужуємо filter по _id замовлення.
  if (drink) {
    const orderIds = await OrderItem.find({ drink }).distinct("order");
    filter._id = { $in: orderIds };
  }

  const orders = await Order.find(filter)
    .populate({ path: "user", select: "name email role" })
    .populate({
      path: "items",
      populate: { path: "drink", select: "name price emoji category" },
    })
    .sort({ createdAt: -1 });

  return Response.json(orders);
}

export async function POST(request) {
  const { session, error } = await authorize();
  if (error) return error;

  await dbConnect();

  let createdOrderId = null;

  try {
    const data = await request.json();

    const result = createOrderSchema.safeParse(data);
    if (!result.success) {
      const messages = result.error.errors.map((e) => e.message);
      return Response.json({ errors: messages }, { status: 400 });
    }

    const sanitized = sanitizeObject(result.data);

    // 0) Визначити користувача-власника замовлення.
    // Admin може вказати user у тілі запиту (замовлення на іншого);
    // звичайний user — лише на себе (поле з body ігнорується).
    let orderUserId = session.user.id;
    if (session.user.role === "admin" && sanitized.user) {
      const targetUser = await User.findById(sanitized.user);
      if (!targetUser) {
        return Response.json(
          { error: "Користувача не знайдено" },
          { status: 404 }
        );
      }
      orderUserId = targetUser._id;
    }

    // 1) Підтягнути всі напої одним запитом (Mongoose не перевіряє ref).
    const drinkIds = sanitized.items.map((i) => i.drink);
    const drinks = await Drink.find({ _id: { $in: drinkIds } });

    // Мапа для швидкого доступу
    const drinkById = new Map(drinks.map((d) => [d._id.toString(), d]));

    // 2) Перевірити, що всі напої існують та доступні.
    for (const item of sanitized.items) {
      const drink = drinkById.get(item.drink);
      if (!drink) {
        return Response.json(
          { error: `Напій не знайдено: ${item.drink}` },
          { status: 404 }
        );
      }
      if (!drink.available) {
        return Response.json(
          { error: `Напій зараз недоступний: ${drink.name}` },
          { status: 409 }
        );
      }
    }

    // 3) Обчислити totalPrice на сервері (zero trust).
    const totalPrice = sanitized.items.reduce((sum, item) => {
      const drink = drinkById.get(item.drink);
      return sum + drink.price * item.quantity;
    }, 0);

    // 4) Створити Order.
    const order = await Order.create({
      user: orderUserId,
      totalPrice,
      notes: sanitized.notes,
    });
    createdOrderId = order._id;

    // 5) Створити OrderItem-и пакетом (priceAtOrder = snapshot поточної ціни).
    const itemsToCreate = sanitized.items.map((item) => {
      const drink = drinkById.get(item.drink);
      return {
        order: order._id,
        drink: drink._id,
        quantity: item.quantity,
        priceAtOrder: drink.price,
      };
    });
    await OrderItem.insertMany(itemsToCreate);

    // 6) Повернути замовлення з populate-ом items.drink + user.
    const populated = await Order.findById(order._id)
      .populate({ path: "user", select: "name email" })
      .populate({
        path: "items",
        populate: { path: "drink", select: "name price emoji category" },
      });

    return Response.json(populated, { status: 201 });
  } catch (err) {
    // Rollback: якщо вже встигли створити Order, але впала вставка items,
    // прибираємо порожнє замовлення, щоб не було orphaned запису.
    if (createdOrderId) {
      try {
        await Order.deleteOne({ _id: createdOrderId });
      } catch {
        // best-effort — не ламаємо основну відповідь
      }
    }

    if (err.message === "Unexpected end of JSON input" || err instanceof SyntaxError) {
      return Response.json(
        { error: "Невалідний JSON у тілі запиту" },
        { status: 400 }
      );
    }
    return Response.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
