import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Store,
    Package,
    ListOrdered,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    BarChart3,
    LucideTag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Toaster } from "@/components/ui/sonner"

function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { icon: BarChart3, label: 'Dashboard', path: '/admin' },
        { icon: Package, label: 'Productos', path: '/admin/products' },
        { icon: LucideTag, label: 'Categorías', path: '/admin/categories' },
        { icon: ListOrdered, label: 'Pedidos', path: '/admin/orders' },
        { icon: Users, label: 'Empleados', path: '/admin/employees' },
        { icon: Settings, label: 'Configuración', path: '/admin/settings' },
    ];

    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar for mobile */}
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={toggleSidebar} />

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-all duration-300 lg:translate-x-0 lg:static lg:h-screen flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between h-16 px-4 border-b">
                    <span className="text-xl font-semibold flex items-center">
                        <Store className="mr-2" />
                        Mi Negocio
                    </span>
                    <button
                        className="p-1 rounded-full hover:bg-gray-100 lg:hidden"
                        onClick={toggleSidebar}
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="px-2 space-y-1">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`
                                }
                                onClick={() => setSidebarOpen(false)}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
                <div className="border-t border-gray-200 p-4">
                    <div className="flex items-center">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                            <AvatarFallback>{getInitials(currentUser?.name)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                            <p className="text-sm font-medium">{currentUser?.name}</p>
                            <p className="text-xs text-gray-500">Owner</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full mt-4 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={logout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar sesión
                    </Button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top navbar */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4">
                    <button
                        className="p-1 mr-4 rounded-full hover:bg-gray-100 lg:hidden"
                        onClick={toggleSidebar}
                    >
                        <Menu size={20} />
                    </button>
                    <h1 className="text-xl font-semibold flex-1">Panel de Administración</h1>
                    <div className="hidden md:block">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar>
                                        <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                                        <AvatarFallback>{getInitials(currentUser?.name)}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
                                    Perfil
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                                    Configuración
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500" onClick={logout}>
                                    Cerrar sesión
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto bg-gray-50 px-4 py-6">
                    <Outlet />
                </main>
                <Toaster />
            </div>
        </div>
    );
}

export default AdminLayout;