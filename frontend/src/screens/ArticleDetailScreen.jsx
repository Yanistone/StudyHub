import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getArticleBySlug } from "../api/articles";
import { listCommentsByArticle, addComment } from "../api/comments";
import Toast from "../components/Toast";

export default function ArticleDetailScreen() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [showLoginToast, setShowLoginToast] = useState(false);

  useEffect(() => {
    document.title = `StudyHub | ${
      slug.charAt(0).toUpperCase() + slug.slice(1)
    }`;
  }, [slug]);

  async function load() {
    setLoading(true);
    try {
      const a = await getArticleBySlug(slug);
      setArticle(a);
      const cs = await listCommentsByArticle(a.id);
      setComments(cs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [slug]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem("authToken");
    if (!token) {
      setShowLoginToast(true);
      return;
    }

    try {
      await addComment(article.id, content.trim());
      setContent("");
      const cs = await listCommentsByArticle(article.id);
      setComments(cs);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <p>Chargement…</p>;
  if (!article) return <p>Introuvable.</p>;

  return (
    <section>
      {showLoginToast && (
        <Toast
          title="Connexion requise"
          message="Vous devez être connecté pour publier un commentaire"
          duration={5000}
          onClose={() => setShowLoginToast(false)}
        />
      )}

      <h1>{article.title}</h1>
      <div style={{ color: "#9ca3af", fontSize: 14 }}>
        {article?.category?.name} · {article?.author?.username}
      </div>
      {article.summary && <p style={{ marginTop: 6 }}>{article.summary}</p>}
      {article.content && (
        <div style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>
          {article.content}
        </div>
      )}

      <hr style={{ margin: "20px 0", borderColor: "#1f2937" }} />

      <h2>Commentaires</h2>
      {comments.length === 0 ? (
        <p>Aucun commentaire.</p>
      ) : (
        <ul
          style={{
            paddingLeft: 0,
            listStyle: "none",
            display: "grid",
            gap: 10,
          }}
        >
          {comments.map((c) => (
            <li
              key={c.id}
              style={{
                border: "1px solid #1f2937",
                borderRadius: 10,
                padding: 10,
              }}
            >
              <div style={{ color: "#9ca3af", fontSize: 13 }}>
                {c?.author?.email}
              </div>
              <div>{c.content}</div>
              <div style={{ color: "#9ca3af", fontSize: 12, marginTop: 4 }}>
                {new Date(c.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={onSubmit}
        style={{ marginTop: 12, display: "flex", gap: 8 }}
      >
        <input
          placeholder="Votre commentaire…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            flex: 1,
            height: 38,
            borderRadius: 8,
            padding: "0 10px",
            border: "1px solid #1f2937",
            background: "#111827",
            color: "#fff",
          }}
        />
        <button
          type="submit"
          style={{
            height: 38,
            borderRadius: 8,
            backgroundColor: "#111827",
            color: "#fff",
            border: "none",
            padding: "0 12px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Publier
        </button>
      </form>
    </section>
  );
}
