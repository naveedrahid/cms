"use client"

import { cn } from "@/lib/utils"
import {
    Icon,
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    BarChart3

} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Content', href: '/dashboard/content', icon: FileText },
    { name: 'Users', href: '/dashboard/users', icon: Users },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardSidebar() {
    const pathname = usePathname()

    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="flex items-center justify-center h-16 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-800">CMS Admin</h1>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {
                    navigation.map((item) => {
                        const icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                    isActive
                                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                {/* <Icon className="w-5 h-5 mr-3" /> */}
                                {item.name}
                            </Link>
                        )
                    })
                }
            </nav>
            {/* User Profile Section */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            Admin User
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                            admin@example.com
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
