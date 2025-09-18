import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listArticles } from "../api/articles";
import Button from "../components/Button.jsx";
import Select from "../components/Select.jsx"; 

export default function ArticlesListScreen() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all"); 

  useEffect(() => {
    document.title = "StudyHub | Fiches";
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listArticles({ q, category }); 
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const categoryOptions = [
    { value: "all", label: "Toutes les catégories" },
    { value: "dev", label: "Développement" },
    { value: "design", label: "Design" },
    { value: "infra", label: "Infrastructure" },
  ];

  return (
    <section style={styles.wrapper}>
      <h1 style={styles.title}>Fiches</h1>

      <div style={styles.searchBox}>
        <input
          placeholder="Rechercher…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={styles.input}
        />
        <Select
          options={categoryOptions}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          size="small"
          style={{ minWidth: 180 }}
        />
        <Button label="Rechercher" onClick={load} size="small" />
      </div>

      {loading ? (
        <p style={styles.info}>Chargement…</p>
      ) : items.length === 0 ? (
        <p style={styles.info}>Aucune fiche.</p>
      ) : (
        <ul style={styles.list}>
          {items.map((a) => (
            <li key={a.id} style={styles.card}>
              <Link to={`/articles/${a.slug}`} style={styles.link}>
                <strong>{a.title}</strong>
              </Link>
              <div style={styles.meta}>
                {a?.category?.name} · {a?.author?.email}
              </div>
              {a.summary && <p style={styles.summary}>{a.summary}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const styles = {
  wrapper: {
    padding: "20px",
    minHeight: "calc(100vh - 56px)",
    color: "var(--sh-text-2)",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 16,
    paddingTop: 20,
  },
  searchBox: {
    display: "flex",
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    padding: "0 12px",
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#111827",
    outline: "none",
  },
  list: {
    paddingLeft: 0,
    listStyle: "none",
    display: "grid",
    gap: 12,
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: 14,
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  link: {
    fontSize: 18,
    color: "#111827",
    textDecoration: "none",
    fontWeight: 600,
  },
  meta: {
    color: "#6b7280",
    fontSize: 14,
    marginTop: 4,
  },
  summary: {
    marginTop: 8,
    color: "#374151",
    fontSize: 15,
  },
  info: {
    color: "#6b7280",
    fontSize: 15,
  },
};
