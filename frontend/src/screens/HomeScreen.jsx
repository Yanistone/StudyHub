import { useEffect, useState } from "react";
import Toast from "../components/Toast";
import { me } from "../api/auth";

export default function HomeScreen() {
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    document.title = "StudyHub";

    // Vérifier si l'utilisateur vient de se connecter
    const justLoggedIn = localStorage.getItem("justLoggedIn");

    if (justLoggedIn === "true") {
      // Récupérer les données à jour de l'utilisateur depuis l'API
      const fetchUserData = async () => {
        try {
          const userData = await me();
          // Utiliser le username de la base de données
          setUsername(userData.username);
          setShowWelcomeToast(true);
          // Supprimer le flag pour ne pas afficher le toast à chaque visite
          localStorage.removeItem("justLoggedIn");
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des données utilisateur:",
            error
          );
        }
      };

      fetchUserData();
    }
  }, []);

  const styles = {
    home: {
      minHeight: "50vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      background: "none",
    },
    title: {
      fontSize: "42px",
      fontWeight: 800,
      color: "#111827",
      margin: 0,
    },
    spanWrapper: {
      position: "relative",
      display: "inline-block",
    },
    underline: {
      position: "absolute",
      left: 0,
      bottom: -6,
      width: "100%",
      height: 4,
      backgroundColor: "#4b5563",
      borderRadius: 2,
    },
    spanText: {
      color: "#4b5563",
    },
    text: {
      marginTop: 20,
      maxWidth: 700,
      fontSize: 18,
      lineHeight: 1.6,
      color: "#374151",
    },
  };

  return (
    <>
      {showWelcomeToast && (
        <Toast
          title="Bienvenue"
          message={`Bonjour ${username} ! Ravi de vous revoir sur StudyHub.`}
          duration={5000}
          onClose={() => setShowWelcomeToast(false)}
        />
      )}
      <section style={styles.home}>
        <h1 style={styles.title}>
          Bienvenue sur{" "}
          <span style={styles.spanWrapper}>
            <span style={styles.spanText}>StudyHub</span>
            <span style={styles.underline}></span>
          </span>
        </h1>
        <p style={styles.text}>
          Cette base de connaissances vous permet de rechercher, consulter et
          proposer des fiches pour partager les bonnes pratiques rencontrées
          durant le cursus.
        </p>
      </section>
    </>
  );
}
