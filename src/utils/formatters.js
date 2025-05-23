/**
 * Formatea un valor numérico como moneda en pesos mexicanos
 * @param {number} amount - Cantidad a formatear
 * @returns {string} - Cantidad formateada como moneda
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2
    }).format(amount);
};

/**
 * Formatea una fecha ISO a formato local (DD/MM)
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} - Fecha formateada
 */
export const formatShortDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        timeZone: 'America/Mexico_City'
    });
};

/**
 * Formatea una fecha ISO a formato largo con día, número y mes en español
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} - Fecha formateada como "Lunes 28 de Julio"
 */
export const formatLongDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        timeZone: 'America/Mexico_City'
    }).replace(/^\w/, c => c.toUpperCase()); // Capitaliza el primer carácter
};

/**
 * Formatea una hora a formato de 24 horas
 * @param {number} hour - Hora (0-23)
 * @returns {string} - Hora formateada (HH:00)
 */
export const formatHour = (hour) => {
    return `${hour}:00`;
};

export const formatPrice = (price) => {
    if (!price) return '$0.00';
    const numericValue = price.$numberDecimal ? parseFloat(price.$numberDecimal) : parseFloat(price);
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(numericValue);
};

export const formatOrderDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

export const getShortId = (id) => id ? `#${id.substring(0, 8)}` : 'N/A';

// Función para obtener las iniciales de un nombre
export const getInitials = (name) => {
    if (!name) return 'U';
    return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

// Determinar el tipo de cuenta (local o Google)
export const getAccountType = (employee) => {
    if (employee?.googleId) {
        return 'Google';
    }
    return 'Local';
};

// Formatear fecha de registro
export const formatRegisterDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(date);
};