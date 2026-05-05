// Компонент MenuCard — Server Component з Client "островком"
// Тиждень 4: додано FavoriteButton (Client) всередину Server Component

import Link from "next/link";
import FavoriteButton from "./FavoriteButton";

export default function MenuCard({ id, name, description, price, emoji, category, available = true }) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition ${!available ? 'opacity-60' : ''}`}>
      <div className="h-32 bg-amber-100 flex items-center justify-center">
        <span className="text-5xl">{emoji}</span>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <div className="flex items-center gap-2">
            {id && <FavoriteButton drinkId={id} />}
            {available ? (
              <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                В наявності
              </span>
            ) : (
              <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">
                Немає
              </span>
            )}
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-3">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-amber-700 font-bold text-lg">{price} грн</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{category}</span>
            {id && (
              <Link
                href={`/menu/${id}`}
                className="text-xs text-amber-700 hover:text-amber-900 font-medium"
              >
                Детальніше &rarr;
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
