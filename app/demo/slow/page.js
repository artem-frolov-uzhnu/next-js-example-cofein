export default async function SlowPage() {
  await new Promise(resolve => setTimeout(resolve, 3000))

  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  const posts = await response.json()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Повільна сторінка (3 сек)</h1>
      <div className="bg-yellow-50 p-4 rounded mb-6">
        <p className="text-yellow-800">
          Ця сторінка завантажується 3 секунди. При навігації ви побачите loading.js
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.slice(0, 6).map(post => (
          <article key={post.id} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-600">{post.body}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
