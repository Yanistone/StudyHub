import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProposal } from "../api/proposals";
import { listCategories } from "../api/categories";
import { useUser } from "../contexts/UserContext";
import Select from "../components/Select.jsx";
import Toast from "../components/Toast.jsx";

export default function SubmitArticleScreen() {
  const navigate = useNavigate();
  const { fetchUserData } = useUser();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    document.title = "StudyHub | Soumettre un article";

    // Charger les catégories depuis l'API
    const loadCategories = async () => {
      try {
        const data = await listCategories();
        setCategories(data);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
      }
    };

    loadCategories();
  }, []);

  // Transformer les catégories en options pour le sélecteur
  const categoryOptions = categories.map((category) => ({
    value: category.name,
    label: category.name,
  }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Trouver l'ID de la catégorie à partir de son nom
      const selectedCategory = categories.find(
        (cat) => cat.name === categoryName
      );
      const categoryId = selectedCategory ? selectedCategory.id : null;

      const payloadJson = {
        title,
        summary,
        content,
        categoryId,
      };

      await createProposal({
        type: "NEW",
        payloadJson,
      });

      // Mettre à jour les données utilisateur pour récupérer les nouveaux points
      fetchUserData();

      setToastType("success");
      setToastMessage(
        "Proposition d'article envoyée, en attente de validation."
      );
      setShowToast(true);

      // Rediriger vers la page d'accueil après un court délai
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (e) {
      console.error(e);
      setToastType("error");
      setToastMessage(
        e?.response?.data?.error || "Erreur lors de l'envoi de la proposition"
      );
      setShowToast(true);
    } finally {
      setSubmitting(false);
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
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          size="small"
          style={{ minWidth: 180 }}
        />
        <button style={styles.button}>Soumettre</button>
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
