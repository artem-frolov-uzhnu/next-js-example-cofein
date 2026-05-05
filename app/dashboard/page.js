// Dashboard — Server Component
// Тиждень 7: статистика з MongoDB через getDrinkStats()
// Тиждень 11: статистика замовлень видна лише адміністратору

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import StatsCard from "@/components/StatsCard";
import { getDrinkStats, getOrderStats } from "@/lib/helpers";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "admin";

  // Замовлення-статистика — лише адмінам, тому й запит робимо тільки для них.
  const [drinkStats, orderStats] = await Promise.all([
    getDrinkStats(),
    isAdmin ? getOrderStats() : Promise.resolve(null),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Огляд</h1>

      <h2 className="text-xl font-semibold text-gray-700 mb-3">Меню</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Позицій у меню" value={drinkStats.total} color="amber" />
        <StatsCard title="В наявності" value={drinkStats.available} color="green" />
        <StatsCard title="Середня ціна" value={`${drinkStats.avgPrice} грн`} color="blue" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <StatsCard title="Категорій" value={drinkStats.categoriesCount} color="blue" />
        <StatsCard title="Немає в наявності" value={drinkStats.unavailable} color="red" />
      </div>

      {isAdmin && orderStats && (
        <>
          <h2 className="text-xl font-semibold text-gray-700 mt-8 mb-3">Замовлення</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard title="Замовлень всього" value={orderStats.total} color="amber" />
            <StatsCard title="Очікують" value={orderStats.pending} color="red" />
            <StatsCard title="Виконано" value={orderStats.completed} color="green" />
          </div>
        </>
      )}
    </div>
  );
}
