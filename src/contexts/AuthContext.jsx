import { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthToken } from "@/api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        let token = localStorage.getItem("token");

        if (!token) {
          try {
            const res = await api.post(
              "/auth/refresh",
              {},
              { withCredentials: true }
            );
            token = res.data.accessToken;
            localStorage.setItem("token", token);
            setAuthToken(token);
          } catch (err) {
            console.warn(
              "[Auth] Refresh falhou (usuário provavelmente deslogado):",
              err.response?.status
            );
            setUser(null);
            setAuthToken(null);
            localStorage.removeItem("token");
            setLoading(false);
            return; 
          }
        } else {
          console.log("[Auth] Token encontrado no localStorage");
          setAuthToken(token);
        }

        const me = await api.get("/auth/me");
        setUser(me.data.user);
      } catch (err) {
        setUser(null);
        setAuthToken(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const logout = async () => {
    await api.post("/auth/logout");
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem("token");
    console.log("[Auth] Logout realizado");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
