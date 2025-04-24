import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const user = Boolean(localStorage.getItem("username"));
    setIsAuthenticated(user);
    setAuthChecked(true);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, authChecked }}>
      {children}
    </AuthContext.Provider>
  );
};
