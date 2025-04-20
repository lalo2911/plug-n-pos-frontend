import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Importar páginas
import RootLayout from './layouts/RootLayout';
import Login from './pages/Login';
import LoginSuccess from './pages/LoginSuccess';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Setup from './pages/Setup';
import Profile from './pages/Profile';
import Home from './pages/home/Home';
import OrderSummary from './pages/order-summary/OrderSummary';
import Categories from './pages/Categories';
import NotFound from './pages/NotFound';

// Configurar React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login/success" element={<LoginSuccess />} />
      <Route path="/setup" element={<ProtectedRoute><Setup /></ProtectedRoute>} />

      <Route path="/" element={<ProtectedRoute><RootLayout /></ProtectedRoute>}>
        <Route index element={<Home />} />
        <Route path="order-summary" element={<OrderSummary />} />
        <Route path="categories" element={<Categories />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;