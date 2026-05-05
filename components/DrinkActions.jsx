// Кнопки дій для напою — Client Component
// Тиждень 4: useState для діалогу підтвердження, useRouter для навігації
// Тиждень 6: fetch DELETE до API замість console.log
// Тиждень 9: кнопки показуються тільки для admin
// Тиждень 12: toast-нотифікації замість silent push

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

export default function DrinkActions({ drinkId }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'

  // Тиждень 9: якщо не admin — не показуємо кнопки
  if (!isAdmin) return null

  const handleEdit = () => {
    router.push(`/dashboard/drinks/${drinkId}/edit`)
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/drinks/${drinkId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error || 'Помилка видалення')
      }

      toast.success('Напій видалено')
      setShowConfirm(false)
      router.push('/dashboard/drinks')
      router.refresh()
    } catch (error) {
      toast.error(error.message)
      setShowConfirm(false)
    } finally {
      setLoading(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="space-x-2">
        <span className="text-red-600 font-semibold mr-2">Видалити?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Видалення...' : 'Так'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
        >
          Ні
        </button>
      </div>
    )
  }

  return (
    <div className="space-x-2">
      <button
        onClick={handleEdit}
        className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 cursor-pointer"
      >
        Редагувати
      </button>
      <button
        onClick={() => setShowConfirm(true)}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
      >
        Видалити
      </button>
    </div>
  )
}
