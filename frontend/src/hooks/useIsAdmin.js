import { useState, useEffect } from "react";
import { me } from "../api/auth";

export default function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Vérifier si un token existe
        const token = localStorage.getItem("authToken");
        if (!token) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Récupérer les informations de l'utilisateur
        const userData = await me();

        // Vérifier si l'utilisateur a le rôle ADMIN ou MOD
        setIsAdmin(userData.role === "ADMIN" || userData.role === "MOD");
      } catch (error) {
        console.error("Erreur lors de la vérification du statut admin:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  return { isAdmin, loading };
}
