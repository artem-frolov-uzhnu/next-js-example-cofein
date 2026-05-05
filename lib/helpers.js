// Допоміжні функції для обчислення статистики
// Тиждень 7: використовує Mongoose замість in-memory масиву
// Тиждень 11: додано getOrderStats() для другої CRUD-сутності

import dbConnect from "./db";
import Drink from "./models/Drink";
import Order from "./models/Order";

export async function getDrinkStats() {
  await dbConnect();

  const drinks = await Drink.find();
  const total = drinks.length;
  const available = drinks.filter((d) => d.available).length;
  const unavailable = total - available;
  const categories = [...new Set(drinks.map((d) => d.category))];
  const avgPrice =
    total > 0
      ? Math.round(drinks.reduce((sum, d) => sum + d.price, 0) / total)
      : 0;

  return {
    total,
    available,
    unavailable,
    categoriesCount: categories.length,
    avgPrice,
  };
}

export async function getOrderStats() {
  await dbConnect();

  const [total, pending, completed] = await Promise.all([
    Order.countDocuments({}),
    Order.countDocuments({ status: "pending" }),
    Order.countDocuments({ status: "completed" }),
  ]);

  return { total, pending, completed };
}
