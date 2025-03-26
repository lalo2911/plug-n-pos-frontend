import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">404 - Página No Encontrada</h1>
            <Link
                to="/"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Volver al Inicio
            </Link>
        </div>
    );
}

export default NotFound;