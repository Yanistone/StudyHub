import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listUserArticles } from "../api/articles";
import { listUserProposals } from "../api/proposals";
import { useUser } from "../contexts/UserContext";

// Définir les styles en premier
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
  },
  profileHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 0,
  },
  editButton: {
    padding: "8px 16px",
    backgroundColor: "#111827",
    color: "white",
    borderRadius: 4,
    textDecoration: "none",
    fontSize: 14,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    marginBottom: 30,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  infoRow: {
    display: "flex",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    width: 150,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 15,
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  listItem: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 8,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    textDecoration: "none",
    color: "inherit",
  },
  emptyMessage: {
    color: "#6b7280",
    fontStyle: "italic",
  },
  badge: {
    padding: "4px 8px",
    borderRadius: 4,
    fontSize: 12,
    fontWeight: "bold",
  },
  badgeSuccess: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
  },
  badgeDanger: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
  },
  badgeWarning: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  button: {
    padding: "8px 16px",
    backgroundColor: "#111827",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    marginTop: 10,
  },
  section: {
    marginTop: 30,
  },
  pointsContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginTop: "10px",
  },
  pointsBadge: {
    backgroundColor: "#111827",
    color: "#fff",
    borderRadius: "50%",
    width: "70px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "bold",
  },
  pointsText: {
    fontSize: "14px",
    color: "#4b5563",
  },
};

export default function ProfileScreen() {
  useEffect(() => {
    document.title = "StudyHub | Mon Profil";
  }, []);

  // Utiliser le contexte utilisateur
  const { userData: user, loading: userLoading } = useUser();

  // État pour stocker les données complémentaires
  const [profileData, setProfileData] = useState({
    articles: [],
    proposals: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Chargement des données utilisateur réelles
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      try {
        // Récupérer les propositions et articles de l'utilisateur
        const [proposals, articles] = await Promise.all([
          listUserProposals(),
          listUserArticles(user.id),
        ]);

        // Mettre à jour les données utilisateur
        setProfileData({
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

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  if (userLoading || loading) {
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

  if (!user) {
    return (
      <section style={styles.wrapper}>
        <div style={styles.errorContainer}>
          <p>Vous devez être connecté pour accéder à cette page</p>
          <Link to="/login" style={styles.button}>
            Se connecter
          </Link>
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
          <span>{user.email}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>Nom d'utilisateur:</span>
          <span>{user.username}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.label}>Rôle:</span>
          <span>
            {user.role === "USER"
              ? "Utilisateur"
              : user.role === "MOD"
              ? "Modérateur"
              : "Administrateur"}
          </span>
        </div>
      </div>

      {/* Section des points de gamification */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Points de gamification</h2>
        <div style={styles.pointsContainer}>
          <div style={styles.pointsBadge}>{user.points}</div>
          <p style={styles.pointsText}>
            Gagnez des points en créant des fiches (+5), en proposant des
            modifications (+5) et lorsque vos contributions sont approuvées
            (+5).
          </p>
        </div>
      </div>

      <h2 style={styles.sectionTitle}>Mes Articles</h2>
      {profileData.articles && profileData.articles.length > 0 ? (
        <div style={styles.listContainer}>
          {profileData.articles.map((article) => (
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
      {profileData.proposals && profileData.proposals.length > 0 ? (
        <div style={styles.listContainer}>
          {profileData.proposals.map((proposal) => (
            <div key={proposal.id} style={styles.listItem}>
              <span>
                {proposal.type === "NEW"
                  ? JSON.parse(proposal.payloadJson).title
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
