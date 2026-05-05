export const metadata = {
  title: "Контакти",
  description: "Зв'яжіться з кав'ярнею «Кофеїн»",
};

export default function ContactPage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-amber-800 to-amber-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">Контакти</h1>
          <p className="text-lg opacity-90">Ми завжди раді вас бачити</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-white">Наші контакти</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold text-white">Адреса</p>
                    <p className="text-gray-600">вул. Хрещатик, 1, Київ</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="font-semibold text-white">Телефон</p>
                    <p className="text-gray-600">+380 44 123-45-67</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🕒</span>
                  <div>
                    <p className="font-semibold text-white">Графік роботи</p>
                    <p className="text-gray-600">Пн-Пт: 8:00 - 22:00</p>
                    <p className="text-gray-600">Сб-Нд: 9:00 - 23:00</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6 text-white">Напишіть нам</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600">
                  Форма зворотного зв&#39;язку буде додана пізніше (тиждень 12).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
