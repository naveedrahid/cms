"use client"

import { useAuth } from "@/hooks/useAuth";
import { Bell, Search, Menu, User } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function DashboardHeader() {
    const [searchQuery, setSearchQuery] = useState('')
    const { user, logout } = useAuth()

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Left Section - Search */}
                <div className="flex-1 max-w-lg">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full"
                        />
                    </div>
                </div>
                {/* Right Section - Notifications & User */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                    </Button>
                    <div className="flex items-center space-x-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-gray-900">
                                {user?.name || 'User'}
                            </p>
                            <p className="text-xs text-gray-500">
                                {user?.role || 'Admin'}
                            </p>
                        </div>
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
