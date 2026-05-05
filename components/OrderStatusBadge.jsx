// Тиждень 11: Компонент-бейдж статусу замовлення

const STATUS_CONFIG = {
  pending:    { label: "Очікує",    classes: "bg-yellow-100 text-yellow-800" },
  preparing:  { label: "Готується", classes: "bg-blue-100 text-blue-800" },
  ready:      { label: "Готово",    classes: "bg-emerald-100 text-emerald-800" },
  completed:  { label: "Виконано",  classes: "bg-gray-200 text-gray-700" },
  cancelled:  { label: "Скасовано", classes: "bg-red-100 text-red-700" },
};

export default function OrderStatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || {
    label: status,
    classes: "bg-gray-100 text-gray-700",
  };
  return (
    <span className={`inline-block text-xs font-semibold px-2 py-1 rounded ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}
