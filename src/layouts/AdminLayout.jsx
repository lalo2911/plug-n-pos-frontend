import { useEffect, useState } from "react"
import { getCookie } from "../lib/cookies"
import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
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
                                        <AvatarFallback>{getInitials(currentUser?.name)}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="select-none">
                                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate("/admin/profile")}>
                                    <User className="mr-2 h-4 w-4" />
                                    Perfil
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                                    <User className="mr-2 h-4 w-4" />
                                    Configuración
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onClick={logout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Cerrar sesión
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