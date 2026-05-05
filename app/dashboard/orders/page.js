// Тиждень 11: Список замовлень у dashboard (many-to-many через OrderItem)
// Admin — таблиця з user + items (перелік позицій)
// User  — власні замовлення картками

'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import OrderStatusBadge from '@/components/OrderStatusBadge'

export default function OrdersListPage() {
  const { data: session } = useSession()
  const role = session?.user?.role

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div>
        <div className="h-10 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Завантаження...
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {role === 'admin' ? 'Усі замовлення' : 'Мої замовлення'}
        </h1>
        <Link
          href="/dashboard/orders/new"
          className="bg-amber-700 text-white px-6 py-2 rounded hover:bg-amber-800 transition"
        >
          + Нове замовлення
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Замовлень поки немає.
        </div>
      ) : role === 'admin' ? (
        <AdminTable orders={orders} />
      ) : (
        <UserCards orders={orders} />
      )}
    </div>
  )
}

// Стисле прев'ю позицій: перші 2 + "і ще N"
function ItemsPreview({ items }) {
  if (!items || items.length === 0) {
    return <span className="text-gray-400 italic">(без позицій)</span>
  }
  const visible = items.slice(0, 2)
  const rest = items.length - visible.length
  return (
    <div className="text-sm">
      {visible.map((it, idx) => (
        <div key={it._id || idx} className="text-gray-700">
          {it.drink ? (
            <>
              {it.drink.emoji} {it.drink.name}
              <span className="text-gray-500"> × {it.quantity}</span>
            </>
          ) : (
            <span className="text-gray-400 italic">(видалено) × {it.quantity}</span>
          )}
        </div>
      ))}
      {rest > 0 && (
        <div className="text-xs text-gray-500">і ще {rest}…</div>
      )}
    </div>
  )
}

function AdminTable({ orders }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Користувач</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Позиції</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Сума</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дії</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-600 align-top">
                {new Date(order.createdAt).toLocaleString('uk-UA')}
              </td>
              <td className="px-4 py-3 align-top">
                {order.user ? (
                  <div>
                    <div className="font-medium text-gray-900">{order.user.name}</div>
                    <div className="text-xs text-gray-500">{order.user.email}</div>
                  </div>
                ) : (
                  <span className="text-gray-400 italic">—</span>
                )}
              </td>
              <td className="px-4 py-3 align-top">
                <ItemsPreview items={order.items} />
              </td>
              <td className="px-4 py-3 font-medium text-gray-900 align-top">{order.totalPrice} грн</td>
              <td className="px-4 py-3 align-top">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3 align-top">
                <Link
                  href={`/dashboard/orders/${order._id}`}
                  className="text-amber-700 hover:underline text-sm"
                >
                  Переглянути
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function UserCards({ orders }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {orders.map((order) => {
        const itemsCount = order.items?.length || 0
        return (
          <Link
            key={order._id}
            href={`/dashboard/orders/${order._id}`}
            className="bg-white rounded-lg shadow p-5 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg text-gray-900">
                  Замовлення #{order._id.slice(-6)}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString('uk-UA')}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="mb-3">
              <ItemsPreview items={order.items} />
            </div>
            <div className="flex justify-between text-sm text-gray-700 border-t pt-2">
              <span>{itemsCount} {itemsCount === 1 ? 'позиція' : 'позицій'}</span>
              <span className="font-bold text-amber-700">{order.totalPrice} грн</span>
            </div>
            {order.notes && (
              <p className="text-xs text-gray-500 mt-2 italic">&ldquo;{order.notes}&rdquo;</p>
            )}
          </Link>
        )
      })}
    </div>
  )
}
