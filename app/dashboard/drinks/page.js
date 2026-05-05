// Тиждень 7: Dashboard список напоїв — Client Component з fetch від API (MongoDB)
'use client'

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DrinksListPage() {
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/drinks")
      .then((res) => res.json())
      .then((data) => {
        setDrinks(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div>
        <div className="h-10 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Завантаження...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Напої</h1>
        <Link
          href="/dashboard/drinks/new"
          className="bg-amber-700 text-white px-6 py-2 rounded hover:bg-amber-800 transition"
        >
          + Додати напій
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Назва</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Категорія</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ціна</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {drinks.map((drink) => (
              <tr key={drink._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span>{drink.emoji}</span>
                    <span className="font-medium text-gray-900">{drink.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">{drink.category}</td>
                <td className="px-6 py-4 text-gray-700">{drink.price} грн</td>
                <td className="px-6 py-4">
                  {drink.available ? (
                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">В наявності</span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">Немає</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/drinks/${drink._id}`}
                    className="text-amber-700 hover:underline"
                  >
                    Переглянути
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
