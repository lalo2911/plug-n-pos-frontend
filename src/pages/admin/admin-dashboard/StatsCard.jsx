import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function StatsCard({ title, value, subtitle, icon: Icon }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 mt-4">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent className="mb-4">
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-gray-500">{subtitle}</p>
            </CardContent>
        </Card>
    );
}
