// Тиждень 12: тонка обгортка над OrderForm.
"use client";

import OrderForm from "@/components/OrderForm";

export default function NewOrderPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Нове замовлення</h1>
      <OrderForm />
    </div>
  );
}
