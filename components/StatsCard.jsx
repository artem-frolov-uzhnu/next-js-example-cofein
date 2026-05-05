// Картка статистики — Server Component
// Тиждень 4: чисто презентаційний компонент, без hooks та подій

const colorClasses = {
  amber: 'text-amber-700',
  green: 'text-green-600',
  blue: 'text-blue-600',
  red: 'text-red-600',
}

export default function StatsCard({ title, value, color = 'amber' }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-gray-500 text-sm font-bold">{title}</h3>
      <p className={`text-4xl font-bold mt-2 ${colorClasses[color] || colorClasses.amber}`}>
        {value}
      </p>
    </div>
  )
}
