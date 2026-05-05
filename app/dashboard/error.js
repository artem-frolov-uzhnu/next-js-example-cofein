'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="max-w-md mx-auto mt-12 bg-red-50 border border-red-200 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Помилка в dashboard
      </h2>
      <p className="text-gray-700 mb-6">{error.message}</p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800"
        >
          Спробувати знову
        </button>
        <Link
          href="/"
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          На головну
        </Link>
      </div>
    </div>
  )
}
