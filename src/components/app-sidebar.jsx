import { NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useBusiness } from '../hooks/useBusiness';
import { Store, Package, ListOrdered, Users, Settings, LogOut, BarChart3, LucideTag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from '@/components/ui/skeleton';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar() {
    const { currentUser, logout } = useAuth()

    const { userBusiness } = useBusiness();

    const menuItems = [
        { icon: BarChart3, label: "Dashboard", path: "/admin" },
        { icon: LucideTag, label: "Categorías", path: "/admin/categories" },
        { icon: Package, label: "Productos", path: "/admin/products" },
        { icon: ListOrdered, label: "Pedidos", path: "/admin/orders" },
        { icon: Users, label: "Empleados", path: "/admin/employees" },
        { icon: Settings, label: "Configuración", path: "/admin/settings" },
    ]

    const getInitials = (name) => {
        if (!name) return "U"
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <div className="flex items-center select-none">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Store className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none ml-2">
                                    {userBusiness ? (
                                        <span className="font-semibold text-xl">{userBusiness.name}</span>
                                    ) : (
                                        <Skeleton className="h-6 w-32" />
                                    )}
                                </div>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu className="select-none">
                    {menuItems.map((item) => (
                        <SidebarMenuItem key={item.path}>
                            <SidebarMenuButton asChild>
                                <NavLink to={item.path} className={({ isActive }) => (isActive ? "data-[active=true]" : "")}>
                                    <item.icon className="size-4" />
                                    <span>{item.label}</span>
                                </NavLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <div className="p-2 select-none">
                    <div className="flex items-center p-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={currentUser?.avatar || "/placeholder.svg"} alt={currentUser?.name} />
                            <AvatarFallback>{getInitials(currentUser?.name)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                            <p className="text-sm font-medium">{currentUser?.name}</p>
                            <p className="text-xs text-muted-foreground">Owner</p>
                        </div>
                    </div>
                    {/* <Button variant="outline" className="w-full mt-2 text-destructive hover:bg-destructive/10" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar sesión
                    </Button> */}
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
