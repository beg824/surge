"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Users, Video, TrendingUp } from "lucide-react"

const navItems = [
  { href: "/dashboard/overview", label: "Overview", icon: BarChart3 },
  { href: "/dashboard/accounts", label: "Accounts", icon: Users },
  { href: "/dashboard/posts", label: "Posts", icon: Video },
  { href: "/dashboard/campaigns", label: "Campaigns", icon: TrendingUp },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-black backdrop-blur supports-[backdrop-filter]:bg-black">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center">
          <Link href="/dashboard/overview" className="flex items-center mr-12">
            <Image
              src="/surge.png"
              alt="Surge"
              width={200}
              height={80}
              className="h-12 w-auto max-h-full object-contain"
              style={{ backgroundColor: 'transparent' }}
              priority
            />
          </Link>
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith(item.href)
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-white text-black"
                      : "text-gray-400 hover:bg-gray-900 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

