import { getCookie } from "@/lib/cookies"
import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Toaster } from "@/components/ui/sonner"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

function AdminLayout() {
    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()

    const sidebarDefaultOpen = getCookie("sidebar_state") === "true"

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
        <SidebarProvider defaultOpen={sidebarDefaultOpen} className="select-none">
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 select-none">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1 cursor-pointer" />
                        <h1 className="text-xl font-semibold">Panel de Administración</h1>
                    </div>
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full cursor-pointer">
                                    <Avatar>
                                        <AvatarImage src={currentUser?.avatar || "/placeholder.svg"} alt={currentUser?.name} />
                                        <AvatarFallback className="bg-indigo-100 text-indigo-800">
                                            {getInitials(currentUser?.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 select-none">
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
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
                <Toaster />
            </SidebarInset>
        </SidebarProvider>
    )
}

export default AdminLayout