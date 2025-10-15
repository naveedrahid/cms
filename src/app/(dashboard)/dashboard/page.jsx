import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
    const stats = [
        { title: 'Total Users', value: '1,234', color: 'bg-blue-500' },
        { title: 'Total Posts', value: '567', color: 'bg-green-500' },
        { title: 'Page Views', value: '89K', color: 'bg-purple-500' },
    ]

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome to your CMS dashboard</p>
                </div>
                <Button className="flex items-center space-x-2">
                    {/* <Plus className="w-4 h-4" /> */}
                    <span>Create New</span>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats && stats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-full ${stat.color}`}>
                                    {/* Icon temporarily removed */}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}