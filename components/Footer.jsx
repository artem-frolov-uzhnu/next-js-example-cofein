// Компонент Footer — підвал сайту
// Виділений в окремий компонент для повторного використання на всіх сторінках

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-xl font-semibold mb-2">Кав'ярня «Кофеїн»</h3>
        <p className="text-gray-400 mb-4">вул. Хрещатик, 1, Київ</p>
        <p className="text-gray-400 mb-4">Працюємо: Пн-Нд 8:00 - 22:00</p>
        <p className="text-gray-500 text-sm">
          © 2024 Демонстраційний проект | Курс «Основи обробки та передачі інформації»
        </p>
      </div>
    </footer>
  );
}
