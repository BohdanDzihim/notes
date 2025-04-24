import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RedirectIfNotAuth = ({ children }) => {
  const { isAuthenticated, authChecked } = useContext(AuthContext);

  if (!authChecked) return null;

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default RedirectIfNotAuth;