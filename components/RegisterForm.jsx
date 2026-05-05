// Тиждень 12: RegisterForm на React Hook Form + Zod resolver + sonner
// Перевірка confirmPassword робиться через .refine() у самій схемі.
// Серверна помилка (email вже існує) мапиться через setError на поле email.

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

import { registerFormSchema } from "@/lib/validations/auth";
import FormField from "@/components/forms/FormField";

export default function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    try {
      // confirmPassword не передається на сервер
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });
      const body = await res.json().catch(() => ({}));

      if (res.status === 409) {
        // email вже зайнятий — мапимо помилку на поле email
        setError("email", {
          type: "server",
          message: body.error || "Користувач з таким email вже існує",
        });
        toast.error("Email вже зайнятий");
        return;
      }
      if (!res.ok) {
        toast.error(body.error || body.errors?.join(", ") || "Помилка реєстрації");
        return;
      }

      // Автоматичний вхід після реєстрації
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.warning("Реєстрація успішна, але не вдалося увійти автоматично");
        router.push("/login");
        return;
      }

      toast.success("Реєстрація успішна!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Помилка при реєстрації. Спробуйте ще раз.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Реєстрація</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Ім'я" error={errors.name?.message}>
            <input
              type="text"
              autoComplete="name"
              {...register("name")}
              aria-invalid={errors.name ? "true" : "false"}
              placeholder="Ваше ім'я"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
          </FormField>

          <FormField label="Email" error={errors.email?.message}>
            <input
              type="email"
              autoComplete="email"
              {...register("email")}
              aria-invalid={errors.email ? "true" : "false"}
              placeholder="your@email.com"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
          </FormField>

          <FormField label="Пароль" error={errors.password?.message}>
            <input
              type="password"
              autoComplete="new-password"
              {...register("password")}
              aria-invalid={errors.password ? "true" : "false"}
              placeholder="Мінімум 6 символів"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
          </FormField>

          <FormField label="Підтвердження пароля" error={errors.confirmPassword?.message}>
            <input
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword")}
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              placeholder="Повторіть пароль"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
          </FormField>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-700 text-white py-2 px-4 rounded-md hover:bg-amber-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Реєстрація..." : "Зареєструватися"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Вже маєте акаунт?{" "}
          <Link href="/login" className="text-amber-700 hover:underline font-medium">
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
}
