import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const parseToken = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));

      return {
        email: decoded.sub,
        role: decoded.role || "USER",
      };
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const userData = parseToken(token);

      if (userData) {
        setUser(userData);
      } else {
        localStorage.removeItem("token");
      }
    }

    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);

    const userData = parseToken(token);

    if (userData) {
      setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);