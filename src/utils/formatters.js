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