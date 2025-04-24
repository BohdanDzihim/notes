import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const WildcardRedirect = () => {
  const { isAuthenticated, authChecked } = useContext(AuthContext);

  if (!authChecked) return null;

  return isAuthenticated ? <Navigate to="/notes/" /> : <Navigate to="/" />;
};

export default WildcardRedirect;
