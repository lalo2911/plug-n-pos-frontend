import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';

function RootLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet /> {/* Aquí se renderizarán las páginas hijas */}
            </main>
            <Footer />
        </div>
    );
}

export default RootLayout;