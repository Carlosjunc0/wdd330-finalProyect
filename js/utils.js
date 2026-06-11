/** Fetches data from a REST API endpoint with error handling */
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

/** Middleware function to protect routes that require authentication */
export const requireAuth = (callback) => {
    return (...args) => {

        const hasAccess = localStorage.getItem('luvia_temp_session');
        if (!hasAccess) {
            console.warn("Middleware: Access denied. Redirecting...");

            return null;
        }
        return callback(...args);
    };
};