// Тиждень 11: Кнопки дій над замовленням
// Тиждень 12: toast-нотифікації замість inline-плашки помилок
// Admin: редагувати статус, видалити
// User (owner, pending): скасувати

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'

export default function OrderActions({ order, role, currentUserId }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const isAdmin = role === 'admin'
  const isOwner =
    (order.user?._id || order.user || '').toString() === currentUserId
  const canCancel = isOwner && order.status === 'pending'

  const handleDelete = async () => {
    if (!confirm('Видалити замовлення безповоротно?')) return
    setLoading(true)
    const res = await fetch(`/api/orders/${order._id}`, { method: 'DELETE' })
    setLoading(false)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      toast.error(data.error || 'Помилка видалення')
      return
    }
    toast.success('Замовлення видалено')
    router.push('/dashboard/orders')
    router.refresh()
  }

  const handleCancel = async () => {
    if (!confirm('Скасувати це замовлення?')) return
    setLoading(true)
    const res = await fetch(`/api/orders/${order._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    })
    setLoading(false)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      toast.error(data.errors?.[0] || data.error || 'Помилка скасування')
      return
    }
    toast.success('Замовлення скасовано')
    router.refresh()
  }

  return (
    <div>
      <div className="flex gap-3 flex-wrap">
        {isAdmin && (
          <>
            <Link
              href={`/dashboard/orders/${order._id}/edit`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium"
            >
              Редагувати
            </Link>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-medium disabled:opacity-50"
            >
              Видалити
            </button>
          </>
        )}
        {!isAdmin && canCancel && (
          <button
            onClick={handleCancel}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-medium disabled:opacity-50"
          >
            Скасувати
          </button>
        )}
      </div>
    </div>
  )
}
