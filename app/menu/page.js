// Сторінка "Меню" — демонструє інтерактивність
// Використовує клієнтський компонент MenuFilter з useState
// Тиждень 13: додано static metadata для SEO

import MenuFilter from "@/components/MenuFilter";

export const metadata = {
  title: "Меню",
  description: "Перегляньте повне меню кав'ярні «Кофеїн»: кава, чай, десерти, сезонні напої.",
  openGraph: {
    title: "Меню | Кофеїн",
    description: "Перегляньте повне меню кав'ярні «Кофеїн».",
  },
};

export default function MenuPage() {
  return (
    <div>
      {/* Заголовок сторінки */}
      <section className="bg-gradient-to-r from-amber-800 to-amber-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">Наше меню</h1>
          <p className="text-lg opacity-90">Знайдіть свій ідеальний напій або перекус</p>
        </div>
      </section>

      {/* Фільтрація та картки — клієнтський компонент */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <MenuFilter />
        </div>
      </section>
    </div>
  );
}
