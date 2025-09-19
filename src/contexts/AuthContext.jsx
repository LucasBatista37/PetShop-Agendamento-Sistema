import { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthToken } from "@/api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
      api
        .get("/auth/me")
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(async () => {
          try {
            const res = await api.post(
              "/auth/refresh",
              {},
              { withCredentials: true }
            );
            const newToken = res.data.accessToken;

            localStorage.setItem("token", newToken);
            setAuthToken(newToken);

            const me = await api.get("/auth/me");
            setUser(me.data.user);
          } catch {
            setUser(null);
            setAuthToken(null);
            localStorage.removeItem("token");
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    await api.post("/auth/logout");
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
