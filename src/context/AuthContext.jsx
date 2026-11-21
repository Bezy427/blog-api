import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, logout as logoutRequest } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    // While a saved token is being checked, pages should wait instead of redirecting to /login.
    const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("token")));

    const clearSession = useCallback(() => {
        localStorage.removeItem("token");
        setUser(null);
    }, []);

    // Restore the session when the page loads.
    useEffect(() => {
        if (!localStorage.getItem("token")) return;

        let cancelled = false;
        getCurrentUser()
            .then((currentUser) => {
                if (!cancelled) setUser(currentUser);
            })
            .catch((error) => {
                // Only a rejected login ends the session. A server that is down does not.
                if (!cancelled && error.status === 401) clearSession();
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [clearSession]);

    // api.js fires this when the refresh token no longer works.
    useEffect(() => {
        window.addEventListener("auth:expired", clearSession);
        return () => window.removeEventListener("auth:expired", clearSession);
    }, [clearSession]);

    const login = useCallback(async (accessToken) => {
        localStorage.setItem("token", accessToken);
        setUser(await getCurrentUser());
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutRequest(); // clears the refresh cookie
        } catch {
            // Logging out locally is enough if the server cannot be reached.
        }
        clearSession();
    }, [clearSession]);

    const value = useMemo(
        () => ({ user, isAuthenticated: Boolean(user), loading, login, logout }),
        [user, loading, login, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
    return context;
}
