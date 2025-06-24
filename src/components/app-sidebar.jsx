import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useBusiness } from '@/hooks/useBusiness';
import { Store, Package, ListOrdered, Users, Settings, LogOut, LayoutDashboard, ChartNoAxesCombined, LucideTag, ChevronsUpDown } from "lucide-react"
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
    useSidebar
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AppSidebar() {
    const { currentUser, logout } = useAuth()
    const { userBusiness } = useBusiness();
    const { isMobile, toggleSidebar } = useSidebar();
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
        { icon: ChartNoAxesCombined, label: "Gráficas", path: "/admin/charts" },
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

    const handleProfileClick = () => {
        navigate('/admin/profile');
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <div className="flex items-center">
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
                <SidebarMenu>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <SidebarMenuItem key={item.path}>
                                <SidebarMenuButton asChild tooltip={item.label} isActive={isActive}>
                                    <NavLink
                                        to={item.path}
                                        onClick={() => {
                                            if (isMobile) toggleSidebar()
                                        }}
                                    >
                                        <item.icon />
                                        <span>{item.label}</span>
                                    </NavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                                    tooltip={currentUser?.name || "Usuario"}
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={currentUser?.avatar || "/placeholder.svg"} alt={currentUser?.name} />
                                        <AvatarFallback className="bg-indigo-100 text-indigo-800">
                                            {getInitials(currentUser?.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight ml-3">
                                        <span className="truncate font-semibold">{currentUser?.name}</span>
                                        <span className="truncate text-xs text-muted-foreground">Owner</span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56"
                                side={isMobile ? "bottom" : "right"}
                                align="end"
                                sideOffset={4}
                            >
                                <div className="flex items-center p-3 gap-3">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium">
                                            {currentUser?.name || 'Usuario'}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {currentUser?.email || ''}
                                        </p>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Configurar perfil</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Cerrar sesión</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}