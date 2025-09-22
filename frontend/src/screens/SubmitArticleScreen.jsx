import { useEffect, useState } from "react";
import { createProposal } from "../api/proposals";
import Select from "../components/Select.jsx";
import Toast from "../components/Toast.jsx";

export default function SubmitArticleScreen() {
  useEffect(() => {
    document.title = "StudyHub | Proposer une fiche";
  }, []);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const categoryOptions = [
    { value: "dev", label: "Développement" },
    { value: "design", label: "Design" },
    { value: "infra", label: "Infrastructure" },
  ];

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payloadJson = {
        title,
        summary,
        content,
        categoryId: categoryId ? Number(categoryId) : null,
      };
      await createProposal({ type: "NEW", payloadJson });

      setToastType("success");
      setToastMessage("Proposition envoyée, en attente de validation.");
      setShowToast(true);

      // Réinitialiser le formulaire
      setTitle("");
      setSummary("");
      setContent("");
      setCategoryId("");
    } catch (e) {
      console.error(e);
      setToastType("error");
      setToastMessage(
        e?.response?.data?.error || "Erreur lors de l'envoi de la proposition"
      );
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={styles.wrapper}>
      {showToast && (
        <Toast
          title={toastType === "success" ? "Succès" : "Erreur"}
          message={toastMessage}
          duration={5000}
          onClose={() => setShowToast(false)}
        />
      )}
      <h1 style={styles.title}>Proposer une fiche</h1>
      <form onSubmit={onSubmit} style={styles.form}>
        <input
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
          required
        />
        <input
          placeholder="Résumé"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Contenu"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={15}
          style={styles.textarea}
          required
        />
        <Select
          options={categoryOptions}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          size="small"
          style={{ minWidth: 180 }}
        />
        <button disabled={loading} style={styles.button}>
          {loading ? "Envoi…" : "Soumettre"}
        </button>
      </form>
    </section>
  );
}

const styles = {
  wrapper: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 20,
  },
  form: {
    display: "grid",
    gap: 16,
  },
  input: {
    height: 40,
    borderRadius: 8,
    padding: "0 12px",
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#111827",
    outline: "none",
    fontSize: 15,
  },
  textarea: {
    borderRadius: 8,
    padding: 12,
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#111827",
    fontSize: 15,
    outline: "none",
    resize: "vertical",
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
  },
};
