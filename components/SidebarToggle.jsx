// Кнопка згортання/розгортання сайдбару — Client Component
// Тиждень 4: обробник події onClick

'use client'

export default function SidebarToggle({ isOpen, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="w-full text-center text-gray-400 hover:text-white transition mb-4 cursor-pointer"
      title={isOpen ? 'Згорнути меню' : 'Розгорнути меню'}
    >
      {isOpen ? '◀ Згорнути' : '▶ Меню'}
    </button>
  )
}
