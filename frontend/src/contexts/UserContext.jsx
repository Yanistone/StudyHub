import { createContext, useState, useContext, useEffect } from "react";
import { me } from "../api/auth";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setUserData(null);
      setLoading(false);
      return;
    }

    try {
      const user = await me();
      setUserData(user);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données utilisateur:",
        error
      );
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour les points de l'utilisateur
  const updateUserPoints = (newPoints) => {
    if (userData) {
      setUserData({
        ...userData,
        points: newPoints,
      });
    }
  };

  // Charger les données utilisateur au montage du composant
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider
      value={{ userData, loading, fetchUserData, updateUserPoints }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
