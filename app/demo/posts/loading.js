export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-10 bg-gray-200 rounded w-64 mb-8 animate-pulse"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-1 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-32 mt-4 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
