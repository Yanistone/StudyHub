import { Navigate, Outlet, useLocation } from "react-router-dom";
import { me } from "../api/auth";
import { useEffect, useState } from "react";

// Guard minimal : considère l'utilisateur connecté si un token est présent
const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  return !!token && token.length > 0;
};

export default function ProtectedRoutes() {
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!isAuthenticated()) {
        setLoading(false);
        return;
      }

      try {
        const userData = await me();
        setUserRole(userData.role);
      } catch (error) {
        console.error("Erreur lors de la récupération du rôle:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, []);

  if (!isAuthenticated()) {
    // Redirige vers /login et conserve la route d'origine
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!loading && location.pathname === "/admin" && userRole === "USER") {
    // Redirige les utilisateurs avec le rôle USER vers la page d'accueil
    return <Navigate to="/" replace />;
  }

  // Affiche le contenu protégé si l'utilisateur est authentifié
  // et a les droits nécessaires pour la route demandée
  return loading ? <div>Chargement...</div> : <Outlet />;
}
