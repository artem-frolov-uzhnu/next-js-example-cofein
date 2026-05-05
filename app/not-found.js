import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl mb-4">☕</p>
        <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          Ой! Цю сторінку не знайдено.
        </p>
        <Link
          href="/"
          className="bg-amber-700 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition"
        >
          На головну
        </Link>
      </div>
    </div>
  );
}
