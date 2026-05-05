// Компонент Header — навігація сайту з активними лінками
// Тиждень 3: додано usePathname для підсвітки поточної сторінки
// Тиждень 8: додано useSession для відображення користувача та кнопки виходу
// Тиждень 9: додано badge ролі (admin/user)

'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { href: "/", label: "Головна" },
  { href: "/menu", label: "Меню" },
  { href: "/about", label: "Про нас" },
  { href: "/contact", label: "Контакти" },
];

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="bg-amber-900 text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-amber-200 transition">
          Кофеїн
        </Link>
        <nav className="flex items-center gap-6">
          <ul className="flex gap-6">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`transition ${
                      isActive
                        ? "text-amber-300 font-semibold"
                        : "hover:text-amber-200"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Тиждень 9: блок аутентифікації з badge ролі */}
          {session ? (
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-amber-700">
              <span className="text-amber-200 text-sm">
                {session.user.name}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                session.user.role === "admin"
                  ? "bg-red-500 text-white"
                  : "bg-amber-600 text-amber-100"
              }`}>
                {session.user.role}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-amber-700 hover:bg-amber-600 text-white text-sm px-3 py-1 rounded transition"
              >
                Вийти
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-4 pl-4 border-l border-amber-700 text-amber-200 hover:text-white text-sm transition"
            >
              Увійти
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
