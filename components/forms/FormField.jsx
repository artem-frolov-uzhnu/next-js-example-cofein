// Тиждень 12: Reusable обгортка для поля форми.
// Render-children pattern: інпут (input/select/textarea/custom) живе всередині як children.

"use client";

export default function FormField({ label, error, required, hint, children }) {
  return (
    <div>
      {label && (
        <label className="block text-gray-700 font-bold mb-2">
          {label}
          {required && " *"}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="text-xs text-gray-500 mt-1">{hint}</p>
      )}
      {error && (
        <p className="text-sm text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
