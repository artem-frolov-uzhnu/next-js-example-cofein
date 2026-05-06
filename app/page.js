// Головна сторінка кав'ярні "Кофеїн"
// Тиждень 2: використання компонентів та props
// Тиждень 13: hero використовує next/image (priority + remote URL з Unsplash)

import Image from "next/image";
import Link from "next/link";
import MenuCard from "@/components/MenuCard";

// Популярні позиції для головної сторінки
const popularItems = [
  { id: 1, name: "Еспресо", description: "Класичний італійський еспресо з насиченим смаком та ароматом.", price: 45, emoji: "☕", category: "Кава", available: true },
  { id: 2, name: "Капучино", description: "Еспресо з ніжною молочною пінкою та корицею за бажанням.", price: 65, emoji: "🥛", category: "Кава", available: true },
  { id: 3, name: "Латте", description: "М'який смак кави з великою кількістю теплого молока.", price: 70, emoji: "🍵", category: "Кава", available: true },
];

export default function Home() {
  return (
    <div>
      {/* Hero секція з оптимізованим зображенням (next/image) */}
      <section className="relative h-[480px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80"
          alt="Затишна кав'ярня з ароматною кавою"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Темний overlay для читабельності тексту */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 to-amber-700/60" />
        <div className="relative container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">
            Кав'ярня «Кофеїн»
          </h1>
          <p className="text-xl mb-8 opacity-95">
            Найкраща кава в Ужгороді. Затишна атмосфера та бездоганний сервіс.
          </p>
          <Link
            href="/menu"
            className="inline-block bg-white text-amber-800 px-8 py-3 rounded-lg font-semibold hover:bg-amber-100 transition"
          >
            Переглянути меню
          </Link>
        </div>
      </section>

      {/* Секція популярних напоїв — використання компонента MenuCard */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Популярні напої
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularItems.map(item => (
              <MenuCard key={item.id} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Секція переваг */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Чому обирають нас
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="font-semibold mb-2 text-gray-900">Свіжа обсмажка</h3>
              <p className="text-gray-600 text-sm">Кава обсмажується щотижня</p>
            </div>

            <div className="text-center p-6">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="font-semibold mb-2 text-gray-900">Якісні зерна</h3>
              <p className="text-gray-600 text-sm">100% арабіка з найкращих плантацій</p>
            </div>

            <div className="text-center p-6">
              <div className="text-4xl mb-4">👨‍🍳</div>
              <h3 className="font-semibold mb-2 text-gray-900">Досвідчені бариста</h3>
              <p className="text-gray-600 text-sm">Команда професіоналів</p>
            </div>

            <div className="text-center p-6">
              <div className="text-4xl mb-4">🛋️</div>
              <h3 className="font-semibold mb-2 text-gray-900">Затишна атмосфера</h3>
              <p className="text-gray-600 text-sm">Комфорт для роботи та відпочинку</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
