"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Wine, 
  ShoppingCart, 
  Users, 
  Package, 
  CreditCard, 
  Store, 
  Calendar, 
  BarChart2, 
  Settings, 
  Menu, 
  X 
} from 'lucide-react'
import { cn } from '../../utils/cn'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    {
      title: "Prehľad",
      href: "/admin",
      icon: BarChart2
    },
    {
      title: "Produkty",
      href: "/admin/produkty",
      icon: Wine
    },
    {
      title: "Objednávky",
      href: "/admin/objednavky",
      icon: ShoppingCart
    },
    {
      title: "Zákazníci",
      href: "/admin/zakaznici",
      icon: Users
    },
    {
      title: "Zásielky",
      href: "/admin/zasielky",
      icon: Package
    },
    {
      title: "Platby",
      href: "/admin/platby",
      icon: CreditCard
    },
    {
      title: "Sklad",
      href: "/admin/sklad",
      icon: Store
    },
    {
      title: "Degustácie",
      href: "/admin/degustacie",
      icon: Calendar
    },
    {
      title: "Nastavenia",
      href: "/admin/nastavenia",
      icon: Settings
    }
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 z-20 p-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-700 focus:outline-none"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-10 w-64 bg-amber-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-amber-700">
          <h1 className="text-xl font-bold">Vinárstvo Admin</h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="px-4 py-6">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm rounded-lg transition-colors",
                    pathname === item.href 
                      ? "bg-amber-700 text-white" 
                      : "text-amber-100 hover:bg-amber-700"
                  )}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        "lg:ml-64" // Always pushed on large screens
      )}>
        <header className="bg-white shadow h-16 flex items-center px-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {navItems.find(item => item.href === pathname)?.title || "Admin Panel"}
          </h2>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
