# Кав'ярня «Кофеїн» ☕

Full-stack веб-застосунок кав'ярні з повноцінним меню, авторизацією, системою замовлень
та адміністративною панеллю. Демо-проєкт курсу "Основи обробки та передачі інформації"
(Тиждень 13: production-готовність та деплоймент).

> **Демо:** _додати посилання на Vercel-деплой після першого деплойменту_

## Скріншоти

_Додайте 3–5 скріншотів основних сторінок (головна, меню, dashboard, форма замовлення)._

## Можливості

- 🔐 **Аутентифікація** — реєстрація, логін, logout (NextAuth.js + Credentials Provider)
- 👥 **RBAC** — дві ролі (`admin`, `user`) з розмежуванням доступу через middleware
- ☕ **CRUD напоїв** — admin додає/редагує/видаляє позиції меню (з валідацією)
- 🛒 **Замовлення** — користувач формує замовлення з кількох напоїв (1-to-many + many-to-many через pivot)
- 📊 **Dashboard** — admin має сторінку керування користувачами, статистику
- 🎨 **Сучасні форми** — React Hook Form + Zod resolver + Sonner toasts
- 🛡️ **Безпека** — серверна валідація, санітизація, security headers, bcrypt
- 🚀 **Production-ready** — `next/image`, SEO metadata з OpenGraph, robots.txt + sitemap.xml

## Технологічний стек

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Backend:** Next.js API Routes, NextAuth.js, bcrypt
- **База даних:** MongoDB Atlas + Mongoose ODM
- **Форми:** React Hook Form + @hookform/resolvers + Zod
- **UI feedback:** Sonner (toast-нотифікації)
- **Деплой:** Vercel + GitHub (auto-deploy на push у main)

## Локальний запуск

### 1. Клонування репозиторію

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Встановлення залежностей

```bash
npm install
```

### 3. Налаштування змінних середовища

Скопіюйте `.env.local.example` в `.env.local`:

```bash
cp .env.local.example .env.local
```

Заповніть змінні:

| Змінна                  | Приклад                                              | Опис                                          |
|-------------------------|------------------------------------------------------|-----------------------------------------------|
| `MONGODB_URI`           | `mongodb+srv://user:pass@cluster.mongodb.net/coffein` | Connection string з MongoDB Atlas             |
| `NEXTAUTH_SECRET`       | згенерувати: `openssl rand -base64 32`               | Секретний ключ для JWT                        |
| `NEXTAUTH_URL`          | `http://localhost:3000`                              | URL застосунку (на Vercel — публічний URL)    |
| `NEXT_PUBLIC_SITE_URL`  | `http://localhost:3000`                              | URL для metadata, sitemap, robots             |

### 4. Запуск

```bash
npm run dev
```

Відкрийте [http://localhost:3000](http://localhost:3000).

### 5. Початкові дані

Один раз перейдіть на [http://localhost:3000/api/seed](http://localhost:3000/api/seed) — створяться
тестові напої та користувачі:

- **Admin:** `admin@test.com` / `password123`
- **User:** `user@test.com` / `password123`

## Деплой на Vercel

1. Запушіть код на GitHub
2. Зайдіть на [vercel.com](https://vercel.com), підключіть GitHub-акаунт
3. **Import Project** → виберіть свій репозиторій
4. У **Environment Variables** додайте всі змінні з `.env.local.example`:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` — поставте URL від Vercel (наприклад `https://your-app.vercel.app`)
   - `NEXT_PUBLIC_SITE_URL` — той самий URL від Vercel
5. **Deploy**
6. У MongoDB Atlas → **Network Access** → додайте `0.0.0.0/0` (Vercel використовує динамічні IP)
7. Після першого деплою оновіть `NEXTAUTH_URL` і `NEXT_PUBLIC_SITE_URL` на реальний production-URL

Кожен наступний `git push` у `main` автоматично запускає новий деплой.

## Структура проєкту

```
.
├── app/
│   ├── (auth)/              # login, register (route group)
│   ├── api/                 # API routes (auth, drinks, orders, users)
│   ├── dashboard/           # admin/user dashboard
│   ├── menu/                # публічне меню
│   ├── layout.js            # root layout + metadata
│   ├── page.js              # головна
│   ├── robots.js            # SEO: robots.txt
│   └── sitemap.js           # SEO: sitemap.xml
├── components/
│   ├── forms/FormField.jsx  # reusable wrapper для form-полів
│   ├── DrinkForm.jsx        # RHF + Zod
│   ├── OrderForm.jsx        # RHF + useFieldArray
│   └── ...
├── lib/
│   ├── db.js                # Mongoose connection (cached)
│   ├── auth.js              # NextAuth config
│   ├── authorize.js         # RBAC helper
│   ├── sanitize.js          # XSS protection
│   ├── models/              # Mongoose schemas (User, Drink, Order, OrderItem)
│   └── validations/         # Zod schemas (shared client/server)
├── middleware.js            # route protection
├── next.config.mjs          # security headers + image remote patterns
└── public/                  # static assets, og-image
```

## Безпека

- Паролі хешуються через `bcryptjs` (cost factor 10)
- Усі API-роути використовують `zodSchema.parse(body)` як security gate
- Санітизація HTML через `lib/sanitize.js` (захист від XSS)
- Security headers в `next.config.mjs` (X-Frame-Options, X-Content-Type-Options, Referrer-Policy тощо)
- `.env.local` ніколи не комітиться (див. `.gitignore`)
- RBAC через `middleware.js` + `lib/authorize.js`
