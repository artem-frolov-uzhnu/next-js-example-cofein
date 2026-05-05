// Тиждень 12: LoginForm на React Hook Form + Zod resolver + sonner

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

import { loginSchema } from "@/lib/validations/auth";
import FormField from "@/components/forms/FormField";

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        // Загальна помилка — мапимо її на password (типова UX-практика)
        setError("password", {
          type: "server",
          message: "Невірний email або пароль",
        });
        toast.error("Не вдалося увійти");
        return;
      }

      toast.success("Вітаємо у Кофеїні!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Помилка при вході. Спробуйте ще раз.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Вхід</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              autoComplete="current-password"
              {...register("password")}
              aria-invalid={errors.password ? "true" : "false"}
              placeholder="Мінімум 6 символів"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
          </FormField>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-700 text-white py-2 px-4 rounded-md hover:bg-amber-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Вхід..." : "Увійти"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Немає акаунту?{" "}
          <Link href="/register" className="text-amber-700 hover:underline font-medium">
            Зареєструватися
          </Link>
        </p>
      </div>
    </div>
  );
}
