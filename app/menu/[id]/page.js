// Деталі напою (публічна сторінка) — Server Component
// Тиждень 7: дані з MongoDB через Mongoose

import Link from "next/link";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Drink from "@/lib/models/Drink";
import FavoriteButton from "@/components/FavoriteButton";

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    await dbConnect();
    const drink = await Drink.findById(id).lean();
    if (!drink) return { title: "Не знайдено" };

    return {
      title: drink.name,
      description: drink.description,
    };
  } catch {
    return { title: "Не знайдено" };
  }
}

export default async function DrinkPage({ params }) {
  const { id } = await params;

  await dbConnect();

  let drink;
  try {
    drink = await Drink.findById(id).lean();
  } catch {
    notFound();
  }

  if (!drink) {
    notFound();
  }

  return (
    <div>
      <section className="bg-gradient-to-r from-amber-800 to-amber-600 text-white py-12">
        <div className="container mx-auto px-4">
          <Link href="/menu" className="text-amber-200 hover:text-white transition">
            &larr; Назад до меню
          </Link>
          <div className="mt-4 flex items-center gap-6">
            <span className="text-7xl">{drink.emoji}</span>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold">{drink.name}</h1>
                <FavoriteButton drinkId={drink._id.toString()} />
              </div>
              <span className="text-amber-200">{drink.category}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-gray-500 text-sm font-bold mb-1">Ціна</h3>
                <p className="text-2xl font-bold text-amber-700">{drink.price} грн</p>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-bold mb-1">Наявність</h3>
                {drink.available ? (
                  <span className="text-green-600 font-semibold">В наявності</span>
                ) : (
                  <span className="text-red-600 font-semibold">Тимчасово немає</span>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-bold mb-2">Опис</h3>
              <p className="text-gray-700 leading-relaxed">{drink.description}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
