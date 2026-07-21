import { createContext, useContext, useEffect, useState } from "react";
import {
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  decodeToken,
  isTokenExpired,
} from "../utils/auth.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    accessToken: null,
    refreshToken: null,
    user: null,
  });

  const [loading, setLoading] = useState(true);

  /**
   * Initialize authentication on page refresh
   */
  useEffect(() => {
    initializeAuth();

    window.addEventListener("storage", initializeAuth);

    return () => {
      window.removeEventListener("storage", initializeAuth);
    };
  }, []);

  const normalizeRole = (r) => {
    if (!r) return "USER";
    if (Array.isArray(r)) r = r[0];
    if (typeof r === "object" && r?.authority) r = r.authority;
    return String(r).replace(/^ROLE_/, "").toUpperCase();
  };

  const initializeAuth = () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (!accessToken) {
      setLoading(false);
      return;
    }

    if (isTokenExpired(accessToken)) {
      logout();
      return;
    }

    const payload = decodeToken(accessToken);

    if (!payload) {
      logout();
      return;
    }

    const rawRole = payload.role || payload.roles || payload.authorities;

    setAuth({
      accessToken,
      refreshToken,
      user: {
        email: payload.sub || payload.email,
        name: payload.name,
        role: normalizeRole(rawRole),
      },
    });

    setLoading(false);
  };

  /**
   * Login after successful authentication
   * Pass complete backend response
   */
  const login = (response) => {
    saveAccessToken(response.accessToken);
    saveRefreshToken(response.refreshToken);

    const rawRole = response.role || response.roles || response.authorities;

    setAuth({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      user: {
        email: response.email,
        name: response.name,
        role: normalizeRole(rawRole),
        emailVerified: response.emailVerified,
      },
    });
  };

  /**
   * Logout
   */
  const logout = () => {
    removeAccessToken();
    removeRefreshToken();

    setAuth({
      accessToken: null,
      refreshToken: null,
      user: null,
    });
  };

  /**
   * Update access token after refresh endpoint
   */
  const updateAccessToken = (newAccessToken) => {
    saveAccessToken(newAccessToken);

    const payload = decodeToken(newAccessToken);
    const rawRole = payload?.role || payload?.roles || payload?.authorities;

    setAuth((prev) => ({
      ...prev,
      accessToken: newAccessToken,
      user: {
        ...prev.user,
        email: payload?.sub || payload?.email,
        role: normalizeRole(rawRole),
      },
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        user: auth.user,
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
        loading,

        login,
        logout,
        updateAccessToken,

        isAuthenticated: !!auth.accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);