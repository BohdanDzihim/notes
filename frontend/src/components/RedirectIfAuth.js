import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RedirectIfAuth = ({ children }) => {
  const { isAuthenticated, authChecked } = useContext(AuthContext);

  if (!authChecked) return null;

  return isAuthenticated ? <Navigate to="/notes/" /> : children;
};

export default RedirectIfAuth;