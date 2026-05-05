// Тиждень 9: Кнопка зміни ролі користувача (Client Component)
// Тиждень 12: alert() замінено на toast.error/success

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RoleToggle({ userId, currentRole, currentUserId }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Не показуємо кнопку для поточного користувача
  if (userId === currentUserId) {
    return <span className="text-xs text-gray-400">(ви)</span>;
  }

  const newRole = currentRole === "admin" ? "user" : "admin";

  const handleToggle = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Помилка зміни ролі");
        return;
      }

      toast.success(`Роль змінено: ${newRole}`);
      // Оновлюємо сторінку для відображення нової ролі
      router.refresh();
    } catch {
      toast.error("Помилка з'єднання");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200
        text-gray-600 transition disabled:opacity-50 cursor-pointer"
    >
      {loading ? "..." : `→ ${newRole}`}
    </button>
  );
}
