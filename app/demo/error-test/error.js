'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Error caught:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">&#x26A0;&#xFE0F;</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Виникла помилка
          </h2>
          <p className="text-gray-600 mb-6">
            {error.message}
          </p>
          <button
            onClick={reset}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 font-bold"
          >
            Спробувати знову
          </button>
        </div>
      </div>
    </div>
  )
}
