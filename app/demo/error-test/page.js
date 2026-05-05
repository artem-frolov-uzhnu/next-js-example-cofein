export const dynamic = 'force-dynamic'

export default async function ErrorTestPage() {
  const shouldFail = Math.random() > 0.5

  if (shouldFail) {
    throw new Error('Випадкова помилка для тестування error.js')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-green-100 border border-green-400 p-4 rounded">
        <h1 className="text-2xl font-bold text-green-800">
          Успіх! Помилки не сталося
        </h1>
        <p className="text-green-700 mt-2">
          Оновіть сторінку - є 50% шанс помилки
        </p>
      </div>
    </div>
  )
}
