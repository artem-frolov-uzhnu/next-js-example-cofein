// Сторінка "Про нас" кав'ярні "Кофеїн"
// Тиждень 2: Header та Footer тепер в layout.js через компоненти
// Тиждень 13: додано static metadata для SEO

export const metadata = {
  title: "Про нас",
  description: "Історія кав'ярні «Кофеїн» — команда ентузіастів, які перетворили любов до кави на справу всього життя.",
};

export default function About() {
  return (
    <div>
      {/* Hero секція */}
      <section className="bg-gradient-to-r from-amber-800 to-amber-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Про нашу кав'ярню</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Ми — команда ентузіастів, які перетворили любов до кави на справу всього життя.
          </p>
        </div>
      </section>

      {/* Наша історія */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Наша історія</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Кав'ярня «Кофеїн» відкрилась у 2018 році в самому серці Києва. Все почалося
              з маленького кіоску на Хрещатику, де ми пропонували каву з собою. Поступово
              ми зросли до затишного закладу, де кожен гість почувається як вдома.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Наша місія — робити якісну каву доступною для кожного. Ми самостійно обираємо
              зерна, контролюємо обсмажку та постійно вдосконалюємо рецептури.
            </p>
          </div>
        </div>
      </section>

      {/* Наша команда */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Наша команда
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition">
              <div className="text-5xl mb-4">👨‍💼</div>
              <h3 className="text-lg font-semibold text-gray-900">Олександр</h3>
              <p className="text-amber-700 text-sm mb-2">Засновник</p>
              <p className="text-gray-600 text-sm">
                10 років досвіду в кавовій індустрії. Сертифікований Q-грейдер.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition">
              <div className="text-5xl mb-4">👩‍🍳</div>
              <h3 className="text-lg font-semibold text-gray-900">Марія</h3>
              <p className="text-amber-700 text-sm mb-2">Шеф-бариста</p>
              <p className="text-gray-600 text-sm">
                Чемпіонка України з латте-арту 2022. Створює авторські напої.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition">
              <div className="text-5xl mb-4">👨‍🔧</div>
              <h3 className="text-lg font-semibold text-gray-900">Дмитро</h3>
              <p className="text-amber-700 text-sm mb-2">Обсмажувач</p>
              <p className="text-gray-600 text-sm">
                Відповідає за обсмажку зерен. Працює з фермами Ефіопії та Колумбії.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Наші цінності */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Наші цінності
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="flex gap-4">
              <div className="text-3xl">🌍</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Екологічність</h3>
                <p className="text-gray-600 text-sm">
                  Використовуємо біорозкладні стаканчики та підтримуємо fair trade.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">✨</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Якість</h3>
                <p className="text-gray-600 text-sm">
                  Кожна чашка кави готується з увагою до деталей та любов'ю.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">🤝</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Спільнота</h3>
                <p className="text-gray-600 text-sm">
                  Проводимо каппінги, майстер-класи та підтримуємо локальних митців.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">📖</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Освіта</h3>
                <p className="text-gray-600 text-sm">
                  Ділимось знаннями про каву — від вирощування до приготування.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Контакти */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Завітайте до нас</h2>
          <div className="max-w-md mx-auto space-y-3">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">Адреса:</span> вул. Хрещатик, 1, Київ
            </p>
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">Графік:</span> Пн-Нд 8:00 - 22:00
            </p>
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">Телефон:</span> +380 44 123 45 67
            </p>
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">Email:</span> hello@cofein.ua
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
