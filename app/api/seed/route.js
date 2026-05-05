// Тиждень 9: Seed endpoint — наповнює базу початковими даними
// GET /api/seed — видаляє всі документи та створює нові
// Додано seed користувачів з різними ролями для тестування RBAC
// Тиждень 11: seed замовлень через Order + OrderItem (many-to-many)

import dbConnect from "@/lib/db";
import Drink from "@/lib/models/Drink";
import User from "@/lib/models/User";
import Order from "@/lib/models/Order";
import OrderItem from "@/lib/models/OrderItem";
import bcrypt from "bcryptjs";

const initialDrinks = [
  {
    name: "Еспресо",
    description: "Класичний італійський еспресо з насиченим смаком та ароматом.",
    price: 45,
    emoji: "☕",
    category: "Кава",
    available: true,
  },
  {
    name: "Капучіно",
    description: "Еспресо з ніжною молочною пінкою та корицею за бажанням.",
    price: 65,
    emoji: "🥛",
    category: "Кава",
    available: true,
  },
  {
    name: "Латте",
    description: "М'який смак кави з великою кількістю теплого молока.",
    price: 70,
    emoji: "🍵",
    category: "Кава",
    available: true,
  },
  {
    name: "Американо",
    description: "Еспресо розбавлений гарячою водою. Легкий та освіжаючий.",
    price: 50,
    emoji: "☕",
    category: "Кава",
    available: true,
  },
  {
    name: "Раф",
    description: "Вершковий кавовий напій з ванільним сиропом.",
    price: 75,
    emoji: "🍨",
    category: "Кава",
    available: false,
  },
  {
    name: "Круасан",
    description: "Свіжий французький круасан з маслом.",
    price: 55,
    emoji: "🥐",
    category: "Їжа",
    available: true,
  },
  {
    name: "Чізкейк",
    description: "Ніжний чізкейк Нью-Йорк з ягідним соусом.",
    price: 95,
    emoji: "🍰",
    category: "Їжа",
    available: true,
  },
  {
    name: "Зелений чай",
    description: "Японський зелений чай Сенча. Свіжий та тонізуючий.",
    price: 55,
    emoji: "🍃",
    category: "Чай",
    available: true,
  },
  {
    name: "Матча латте",
    description: "Японський чай матча з молоком.",
    price: 80,
    emoji: "🍵",
    category: "Чай",
    available: true,
  },
  {
    name: "Какао",
    description: "Гарячий шоколадний напій з маршмелоу.",
    price: 60,
    emoji: "🍫",
    category: "Інше",
    available: true,
  },
];

// Хелпер: створити Order + його OrderItem-и одним блоком
async function seedOrder({ user, items, status, notes = "" }) {
  const totalPrice = items.reduce(
    (sum, it) => sum + it.drink.price * it.quantity,
    0
  );

  const order = await Order.create({
    user: user._id,
    totalPrice,
    status,
    notes,
  });

  await OrderItem.insertMany(
    items.map((it) => ({
      order: order._id,
      drink: it.drink._id,
      quantity: it.quantity,
      priceAtOrder: it.drink.price,
    }))
  );

  return order;
}

export async function GET() {
  try {
    await dbConnect();

    // Seed напоїв
    await Drink.deleteMany({});
    const drinks = await Drink.create(initialDrinks);

    // Тиждень 9: Seed користувачів з різними ролями
    await User.deleteMany({});
    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = await User.insertMany([
      {
        name: "Адміністратор",
        email: "admin@test.com",
        password: hashedPassword,
        role: "admin",
      },
      {
        name: "Користувач",
        email: "user@test.com",
        password: hashedPassword,
        role: "user",
      },
      {
        name: "Олена",
        email: "olena@test.com",
        password: hashedPassword,
        role: "user",
      },
    ]);

    // Тиждень 11: Seed замовлень через Order + OrderItem
    await Order.deleteMany({});
    await OrderItem.deleteMany({});

    const [admin, userOne, userTwo] = users;
    const [espresso, cappuccino, latte, americano, , croissant, cheesecake, greenTea, matcha] = drinks;

    const ordersData = [
      // Замовлення з 2 позиціями (many-to-many у дії)
      {
        user: userOne,
        items: [
          { drink: latte, quantity: 2 },
          { drink: croissant, quantity: 1 },
        ],
        status: "pending",
        notes: "Без цукру",
      },
      // Одна позиція
      {
        user: userOne,
        items: [{ drink: americano, quantity: 1 }],
        status: "completed",
      },
      // 3 позиції
      {
        user: userTwo,
        items: [
          { drink: cappuccino, quantity: 1 },
          { drink: cheesecake, quantity: 1 },
          { drink: greenTea, quantity: 2 },
        ],
        status: "preparing",
        notes: "З корицею",
      },
      // Одна позиція
      {
        user: userTwo,
        items: [{ drink: matcha, quantity: 1 }],
        status: "ready",
      },
      // 2 позиції
      {
        user: userTwo,
        items: [
          { drink: greenTea, quantity: 3 },
          { drink: croissant, quantity: 2 },
        ],
        status: "pending",
      },
      // Замовлення адміна
      {
        user: admin,
        items: [{ drink: espresso, quantity: 1 }],
        status: "completed",
      },
    ];

    const orders = [];
    for (const data of ordersData) {
      orders.push(await seedOrder(data));
    }

    const itemsCount = await OrderItem.countDocuments({});

    return Response.json({
      message: `Seed виконано: ${drinks.length} напоїв, ${users.length} користувачів, ${orders.length} замовлень, ${itemsCount} позицій`,
      drinks: drinks.length,
      users: users.length,
      orders: orders.length,
      orderItems: itemsCount,
      testAccounts: [
        { email: "admin@test.com", password: "password123", role: "admin" },
        { email: "user@test.com", password: "password123", role: "user" },
        { email: "olena@test.com", password: "password123", role: "user" },
      ],
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
