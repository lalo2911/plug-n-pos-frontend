import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle, Settings, LogOut } from "lucide-react";

function Navigation() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    return (
        <div className="fixed top-4 right-4 z-50">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                        <Avatar className="h-12 w-12 border-2 border-white hover:shadow-md transition-shadow">
                            {currentUser?.avatar ? (
                                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                            ) : (
                                <AvatarFallback className="bg-indigo-100 text-indigo-800">
                                    {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                                </AvatarFallback>
                            )}
                        </Avatar>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center p-3 gap-3">
                        {/* <Avatar className="h-10 w-10">
                            {currentUser?.avatar ? (
                                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                            ) : (
                                <AvatarFallback className="bg-indigo-100 text-indigo-800">
                                    {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                                </AvatarFallback>
                            )}
                        </Avatar> */}
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
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Cerrar sesión</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export default Navigation;