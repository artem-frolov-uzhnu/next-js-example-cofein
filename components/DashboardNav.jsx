// Компонент DashboardNav — навігація для адміністративної панелі
// Тиждень 3: демонструє usePathname для активних лінків
// Тиждень 9: додано умовний пункт "Користувачі" для admin

'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function DashboardNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const links = [
    { href: "/dashboard", label: "Огляд" },
    { href: "/dashboard/drinks", label: "Напої" },
    // Тиждень 11: замовлення бачать усі авторизовані (admin = усі, user = свої)
    { href: "/dashboard/orders", label: "Замовлення" },
    // Пункт "Користувачі" тільки для admin
    ...(isAdmin ? [{ href: "/dashboard/users", label: "Користувачі" }] : []),
  ];

  return (
    <nav>
      <ul className="space-y-2">
        {links.map((link) => {
          const isActive =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block px-4 py-2 rounded transition-colors ${
                  isActive
                    ? "bg-amber-700 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
