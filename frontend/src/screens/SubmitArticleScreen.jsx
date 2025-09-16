import { useEffect, useState } from "react";
import { createProposal } from "../api/proposals";

export default function SubmitArticleScreen() {
  useEffect(() => {
    document.title = "StudyHub | Proposer une fiche";
  }, []);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const payloadJson = {
        title,
        summary,
        content,
        categoryId: categoryId ? Number(categoryId) : null,
      };
      await createProposal({ type: "NEW", payloadJson });
      setMsg("Proposition envoyée, en attente de validation.");
      setTitle("");
      setSummary("");
      setContent("");
      setCategoryId("");
    } catch (e) {
      console.error(e);
      setMsg(e?.response?.data?.error || "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h1>Proposer une fiche</h1>
      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 10, maxWidth: 720 }}
      >
        <input
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={input}
        />
        <input
          placeholder="Résumé"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          style={input}
        />
        <textarea
          placeholder="Contenu"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          style={textarea}
        />
        <input
          placeholder="CategoryId (optionnel)"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={input}
        />
        <button disabled={loading} style={{ height: 40, borderRadius: 8 }}>
          {loading ? "Envoi…" : "Soumettre"}
        </button>
        {msg && <div style={{ color: "#9ca3af" }}>{msg}</div>}
      </form>
    </section>
  );
}
const input = {
  height: 38,
  borderRadius: 8,
  padding: "0 10px",
  border: "1px solid #1f2937",
  background: "rgba(17,24,39,0.6)",
  color: "#e5e7eb",
};
const textarea = {
  borderRadius: 8,
  padding: 10,
  border: "1px solid #1f2937",
  background: "rgba(17,24,39,0.6)",
  color: "#e5e7eb",
};
