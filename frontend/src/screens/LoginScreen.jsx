// src/screens/LoginScreen.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export default function LoginScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = useMemo(
    () => location.state?.from?.pathname || "/",
    [location.state]
  );
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Champs communs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Champ supplémentaire pour l'inscription
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    document.title =
      mode === "login" ? "StudyHub — Connexion" : "StudyHub — Inscription";
  }, [mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const body =
        mode === "login"
          ? { email, password }
          : {
              email,
              password,
              displayName: displayName || email.split("@")[0],
            };

      const res = await fetch(`${API_URL}/api${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Une erreur est survenue.");
      }

      const data = await res.json();
      // Attendu : { token: "..." } côté API
      const token = data?.token;
      if (!token) {
        // Mode démo si l'API ne renvoie pas encore de token
        // (À retirer une fois l'API prête)
        localStorage.setItem("authToken", "dev-token");
      } else {
        localStorage.setItem("authToken", token);
      }

      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Échec de l'opération.");
    } finally {
      setLoading(false);
    }
  };

  // Petit bouton de secours pour bosser le front sans API prête
  const useDemoToken = () => {
    localStorage.setItem("authToken", "dev-token");
    navigate(from, { replace: true });
  };

  return (
    <section style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.tabs}>
          <button
            onClick={() => setMode("login")}
            style={{
              ...styles.tab,
              ...(mode === "login" ? styles.tabActive : {}),
            }}
            aria-pressed={mode === "login"}
          >
            Connexion
          </button>
          <button
            onClick={() => setMode("register")}
            style={{
              ...styles.tab,
              ...(mode === "register" ? styles.tabActive : {}),
            }}
            aria-pressed={mode === "register"}
          >
            Inscription
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          {mode === "register" && (
            <div style={styles.field}>
              <label htmlFor="displayName" style={styles.label}>
                Nom affiché
              </label>
              <input
                id="displayName"
                type="text"
                placeholder="Ex. Jean Dupont"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                style={styles.input}
                autoComplete="name"
              />
            </div>
          )}

          <div style={styles.field}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="votre.email@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              autoComplete="email"
              required
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              required
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} style={styles.primaryBtn}>
            {loading
              ? "Veuillez patienter…"
              : mode === "login"
              ? "Se connecter"
              : "Créer le compte"}
          </button>

        </form>

        <div style={styles.meta}>
          {mode === "login" ? (
            <span>
              Pas de compte ?{" "}
              <button
                style={styles.linkBtn}
                onClick={() => setMode("register")}
              >
                Inscrivez-vous
              </button>
            </span>
          ) : (
            <span>
              Déjà inscrit ?{" "}
              <button style={styles.linkBtn} onClick={() => setMode("login")}>
                Connectez-vous
              </button>
            </span>
          )}
        </div>

        <div style={styles.meta}>
          <Link to="/">← Retour à l’accueil</Link>
        </div>
      </div>
    </section>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 88px)",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  tabs: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    marginBottom: 20,
  },
  tab: {
    padding: "10px 12px",
    background: "transparent",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: 10,
    fontWeight: 600,
    cursor: "pointer",
  },
  tabActive: {
    background: "var(--sh-bg-2)",
    borderColor: "var(--sh-bg-2)",
    color: "#fff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 500, color: "#374151" },
  input: {
    height: 42,
    padding: "0 12px",
    color: "#111827",
    background: "#fff",
    border: "1px solid #d1d5db",
    borderRadius: 10,
    outline: "none",
  },
  primaryBtn: {
    height: 44,
    borderRadius: 10,
    border: "none",
    background: "var(--sh-bg-2)",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
  primaryBtnHover: {
    background: "#375974",
  },
  secondaryBtn: {
    height: 42,
    borderRadius: 10,
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#374151",
    fontWeight: 600,
    cursor: "pointer",
  },
  linkBtn: {
    padding: 0,
    margin: 0,
    border: "none",
    background: "none",
    color: "var(--sh-bg-2)",
    textDecoration: "underline",
    cursor: "pointer",
    fontSize: 14,
  },
  error: {
    background: "#fee2e2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    borderRadius: 10,
    padding: "8px 10px",
    fontSize: 14,
  },
  meta: {
    marginTop: 14,
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
};
