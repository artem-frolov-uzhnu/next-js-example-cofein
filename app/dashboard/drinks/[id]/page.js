// Тиждень 7: Деталі напою — Client Component з fetch від API (MongoDB)
'use client'

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DrinkActions from "@/components/DrinkActions";

export default function DrinkDetailPage() {
  const { id } = useParams();
  const [drink, setDrink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/drinks/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Напій не знайдено");
        return res.json();
      })
      .then((data) => {
        setDrink(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div>
        <div className="h-4 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
        <div className="bg-white rounded-lg shadow p-8">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Link href="/dashboard/drinks" className="text-amber-700 hover:underline mb-4 inline-block">
          &larr; Назад до списку
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">404</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link href="/dashboard/drinks" className="text-amber-700 hover:underline mb-4 inline-block">
        &larr; Назад до списку
      </Link>

      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{drink.emoji}</span>
            <h1 className="text-3xl font-bold text-gray-900">{drink.name}</h1>
          </div>
          <DrinkActions drinkId={drink._id} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-gray-500 text-sm font-bold mb-1">Категорія</h3>
            <p className="text-lg text-gray-900">{drink.category}</p>
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-bold mb-1">Ціна</h3>
            <p className="text-lg text-gray-900">{drink.price} грн</p>
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-bold mb-1">Наявність</h3>
            {drink.available ? (
              <span className="text-green-600 font-semibold">В наявності</span>
            ) : (
              <span className="text-red-600 font-semibold">Немає</span>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-gray-500 text-sm font-bold mb-2">Опис</h3>
          <p className="text-gray-700">{drink.description}</p>
        </div>
      </div>
    </div>
  );
}
