import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listArticles } from "../api/articles";

export default function ArticlesListScreen() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "StudyHub | Fiches";
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listArticles({ q });
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []); // initial

  return (
    <section>
      <h1>Fiches</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Rechercher…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            height: 38,
            borderRadius: 8,
            padding: "0 10px",
            border: "1px solid #1f2937",
            background: "rgba(17,24,39,0.6)",
            color: "#e5e7eb",
          }}
        />
        <button onClick={load} style={{ height: 38, borderRadius: 8 }}>
          Rechercher
        </button>
      </div>

      {loading ? (
        <p>Chargement…</p>
      ) : items.length === 0 ? (
        <p>Aucune fiche.</p>
      ) : (
        <ul
          style={{
            paddingLeft: 0,
            listStyle: "none",
            display: "grid",
            gap: 10,
          }}
        >
          {items.map((a) => (
            <li
              key={a.id}
              style={{
                border: "1px solid #1f2937",
                borderRadius: 10,
                padding: 12,
              }}
            >
              <Link to={`/articles/${a.slug}`}>
                <strong>{a.title}</strong>
              </Link>
              <div style={{ color: "#9ca3af", fontSize: 14 }}>
                {a?.category?.name} · {a?.author?.email}
              </div>
              {a.summary && <p style={{ marginTop: 6 }}>{a.summary}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
