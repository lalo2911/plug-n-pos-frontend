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
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import LoginSuccess from './pages/LoginSuccess';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import OwnerRoute from './components/OwnerRoute';
import Setup from './pages/setup/Setup';
import Profile from './pages/Profile';
import Home from './pages/home/Home';
import OrderSummary from './pages/order-summary/OrderSummary';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/admin/admin-dashboard/AdminDashboard';
import EmployeesManagement from './pages/admin/management/employees/EmployeesManagement';
import ProductsManagement from './pages/admin/management/products/ProductsManagement';
import CategoriesManagement from './pages/admin/management/categories/CategoriesManagement';
import OrdersManagement from './pages/admin/management/orders/OrdersManagement';
import AdminCharts from './pages/admin/admin-charts/AdminCharts';
import BusinessSettings from './pages/admin/business-settings/BusinessSettings';

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

      {/* Rutas para usuarios normales (empleados) */}
      <Route path="/" element={<ProtectedRoute><RootLayout /></ProtectedRoute>}>
        <Route index element={<Home />} />
        <Route path="order-summary" element={<OrderSummary />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Rutas para el panel de administración (owners) */}
      <Route path="/admin" element={<OwnerRoute><AdminLayout /></OwnerRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="employees" element={<EmployeesManagement />} />
        <Route path="products" element={<ProductsManagement />} />
        <Route path="categories" element={<CategoriesManagement />} />
        <Route path="orders" element={<OrdersManagement />} />
        <Route path="charts" element={<AdminCharts />} />
        <Route path="settings" element={<BusinessSettings />} />
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