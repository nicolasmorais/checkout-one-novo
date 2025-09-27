
"use client";

const AUTH_TOKEN_KEY = "firebase-studio-auth-token";
// This is a simple, hardcoded password for demonstration purposes.
// In a real-world application, this should be handled securely on the backend.
const ADMIN_PASSWORD = "admin"; 

/**
 * Checks if the user is authenticated by looking for a token in sessionStorage.
 * This function should only be called on the client side.
 * @returns {boolean} True if authenticated, false otherwise.
 */
export function isAuthenticated(): boolean {
    if (typeof window === "undefined") {
        // Cannot determine auth state on the server.
        // The component logic should handle this, e.g., by showing a loading state.
        return false;
    }
    return window.sessionStorage.getItem(AUTH_TOKEN_KEY) === "true";
}

/**
 * Attempts to log the user in with the provided password.
 * @param {string} password The password entered by the user.
 * @returns {boolean} True on successful login, false otherwise.
 */
export function login(password: string): boolean {
    if (typeof window === "undefined") {
        return false;
    }

    if (password === ADMIN_PASSWORD) {
        window.sessionStorage.setItem(AUTH_TOKEN_KEY, "true");
        return true;
    }

    return false;
}

/**
 * Logs the user out by removing the authentication token from sessionStorage.
 */
export function logout(): void {
    if (typeof window === "undefined") {
        return;
    }
    window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
}
