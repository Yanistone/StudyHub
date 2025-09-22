import { Link } from "react-router-dom";

export default function Card({ title, slug, author, category, summary }) {
  return (
    <Link to={`/articles/${slug}`}>
      <li style={styles.card}>
        <strong style={styles.title}>{title}</strong>
        <div style={styles.meta}>
          {category} · {author}
        </div>
        {summary && <p style={styles.summary}>{summary}</p>}
      </li>
    </Link>
  );
}

const styles = {
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: 14,
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  title: {
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
    color: "#111827",
    fontSize: 15,
  },
};
