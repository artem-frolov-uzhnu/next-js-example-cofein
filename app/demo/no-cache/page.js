export default async function NoCachePage() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/3', {
    cache: 'no-store'
  })
  const post = await response.json()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Пост без кешу</h1>
      <div className="bg-red-50 p-4 rounded mb-4">
        <p className="text-sm text-red-800">
          <strong>Production:</strong> Цей пост НЕ кешується. Кожне оновлення &mdash; новий запит до API, timestamp завжди новий.
        </p>
        <p className="text-sm text-red-800 mt-1">
          <strong>Dev-режим:</strong> В <code>npm run dev</code> всі три варіанти поводяться однаково (час оновлюється завжди). Щоб побачити різницю, запустіть <code>npm run build &amp;&amp; npm start</code>.
        </p>
      </div>

      <article className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
        <p className="text-gray-700">{post.body}</p>
        <p className="text-sm text-gray-500 mt-4">
          Завантажено: {new Date().toLocaleTimeString()}
        </p>
      </article>
    </div>
  )
}
