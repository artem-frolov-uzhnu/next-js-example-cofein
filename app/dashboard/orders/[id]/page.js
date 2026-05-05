// Тиждень 11: Деталі одного замовлення (many-to-many через OrderItem)
// Server Component — populate items.drink через virtual

import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import Order from '@/lib/models/Order'
import OrderItem from '@/lib/models/OrderItem'
import Drink from '@/lib/models/Drink'
import User from '@/lib/models/User'
import OrderStatusBadge from '@/components/OrderStatusBadge'
import OrderActions from '@/components/OrderActions'

// Реєструємо моделі для populate()
void [Drink, User, OrderItem]

export default async function OrderDetailsPage({ params }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const { id } = await params
  await dbConnect()

  let order
  try {
    order = await Order.findById(id)
      .populate({ path: 'user', select: 'name email role' })
      .populate({
        path: 'items',
        populate: { path: 'drink', select: 'name price emoji category description' },
      })
      .lean({ virtuals: true })
  } catch {
    notFound()
  }
  if (!order) notFound()

  const isAdmin = session.user.role === 'admin'
  const isOwner = order.user?._id?.toString() === session.user.id
  if (!isAdmin && !isOwner) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded">
        У вас немає доступу до цього замовлення.
      </div>
    )
  }

  // Прибираємо Mongoose внутрішні поля для серіалізації
  const serialized = JSON.parse(JSON.stringify(order))
  const items = serialized.items || []

  return (
    <div className="max-w-3xl">
      <div className="mb-4">
        <Link href="/dashboard/orders" className="text-amber-700 hover:underline text-sm">
          &larr; До списку
        </Link>
      </div>

      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Замовлення #{serialized._id.slice(-6)}
        </h1>
        <OrderStatusBadge status={serialized.status} />
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-5">
        <InfoRow label="Створено">
          {new Date(serialized.createdAt).toLocaleString('uk-UA')}
        </InfoRow>

        <InfoRow label="Користувач">
          {serialized.user ? (
            <>
              <span className="font-medium">{serialized.user.name}</span>
              <span className="text-gray-500 text-sm ml-2">({serialized.user.email})</span>
            </>
          ) : (
            <span className="italic text-gray-400">—</span>
          )}
        </InfoRow>

        {serialized.notes && (
          <InfoRow label="Коментар">
            <span className="italic">&ldquo;{serialized.notes}&rdquo;</span>
          </InfoRow>
        )}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Позиції замовлення</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Напій</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ціна</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">К-сть</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Сума</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-400 italic">
                  Позицій немає
                </td>
              </tr>
            ) : (
              items.map((it) => {
                const subtotal = it.priceAtOrder * it.quantity
                return (
                  <tr key={it._id}>
                    <td className="px-4 py-3">
                      {it.drink ? (
                        <div>
                          <div className="font-medium text-gray-900">
                            {it.drink.emoji} {it.drink.name}
                          </div>
                          <div className="text-xs text-gray-500">{it.drink.category}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">(напій видалено)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {it.priceAtOrder} грн
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{it.quantity}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {subtotal} грн
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={3} className="px-4 py-3 text-right font-bold text-gray-700">
                Разом:
              </td>
              <td className="px-4 py-3 text-right text-xl font-bold text-amber-700">
                {serialized.totalPrice} грн
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-6">
        <OrderActions
          order={serialized}
          role={session.user.role}
          currentUserId={session.user.id}
        />
      </div>
    </div>
  )
}

function InfoRow({ label, children }) {
  return (
    <div className="flex gap-4 border-b pb-3 last:border-0 last:pb-0">
      <div className="w-32 text-sm font-medium text-gray-500 flex-shrink-0">{label}</div>
      <div className="flex-1 text-gray-900">{children}</div>
    </div>
  )
}
