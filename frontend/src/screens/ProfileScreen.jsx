import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { me } from "../api/auth";
import api from "../api/client";

export default function ProfileScreen() {
  useEffect(() => {
    document.title = "StudyHub | Mon Profil";
  }, []);

  // État pour stocker les données de l'utilisateur
  const [userData, setUserData] = useState({
    email: "",
    username: "",
    role: "",
    articles: [],
    proposals: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Chargement des données utilisateur réelles
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Récupérer les informations de l'utilisateur
        const user = await me();

        // Récupérer les propositions de l'utilisateur
        const { data: proposals } = await api.get("/proposals", {
          params: { submittedBy: user.id },
        });

        // Récupérer les articles de l'utilisateur
        const { data: articles } = await api.get("/articles", {
          params: { authorId: user.id },
        });

        // Mettre à jour les données utilisateur
        setUserData({
          email: user.email,
          username: user.username || user.email.split("@")[0],
          role: user.role,
          articles: articles || [],
          proposals: proposals || [],
        });

        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Impossible de charger les données du profil");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <section style={styles.wrapper}>
        <div style={styles.loadingContainer}>
          <p>Chargement du profil...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section style={styles.wrapper}>
        <div style={styles.errorContainer}>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={styles.button}
          >
            Réessayer
          </button>
        </div>
      </section>
    );
  }

  return (
    <section style={styles.wrapper}>
      <div style={styles.profileHeader}>
        <h1 style={styles.title}>Mon Profil</h1>
        <Link to="/settings" style={styles.editButton}>
          Modifier
        </Link>
      </div>

      <div style={styles.card}>
        <div style={styles.infoRow}>
          <span style={styles.label}>Email:</span>
          <span>{userData.email}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>Nom d'utilisateur:</span>
          <span>{userData.username}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>Rôle:</span>
          <span>
            {userData.role === "USER"
              ? "Utilisateur"
              : userData.role === "MOD"
              ? "Modérateur"
              : "Administrateur"}
          </span>
        </div>
      </div>

      <h2 style={styles.sectionTitle}>Mes Articles</h2>
      {userData.articles && userData.articles.length > 0 ? (
        <div style={styles.listContainer}>
          {userData.articles.map((article) => (
            <Link
              key={article.id}
              to={`/articles/${article.slug}`}
              style={styles.listItem}
            >
              {article.title}
            </Link>
          ))}
        </div>
      ) : (
        <p style={styles.emptyMessage}>
          Vous n'avez pas encore publié d'articles.
        </p>
      )}

      <h2 style={styles.sectionTitle}>Mes Propositions</h2>
      {userData.proposals && userData.proposals.length > 0 ? (
        <div style={styles.listContainer}>
          {userData.proposals.map((proposal) => (
            <div key={proposal.id} style={styles.listItem}>
              <span>
                {proposal.type === "NEW"
                  ? "Nouvelle fiche"
                  : proposal.Article?.title || `Modification #${proposal.id}`}
              </span>
              <span
                style={{
                  ...styles.badge,
                  ...(proposal.status === "APPROVED"
                    ? styles.badgeSuccess
                    : proposal.status === "REJECTED"
                    ? styles.badgeDanger
                    : styles.badgeWarning),
                }}
              >
                {proposal.status === "APPROVED"
                  ? "Approuvée"
                  : proposal.status === "REJECTED"
                  ? "Rejetée"
                  : "En attente"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.emptyMessage}>
          Vous n'avez pas encore soumis de propositions.
        </p>
      )}
    </section>
  );
}

const styles = {
  wrapper: {
    padding: 20,
    paddingTop: 40,
    maxWidth: 800,
    margin: "0 auto",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
    gap: 20,
  },
  profileHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    margin: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginTop: 30,
    marginBottom: 15,
  },
  card: {
    background: "#fff",
    borderRadius: 10,
    padding: 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    marginBottom: 20,
  },
  infoRow: {
    display: "flex",
    padding: "10px 0",
    borderBottom: "1px solid #f3f4f6",
  },
  label: {
    fontWeight: 600,
    width: 150,
    color: "#4b5563",
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  listItem: {
    padding: 15,
    background: "#fff",
    borderRadius: 8,
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    textDecoration: "none",
    color: "#111827",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    padding: "4px 8px",
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 500,
  },
  badgeSuccess: {
    background: "#d1fae5",
    color: "#065f46",
  },
  badgeWarning: {
    background: "#fef3c7",
    color: "#92400e",
  },
  badgeDanger: {
    background: "#fee2e2",
    color: "#b91c1c",
  },
  emptyMessage: {
    color: "#6b7280",
    fontStyle: "italic",
  },
  actions: {
    marginTop: 30,
    display: "flex",
    justifyContent: "center",
  },
  button: {
    height: 42,
    borderRadius: 8,
    border: "none",
    background: "#111827",
    color: "#fff",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    transition: "background 0.2s ease",
    padding: "0 20px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
  },
  editButton: {
    padding: "8px 16px",
    borderRadius: 8,
    background: "#f3f4f6",
    color: "#374151",
    fontWeight: 500,
    fontSize: 14,
    textDecoration: "none",
    transition: "background 0.2s ease",
  },
};
