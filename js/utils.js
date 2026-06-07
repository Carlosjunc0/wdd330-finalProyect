// js/utils.js
/**
 * Realiza una petición fetch asíncrona genérica con manejo de errores.
 * Demuestra el uso de async/await y bloques try/catch.
 */
export async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fetch implementation failed:", error);
        return null;
    }
}

/**
 * Middleware de Frontend (Route Guard):
 * Utiliza un closure para verificar permisos antes de montar un módulo.
 * Útil para rsvp.html o la creación de invitaciones si no hay una sesión o ID temporal guardado.
 */
export const requireAuth = (callback) => {
    return (...args) => {
        // Lógica simulada: Verificar localStorage
        const hasAccess = localStorage.getItem('luvia_temp_session');
        if (!hasAccess) {
            console.warn("Middleware: Access denied. Redirecting...");
            // window.location.href = '/index.html'; // Descomentar en producción
            return null;
        }
        return callback(...args);
    };
};