import { useEffect, useState } from "react";
// import { createProposal } from "../api/proposals";
import api from "../api/client";
import Toast from "../components/Toast";

export default function AdminDashboardScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    document.title = "StudyHub | Admin";
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/proposals?status=PENDING");
      setItems(data);
    } catch (e) {
      console.error(e);
      setToastMessage(e?.response?.data?.error || "Erreur de chargement");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  }

  async function review(id, decision) {
    try {
      await api.post(`/proposals/${id}/review`, { decision });
      const proposal = items.find((p) => p.id === id);

      // Déterminer le nom de la proposition
      let proposalName = "";
      if (proposal) {
        if (proposal.type === "NEW") {
          proposalName = JSON.parse(proposal.payloadJson).title;
        } else {
          // Pour les modifications, utiliser le titre de l'article ciblé
          proposalName = proposal.Article?.title || `Modification #${id}`;
        }
      }

      const message =
        decision === "APPROVED"
          ? `Proposition "${proposalName}" approuvée avec succès`
          : `Proposition "${proposalName}" rejetée`;

      setToastMessage(message);
      setShowToast(true);
      load();
    } catch (e) {
      console.error(e);
      setToastMessage(e?.response?.data?.error || "Erreur lors de la révision");
      setShowToast(true);
    }
  }

  // Fonction pour rendre le contenu formaté d'une proposition
  const renderProposalContent = (proposal) => {
    try {
      const payload = JSON.parse(proposal.payloadJson);

      if (proposal.type === "NEW") {
        return (
          <div style={previewStyles.container}>
            <h3 style={previewStyles.title}>{payload.title}</h3>
            {payload.categoryId && (
              <div style={previewStyles.category}>
                {getCategoryName(payload.categoryId)}
              </div>
            )}
            {payload.summary && (
              <div style={previewStyles.summary}>{payload.summary}</div>
            )}
            <div style={previewStyles.content}>{payload.content}</div>
          </div>
        );
      } else {
        // Pour les modifications, on pourrait afficher les différences
        // mais pour l'instant on affiche simplement le contenu
        return (
          <div style={previewStyles.container}>
            <h3 style={previewStyles.title}>
              Modification de: {proposal.Article?.title}
            </h3>
            <div style={previewStyles.content}>{payload.content}</div>
          </div>
        );
      }
    } catch (e) {
      return (
        <div style={{ color: "#ef4444" }}>
          Erreur lors du parsing du JSON: {e.message}
        </div>
      );
    }
  };

  // Fonction pour obtenir le nom de la catégorie à partir de son ID
  const getCategoryName = (categoryId) => {
    const categories = {
      dev: "Développement",
      design: "Design",
      infra: "Infrastructure",
    };
    return categories[categoryId] || categoryId;
  };

  return (
    <section>
      {showToast && (
        <Toast
          title={
            toastMessage.includes("approuvée")
              ? "Succès"
              : toastMessage.includes("rejetée")
              ? "Information"
              : "Erreur"
          }
          message={toastMessage}
          duration={5000}
          onClose={() => setShowToast(false)}
        />
      )}
      <h1>Dashboard</h1>
      {loading ? (
        <p>Chargement…</p>
      ) : items.length === 0 ? (
        <p>Aucune proposition en attente.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
          {items.map((p) => (
            <li
              key={p.id}
              style={{
                border: "1px solid #1f2937",
                borderRadius: 10,
                padding: 12,
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                Proposition #{p.id} — {p.type}
              </div>
              {p.targetArticleId ? (
                <div style={{ fontSize: 14, color: "#9ca3af" }}>
                  Article ciblé : {p?.Article?.title || p.targetArticleId}
                </div>
              ) : (
                <div style={{ fontSize: 14, color: "#9ca3af" }}>
                  Nouvelle fiche
                </div>
              )}
              <div style={{ marginTop: 8 }}>
                <button
                  onClick={() => review(p.id, "APPROVED")}
                  style={btnApprove}
                >
                  Approuver
                </button>
                <button
                  onClick={() => review(p.id, "REJECTED")}
                  style={btnReject}
                >
                  Rejeter
                </button>
              </div>
              <details style={{ marginTop: 12 }}>
                <summary style={{ cursor: "pointer", fontWeight: 500 }}>
                  Aperçu de la fiche
                </summary>
                <div style={{ marginTop: 10 }}>{renderProposalContent(p)}</div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const btnApprove = {
  marginRight: 8,
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid rgba(16,185,129,0.5)",
  background: "rgba(16,185,129)",
  color: "#a7f3d0",
};

const btnReject = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid rgba(239,68,68,0.5)",
  background: "rgba(239,67,67)",
  color: "#fecaca",
};

const previewStyles = {
  container: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    padding: 12,
    border: "1px solid rgba(255,255,255,0.1)",
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    marginTop: 0,
    marginBottom: 8,
  },
  category: {
    display: "inline-block",
    background: "rgba(59,130,246,0.2)",
    color: "#93c5fd",
    padding: "2px 8px",
    borderRadius: 4,
    fontSize: 12,
    marginBottom: 10,
  },
  summary: {
    fontSize: 14,
    marginBottom: 12,
    fontStyle: "italic",
  },
  content: {
    fontSize: 14,
    whiteSpace: "pre-wrap",
    lineHeight: 1.5,
  },
};
