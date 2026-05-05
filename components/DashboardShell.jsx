// Обгортка dashboard з toggle-сайдбаром — Client Component
// Тиждень 4: useState для стану сайдбару, композиція з children

'use client'

import { useState } from 'react'
import DashboardNav from './DashboardNav'
import SidebarToggle from './SidebarToggle'

export default function DashboardShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-[calc(100vh-130px)]">
      <aside className={`bg-gray-800 text-white transition-all ${sidebarOpen ? 'w-64 p-6' : 'w-16 p-2'}`}>
        <SidebarToggle
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        {sidebarOpen && (
          <>
            <h2 className="text-xl font-bold mb-6">Dashboard</h2>
            <DashboardNav />
          </>
        )}
      </aside>
      <div className="flex-1 bg-gray-100 p-8">
        {children}
      </div>
    </div>
  )
}
