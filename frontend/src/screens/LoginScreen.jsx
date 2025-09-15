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

          <button
            type="button"
            onClick={useDemoToken}
            style={styles.secondaryBtn}
          >
            Mode démo (sans API)
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
    display: "grid",
    placeItems: "center",
    minHeight: "calc(100vh - 56px)", // tient compte de la navbar du Layout
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "rgba(255,255,255,0.02)",
    border: "1px solid #1f2937",
    borderRadius: 12,
    padding: 16,
  },
  tabs: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    marginBottom: 12,
  },
  tab: {
    padding: "10px 12px",
    background: "transparent",
    color: "#e5e7eb",
    border: "1px solid #1f2937",
    borderRadius: 10,
    fontWeight: 600,
  },
  tabActive: {
    background: "rgba(59,130,246,0.15)",
    borderColor: "rgba(59,130,246,0.35)",
    color: "#dbeafe",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, color: "#9ca3af" },
  input: {
    height: 40,
    padding: "0 12px",
    color: "#e5e7eb",
    background: "rgba(17,24,39,0.6)",
    border: "1px solid #1f2937",
    borderRadius: 10,
    outline: "none",
  },
  primaryBtn: {
    height: 42,
    borderRadius: 10,
    border: "1px solid rgba(59,130,246,0.35)",
    background: "rgba(59,130,246,0.2)",
    color: "#dbeafe",
    fontWeight: 700,
  },
  secondaryBtn: {
    height: 42,
    borderRadius: 10,
    border: "1px solid #1f2937",
    background: "transparent",
    color: "#e5e7eb",
    fontWeight: 600,
  },
  linkBtn: {
    padding: 0,
    margin: 0,
    border: "none",
    background: "none",
    color: "#93c5fd",
    textDecoration: "underline",
    cursor: "pointer",
  },
  error: {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.35)",
    color: "#fecaca",
    borderRadius: 10,
    padding: "8px 10px",
    fontSize: 14,
  },
  meta: { marginTop: 10, fontSize: 14, color: "#9ca3af", textAlign: "center" },
};
