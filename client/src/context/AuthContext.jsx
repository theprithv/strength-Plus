import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    const savedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  const login = (userData, jwtToken, rememberMe = false) => {
    const safe = userData
      ? { id: userData.id, email: userData.email, name: userData.name }
      : null;
    
    setUser(safe);
    setToken(jwtToken);

    const storage = rememberMe ? localStorage : sessionStorage;

    if (safe) storage.setItem("user", JSON.stringify(safe));
    storage.setItem("token", jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};