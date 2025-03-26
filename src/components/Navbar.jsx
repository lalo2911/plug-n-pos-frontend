import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

function Navbar() {
    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">Mi Aplicación</Link>
                <div className="space-x-4">
                    <Link to="/">Inicio</Link>
                    <Link to="/categories">Categorías</Link>
                    <Link to="/login">
                        <Button>Iniciar Sesión</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;