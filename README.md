# 🖥️ Plug n POS - Frontend

> **Interfaz de usuario moderna y responsiva para el sistema de punto de venta**

Una aplicación React elegante y funcional que proporciona una experiencia de usuario fluida para propietarios y empleados de pequeños negocios. Diseñada para ser intuitiva, rápida y completamente responsiva.

## ✨ Características Principales

- 🎨 **UI Moderna**: Componentes elegantes con Shadcn/UI y Tailwind CSS
- 📱 **Totalmente Responsiva**: Optimizada para desktop, tablet y móvil
- 🔐 **Autenticación Completa**: Login tradicional y Google OAuth integrado
- 👥 **Roles Diferenciados**: Interfaces específicas para Owner y Employee
- ⚡ **Rendimiento Optimizado**: React Query para gestión de estado del servidor
- 🛒 **Sistema de Ventas**: Carrito intuitivo con cálculo automático de cambio
- 📊 **Dashboard Analítico**: Gráficos y métricas para propietarios
- 🔄 **Tiempo Real**: Sincronización automática con el backend
- 📝 **Formularios Avanzados**: Validación robusta con React Hook Form + Zod

## 🚀 Tecnologías

- **Frontend**: React 19 + Javascript
- **Build Tool**: Vite
- **Estilos**: Tailwind CSS 4.0
- **Componentes**: Shadcn/UI + Radix UI
- **Routing**: React Router DOM v7
- **Estado**: TanStack Query (React Query)
- **Formularios**: React Hook Form + Zod
- **Gráficos**: Recharts
- **Iconos**: Lucide React
- **HTTP Client**: Axios
- **Notificaciones**: Sonner

## 🎯 Funcionalidades por Rol

### 👨‍💼 Owner (Propietario)
- **Dashboard**: Métricas, gráficos y KPIs del negocio
- **Gestión de Productos**: CRUD completo de productos y categorías
- **Control de Empleados**: Administración de personal y jornadas laborales
- **Códigos de Invitación**: Generación de códigos para vincular empleados
- **Historial de Ventas**: Visualización detallada de todas las órdenes
- **Configuración del Negocio**: Personalización de datos empresariales

### 👨‍💻 Employee (Empleado)
- **Punto de Venta**: Interfaz optimizada para procesar ventas rápidamente
- **Catálogo de Productos**: Navegación por categorías y productos disponibles
- **Carrito Inteligente**: Gestión de órdenes con cálculos automáticos
- **Procesamiento de Pagos**: Cálculo de cambio y finalización de ventas
- **Perfil Personal**: Gestión de información del empleado

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- Backend de Plug n POS ejecutándose
- Navegador web moderno

## ⚙️ Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/lalo2911/plug-n-pos-frontend.git
   cd plug-n-pos-frontend
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   VITE_API_URL=http://localhost:3000/api/v1
   ```

4. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Construye para producción**
   ```bash
   npm run build
   npm run preview
   ```

## 🗺️ Estructura de Rutas

### Autenticación
- `/login` - Inicio de sesión
- `/register` - Registro de usuario
- `/login/success` - Callback de Google OAuth
- `/setup` - Configuración inicial (rol y negocio)

### Empleados
- `/` - Punto de venta principal
- `/order-summary` - Resumen de la orden actual
- `/profile` - Perfil del empleado

### Propietarios
- `/admin` - Dashboard principal
- `/admin/dashboard` - Métricas y analytics
- `/admin/employees` - Gestión de empleados
- `/admin/products` - Administración de productos
- `/admin/categories` - Gestión de categorías
- `/admin/orders` - Historial de órdenes
- `/admin/charts` - Gráficos y reportes
- `/admin/settings` - Configuración del negocio

## 🏗️ Estructura del Proyecto

```
src/
├── components/        # Componentes reutilizables
│   ├── ui/            # Componentes base de Shadcn/UI
├── pages/             # Páginas/Vistas principales
│   ├── auth/          # Páginas de autenticación
│   ├── home/          # Vistas del empleado
│   └── admin/         # Panel de administración
├── hooks/             # Custom hooks
├── services/          # Servicios y API calls
├── utils/             # Utilidades y helpers
└── lib/               # Configuraciones y constantes
```

## 🎨 Sistema de Diseño

### Componentes UI
- **Formularios**: Inputs, selects, y validaciónes
- **Navegación**: Menús responsivos
- **Feedback**: Toasts, alertas y estados de carga
- **Visualización**: Cards, tablas y gráficos interactivos

### Responsive Design
- **Mobile First**: Optimizado para dispositivos móviles
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Layout Adaptativo**: Sidebar colapsable y navegación móvil

## ⚡ Rendimiento

- **Code Splitting**: Carga lazy de rutas
- **Optimización de Imágenes**: Compresión automática
- **Bundle Size**: Optimizado con Vite
- **Caching**: React Query para caché inteligente
- **Tree Shaking**: Eliminación de código no utilizado

## 🔒 Seguridad

- **Rutas Protegidas**: Guards para autenticación y autorización
- **Validación de Formularios**: Esquemas Zod para validación robusta

## 🚀 Flujo de Usuario

### Setup Inicial
1. **Registro/Login**: Autenticación con email o Google
2. **Selección de Rol**: Owner o Employee
3. **Configuración**:
   - **Owner**: Crear información del negocio
   - **Employee**: Ingresar código de invitación

### Flujo de Venta (Employee)
1. **Selección de Productos**: Navegación por categorías
2. **Carrito de Compras**: Añadir/remover productos
3. **Cálculo Total**: Suma automática y aplicación de descuentos
4. **Procesamiento de Pago**: Ingreso de efectivo recibido
5. **Cálculo de Cambio**: Automático con confirmación
6. **Finalización**: Registro de venta en el sistema

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting con ESLint
```

## 👨‍💻 Desarrollador

**Luis Eduardo Torres Gutiérrez** - [GitHub](https://github.com/lalo2911) | [LinkedIn](https://linkedin.com/in/ltorresdev)

---

## 🔗 Repositorios Relacionados

- [Plug n POS Backend](https://github.com/lalo2911/plug-n-pos-backend) - API REST con Node.js y MongoDB

## 🌐 Demo en Vivo

> 🚧 **Próximamente**: Demo disponible en línea