// Тиждень 12: Редагування замовлення (admin only — status + notes) на RHF + zod resolver
// Items залишаються read-only; повний CRUD позицій — у бонусних завданнях.

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";

import { updateOrderSchema } from "@/lib/validations/order";
import FormField from "@/components/forms/FormField";

const STATUSES = [
  { value: "pending", label: "Очікує" },
  { value: "preparing", label: "Готується" },
  { value: "ready", label: "Готово" },
  { value: "completed", label: "Виконано" },
  { value: "cancelled", label: "Скасовано" },
];

export default function EditOrderPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status: sessionStatus } = useSession();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updateOrderSchema),
    defaultValues: { status: "pending", notes: "" },
  });

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setLoadError(data.error);
          setLoading(false);
          return;
        }
        setOrder(data);
        // Заповнюємо форму справжніми значеннями з бази
        reset({ status: data.status, notes: data.notes || "" });
        setLoading(false);
      });
  }, [params.id, reset]);

  if (sessionStatus === "loading" || loading) {
    return <div className="text-gray-500">Завантаження...</div>;
  }

  if (session?.user?.role !== "admin") {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded">
        Редагувати замовлення може лише адміністратор.
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded">
        {loadError || "Замовлення не знайдено"}
      </div>
    );
  }

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`/api/orders/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.errors?.join(", ") || body.error || "Помилка збереження");
      }
      toast.success("Замовлення оновлено");
      router.push(`/dashboard/orders/${params.id}`);
      router.refresh();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const items = order.items || [];

  return (
    <div className="max-w-2xl">
      <div className="mb-4">
        <Link
          href={`/dashboard/orders/${params.id}`}
          className="text-amber-700 hover:underline text-sm"
        >
          &larr; До замовлення
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Редагування замовлення</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow space-y-5"
      >
        <div className="text-sm text-gray-600 border-b pb-3">
          <div>
            Користувач: <strong>{order.user?.name}</strong>
          </div>
          <div className="mt-2">Позиції (read-only):</div>
          <ul className="mt-1 ml-4 list-disc">
            {items.map((it) => (
              <li key={it._id}>
                {it.drink ? `${it.drink.emoji} ${it.drink.name}` : "(напій видалено)"}{" "}
                × {it.quantity} ({it.priceAtOrder} грн)
              </li>
            ))}
          </ul>
          <div className="mt-2">
            Сума: <strong>{order.totalPrice} грн</strong>
          </div>
        </div>

        <FormField label="Статус" required error={errors.status?.message}>
          <select
            {...register("status")}
            aria-invalid={errors.status ? "true" : "false"}
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-amber-500 ${
              errors.status ? "border-red-500" : "border-gray-300"
            }`}
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Коментар" error={errors.notes?.message}>
          <textarea
            rows="3"
            maxLength={300}
            {...register("notes")}
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-amber-500 ${
              errors.notes ? "border-red-500" : "border-gray-300"
            }`}
          />
        </FormField>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-amber-700 text-white px-6 py-3 rounded hover:bg-amber-800 font-bold disabled:opacity-50 transition"
          >
            {isSubmitting ? "Збереження..." : "Зберегти"}
          </button>
          <Link
            href={`/dashboard/orders/${params.id}`}
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-400 font-bold inline-block transition"
          >
            Скасувати
          </Link>
        </div>
      </form>
    </div>
  );
}
