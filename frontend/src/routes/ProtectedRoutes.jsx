import { Navigate, Outlet, useLocation } from "react-router-dom";

// Guard minimal : considère l'utilisateur connecté si un token est présent
const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  return !!token && token.length > 0;
};

export default function ProtectedRoutes() {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Redirige vers /login et conserve la route d’origine
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
