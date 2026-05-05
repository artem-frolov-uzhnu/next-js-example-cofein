// Компонент MenuFilter — фільтрація та пошук
// Тиждень 7: дані завантажуються з API замість прямого імпорту

'use client'
import { useState, useEffect } from 'react'
import MenuCard from './MenuCard'

export default function MenuFilter() {
  const [drinks, setDrinks] = useState([])
  const [categories, setCategories] = useState(['Всі'])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Всі')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)

  useEffect(() => {
    async function fetchDrinks() {
      try {
        const res = await fetch('/api/drinks')
        const data = await res.json()
        setDrinks(data)

        const cats = ['Всі', ...new Set(data.map(d => d.category))]
        setCategories(cats)
      } catch (error) {
        console.error('Помилка завантаження:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDrinks()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg">Завантаження меню...</p>
      </div>
    )
  }

  // Фільтрація елементів
  const filteredItems = drinks.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'Всі' || item.category === activeCategory
    const matchesAvailability = !showAvailableOnly || item.available
    return matchesSearch && matchesCategory && matchesAvailability
  })

  return (
    <div>
      {/* Пошук */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Пошук за назвою або описом..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 text-gray-900"
        />
      </div>

      {/* Фільтри */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition cursor-pointer ${
              activeCategory === category
                ? 'bg-amber-700 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Чекбокс доступності */}
      <label className="flex items-center gap-2 mb-6 cursor-pointer">
        <input
          type="checkbox"
          checked={showAvailableOnly}
          onChange={(e) => setShowAvailableOnly(e.target.checked)}
          className="w-4 h-4 accent-amber-700"
        />
        <span className="text-gray-700">Тільки в наявності</span>
      </label>

      {/* Кількість результатів */}
      <p className="text-sm text-gray-500 mb-4">
        Знайдено: {filteredItems.length} з {drinks.length} позицій
      </p>

      {/* Список карток */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <MenuCard key={item._id} {...item} id={item._id} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-lg">Нічого не знайдено</p>
          <p className="text-sm">Спробуйте змінити пошук або фільтри</p>
        </div>
      )}
    </div>
  )
}
