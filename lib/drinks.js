// Спільні дані меню кав'ярні
// Тиждень 3: винесено в окремий файл для використання на різних сторінках
// Тиждень 6: мутабельне сховище з CRUD-операціями (in-memory)

let drinks = [
  { id: 1, name: "Еспресо", description: "Класичний італійський еспресо з насиченим смаком та ароматом.", price: 45, emoji: "☕", category: "Кава", available: true },
  { id: 2, name: "Капучино", description: "Еспресо з ніжною молочною пінкою та корицею за бажанням.", price: 65, emoji: "🥛", category: "Кава", available: true },
  { id: 3, name: "Латте", description: "М'який смак кави з великою кількістю теплого молока.", price: 70, emoji: "🍵", category: "Кава", available: true },
  { id: 4, name: "Американо", description: "Еспресо розбавлений гарячою водою. Легкий та освіжаючий.", price: 50, emoji: "☕", category: "Кава", available: true },
  { id: 5, name: "Раф", description: "Вершковий кавовий напій з ванільним сиропом.", price: 75, emoji: "🍨", category: "Кава", available: false },
  { id: 6, name: "Круасан", description: "Свіжий французький круасан з маслом.", price: 55, emoji: "🥐", category: "Їжа", available: true },
  { id: 7, name: "Чізкейк", description: "Ніжний чізкейк Нью-Йорк з ягідним соусом.", price: 95, emoji: "🍰", category: "Їжа", available: true },
  { id: 8, name: "Зелений чай", description: "Японський зелений чай Сенча. Свіжий та тонізуючий.", price: 55, emoji: "🍃", category: "Чай", available: true },
  { id: 9, name: "Матча латте", description: "Японський чай матча з молоком.", price: 80, emoji: "🍵", category: "Чай", available: true },
  { id: 10, name: "Какао", description: "Гарячий шоколадний напій з маршмелоу.", price: 60, emoji: "🍫", category: "Інше", available: true },
];

let nextId = 11;

export { drinks };

export function getDrinkById(id) {
  return drinks.find((drink) => drink.id === Number(id));
}

export function getCategories() {
  return ["Всі", ...new Set(drinks.map((item) => item.category))];
}

export function addDrink(data) {
  const newDrink = {
    id: nextId++,
    name: data.name,
    description: data.description || "",
    price: Number(data.price),
    emoji: data.emoji || "☕",
    category: data.category,
    available: data.available !== undefined ? data.available : true,
  };
  drinks.push(newDrink);
  return newDrink;
}

export function updateDrink(id, data) {
  const index = drinks.findIndex((drink) => drink.id === Number(id));
  if (index === -1) return null;

  drinks[index] = {
    ...drinks[index],
    ...data,
    id: drinks[index].id,
    price: data.price !== undefined ? Number(data.price) : drinks[index].price,
  };
  return drinks[index];
}

export function deleteDrink(id) {
  const index = drinks.findIndex((drink) => drink.id === Number(id));
  if (index === -1) return false;

  drinks.splice(index, 1);
  return true;
}
