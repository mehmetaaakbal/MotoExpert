"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Plus, History, BookOpen, CheckSquare, Calculator, MapPin, Bike, Settings } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "New Inspection", href: "/dashboard/inspect", icon: Plus },
  { name: "History", href: "/dashboard/history", icon: History },
  { name: "Inspection Details", href: "/dashboard/inspection", icon: Bike, hidden: true },
  { name: "Buyer's Checklist", href: "/dashboard/checklist", icon: CheckSquare },
  { name: "Value Estimator", href: "/dashboard/estimator", icon: Calculator },
  { name: "Service Directory", href: "/dashboard/directory", icon: MapPin },
  { name: "Expert Resources", href: "/dashboard/resources", icon: BookOpen },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-sidebar-border glass-strong carbon-fiber bg-card/50 backdrop-blur-sm">
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <nav className="flex flex-col gap-1 p-4">
          {navigation
            .filter((item) => !item.hidden)
            .map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {item.name}
                </Link>
              )
            })}
        </nav>
      </div>
    </aside>
  )
}
