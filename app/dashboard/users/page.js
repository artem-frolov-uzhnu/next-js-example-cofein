// Тиждень 9: Сторінка управління користувачами (admin only)
// Server Component — можемо використовувати getServerSession та await
// Додано кнопку зміни ролі через RoleToggle

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import RoleToggle from "@/components/RoleToggle";

export const metadata = {
  title: "Користувачі | Dashboard",
};

export default async function UsersPage() {
  // Перевірка авторизації
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  // Отримуємо користувачів
  await dbConnect();
  const users = await User.find()
    .select("-password")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Управління користувачами
      </h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ім&rsquo;я
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Роль
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Дата реєстрації
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Дії
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id.toString()}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString("uk-UA")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <RoleToggle
                    userId={user._id.toString()}
                    currentRole={user.role}
                    currentUserId={session.user.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Всього користувачів: {users.length}
      </p>
    </div>
  );
}
