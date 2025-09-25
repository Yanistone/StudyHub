import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { createProposal } from "../api/proposals";
import { getArticleById } from "../api/articles";
import { listCategories } from "../api/categories";
import { useUser } from "../contexts/UserContext";
import Select from "../components/Select.jsx";
import Toast from "../components/Toast.jsx";
import Button from "../components/Button.jsx";

export default function EditArticleScreen() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchUserData } = useUser();
  const articleFromState = location.state?.article;

  const [article, setArticle] = useState(articleFromState || null);
  const [title, setTitle] = useState(articleFromState?.title || "");
  const [summary, setSummary] = useState(articleFromState?.summary || "");
  const [content, setContent] = useState(articleFromState?.content || "");
  const [categoryName, setCategoryName] = useState(
    articleFromState?.category?.name || ""
  );
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!articleFromState);
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    document.title = "StudyHub | Proposer une modification";

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

    // Si l'article n'est pas disponible dans l'état, le charger depuis l'API
    if (!articleFromState && id) {
      const fetchArticle = async () => {
        try {
          const data = await getArticleById(id);
          setArticle(data);
          setTitle(data.title || "");
          setSummary(data.summary || "");
          setContent(data.content || "");
          setCategoryName(data.category?.name || "");
          setLoading(false);
        } catch (e) {
          console.error(e);
          setToastType("error");
          setToastMessage(
            e?.response?.data?.error || "Erreur lors du chargement de l'article"
          );
          setShowToast(true);
          setLoading(false);
        }
      };

      fetchArticle();
    }
  }, [id, articleFromState]);

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
        type: "EDIT",
        targetArticleId: Number(id),
        payloadJson,
      });

      // Mettre à jour les données utilisateur pour récupérer les nouveaux points
      fetchUserData();

      setToastType("success");
      setToastMessage(
        "Proposition de modification envoyée, en attente de validation."
      );
      setShowToast(true);

      // Rediriger vers la page de détail de l'article après un court délai
      setTimeout(() => {
        navigate(`/articles/${article.slug}`);
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

  if (loading) return <p>Chargement…</p>;

  return (
    <section>
      {showToast && (
        <Toast
          title={toastType === "success" ? "Succès" : "Erreur"}
          message={toastMessage}
          duration={5000}
          onClose={() => setShowToast(false)}
        />
      )}

      <h1>Proposer une modification</h1>
      <p>Article: {article?.title}</p>

      <form onSubmit={onSubmit} style={{ marginTop: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 8 }}>
            Titre
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                display: "block",
                width: "100%",
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #1f2937",
                background: "#fff",
                color: "#111827",
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 8 }}>
            Résumé
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #1f2937",
                background: "#fff",
                color: "#111827",
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 8 }}>
            Contenu
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={10}
              style={{
                display: "block",
                width: "100%",
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #1f2937",
                background: "#fff",
                color: "#111827",
                fontFamily: "inherit",
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Select
            options={categoryOptions}
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <Button
            label="Annuler"
            onClick={() => navigate(`/articles/${article.slug}`)}
            color="#f3f4f6"
            textColor="#111827"
          />
          <Button
            label={submitting ? "Envoi en cours..." : "Envoyer la proposition"}
            color="#111827"
            textColor="#fff"
            onClick={onSubmit}
            style={{ cursor: submitting ? "not-allowed" : "pointer" }}
          />
        </div>
      </form>
    </section>
  );
}
