export default async function CachedPage() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1')
  const post = await response.json()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Закешований пост</h1>
      <div className="bg-blue-50 p-4 rounded mb-4">
        <p className="text-sm text-blue-800">
          <strong>Production:</strong> Цей пост закешований назавжди (після build). Timestamp не змінюється при оновленні.
        </p>
        <p className="text-sm text-blue-800 mt-1">
          <strong>Dev-режим:</strong> В <code>npm run dev</code> кешування не працює &mdash; час оновлюється при кожному запиті. Щоб побачити різницю, запустіть <code>npm run build &amp;&amp; npm start</code>.
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
