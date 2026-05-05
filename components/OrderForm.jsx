// Тиждень 12: OrderForm на React Hook Form + useFieldArray + Zod resolver + sonner
// Динамічний items[] керує useFieldArray; live-сума через watch.

"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";

import { createOrderSchema } from "@/lib/validations/order";
import FormField from "@/components/forms/FormField";

export default function OrderForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const [drinks, setDrinks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingDrinks, setLoadingDrinks] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      user: "",
      items: [{ drink: "", quantity: 1 }],
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  // Завантажуємо список доступних напоїв (тільки available)
  useEffect(() => {
    fetch("/api/drinks")
      .then((res) => res.json())
      .then((data) => {
        const available = (data || []).filter((d) => d.available);
        setDrinks(available);
        setLoadingDrinks(false);
      })
      .catch(() => setLoadingDrinks(false));
  }, []);

  // Адміну — список користувачів (для вибору власника замовлення)
  useEffect(() => {
    if (!isAdmin) return;
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
      })
      .catch(() => {});
  }, [isAdmin]);

  // Default власника = сам admin (якщо не встановлено)
  useEffect(() => {
    if (isAdmin && session?.user?.id) {
      setValue("user", session.user.id);
    }
  }, [isAdmin, session?.user?.id, setValue]);

  // Live-сума через watch + useMemo
  const drinksById = useMemo(() => {
    const map = new Map();
    drinks.forEach((d) => map.set(d._id, d));
    return map;
  }, [drinks]);

  const watchedItems = watch("items");
  const totalPrice = useMemo(() => {
    return (watchedItems || []).reduce((sum, item) => {
      const drink = drinksById.get(item?.drink);
      if (!drink) return sum;
      return sum + drink.price * Number(item?.quantity || 0);
    }, 0);
  }, [watchedItems, drinksById]);

  const onSubmit = async (data) => {
    // Звичайний user не передає user (сервер бере з сесії)
    const payload = isAdmin && data.user ? data : { ...data, user: undefined };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.errors?.join(", ") || body.error || "Не вдалося створити замовлення");
      }
      toast.success("Замовлення створено");
      router.push(`/dashboard/orders/${body._id}`);
      router.refresh();
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (loadingDrinks) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-gray-500">
        Завантаження напоїв...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-6 rounded-lg shadow"
    >
      {isAdmin && (
        <FormField
          label="Замовник"
          required
          error={errors.user?.message}
          hint="Адміністратор може створити замовлення на будь-якого користувача."
        >
          <select
            {...register("user")}
            aria-invalid={errors.user ? "true" : "false"}
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-amber-500 ${
              errors.user ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Оберіть користувача</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email}){u.role === "admin" ? " — admin" : ""}
              </option>
            ))}
          </select>
        </FormField>
      )}

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-gray-700 font-bold">Позиції замовлення *</label>
          <button
            type="button"
            onClick={() => append({ drink: "", quantity: 1 })}
            className="text-amber-700 hover:underline text-sm font-medium"
          >
            + Додати позицію
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => {
            const itemErrors = errors.items?.[index];
            const drinkId = watchedItems?.[index]?.drink;
            const drink = drinksById.get(drinkId);
            const subtotal = drink
              ? drink.price * Number(watchedItems?.[index]?.quantity || 0)
              : 0;

            return (
              <div
                key={field.id}
                className="flex gap-3 items-start bg-gray-50 p-3 rounded border"
              >
                <div className="flex-1">
                  <select
                    {...register(`items.${index}.drink`)}
                    aria-invalid={itemErrors?.drink ? "true" : "false"}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-amber-500 ${
                      itemErrors?.drink ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Оберіть напій</option>
                    {drinks.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.emoji} {d.name} — {d.price} грн
                      </option>
                    ))}
                  </select>
                  {itemErrors?.drink && (
                    <p className="text-xs text-red-600 mt-1">
                      {itemErrors.drink.message}
                    </p>
                  )}
                </div>
                <div className="w-24">
                  <input
                    type="number"
                    min={1}
                    max={20}
                    {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    aria-invalid={itemErrors?.quantity ? "true" : "false"}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-amber-500 ${
                      itemErrors?.quantity ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {itemErrors?.quantity && (
                    <p className="text-xs text-red-600 mt-1">
                      {itemErrors.quantity.message}
                    </p>
                  )}
                </div>
                <div className="w-24 text-right pt-2 text-sm text-gray-700">
                  {subtotal ? `${subtotal} грн` : "—"}
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  className="text-red-600 hover:text-red-800 disabled:text-gray-300 text-lg px-2"
                  title="Видалити позицію"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        {errors.items?.message && (
          <p className="text-sm text-red-600 mt-2" role="alert">
            {errors.items.message}
          </p>
        )}
      </div>

      <FormField label="Коментар" error={errors.notes?.message}>
        <textarea
          rows="3"
          maxLength={300}
          {...register("notes")}
          placeholder="Напр.: без цукру, з молоком..."
          className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-amber-500 ${
            errors.notes ? "border-red-500" : "border-gray-300"
          }`}
        />
      </FormField>

      {totalPrice > 0 && (
        <div className="bg-amber-50 border border-amber-200 px-4 py-3 rounded">
          <p className="text-gray-700">
            <strong>До сплати:</strong>{" "}
            <span className="text-xl font-bold text-amber-700">{totalPrice} грн</span>
            <span className="text-sm text-gray-500 ml-2">
              ({fields.length} поз.)
            </span>
          </p>
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-amber-700 text-white px-6 py-3 rounded hover:bg-amber-800 font-bold disabled:opacity-50 transition"
        >
          {isSubmitting ? "Створення..." : "Створити замовлення"}
        </button>
        <Link
          href="/dashboard/orders"
          className="bg-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-400 font-bold inline-block transition"
        >
          Скасувати
        </Link>
      </div>
    </form>
  );
}
