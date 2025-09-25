import { useEffect, useState } from "react";
// import { createProposal } from "../api/proposals";
import api from "../api/client";
import Toast from "../components/Toast";
import Button from "../components/Button";

export default function AdminDashboardScreen() {
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [activeTab, setActiveTab] = useState("proposals");

  useEffect(() => {
    document.title = "StudyHub | Admin";
    load();
    loadUsers();
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

  async function loadUsers() {
    setLoadingUsers(true);
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data);
    } catch (e) {
      console.error(e);
      setToastMessage(
        e?.response?.data?.error || "Erreur de chargement des utilisateurs"
      );
      setShowToast(true);
    } finally {
      setLoadingUsers(false);
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

  async function updateUserRole(userId, newRole) {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setToastMessage("Rôle de l'utilisateur mis à jour avec succès");
      setShowToast(true);
      loadUsers();
    } catch (e) {
      console.error(e);
      setToastMessage(
        e?.response?.data?.error || "Erreur lors de la mise à jour du rôle"
      );
      setShowToast(true);
    }
  }

  async function toggleUserStatus(userId, isActive) {
    try {
      await api.put(`/admin/users/${userId}/status`, { isActive: !isActive });
      setToastMessage(
        isActive
          ? "Utilisateur désactivé avec succès"
          : "Utilisateur réactivé avec succès"
      );
      setShowToast(true);
      loadUsers();
    } catch (e) {
      console.error(e);
      setToastMessage(
        e?.response?.data?.error || "Erreur lors de la mise à jour du statut"
      );
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
    <section style={{ color: "#111827" }}>
      {showToast && (
        <Toast
          title={
            toastMessage.includes("approuvée") ||
            toastMessage.includes("succès")
              ? "Succès"
              : toastMessage.includes("rejetée") ||
                toastMessage.includes("désactivé")
              ? "Information"
              : "Erreur"
          }
          message={toastMessage}
          duration={5000}
          onClose={() => setShowToast(false)}
        />
      )}
      <h1>Dashboard</h1>

      <div style={styles.tabs}>
        <Button
          label="Propositions"
          onClick={() => setActiveTab("proposals")}
          color={activeTab === "proposals" ? "#3b82f6" : "#e5e7eb"}
          textColor={activeTab === "proposals" ? "#ffffff" : "#111827"}
          size="small"
          style={{ marginRight: "10px" }}
        />
        <Button
          label="Utilisateurs"
          onClick={() => setActiveTab("users")}
          color={activeTab === "users" ? "#3b82f6" : "#e5e7eb"}
          textColor={activeTab === "users" ? "#ffffff" : "#111827"}
          size="small"
        />
      </div>

      {activeTab === "proposals" ? (
        // Affichage des propositions
        loading ? (
          <p>Chargement…</p>
        ) : items.length === 0 ? (
          <p>Aucune proposition en attente.</p>
        ) : (
          <ul
            style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}
          >
            {items.map((p) => (
              <li
                key={p.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  padding: 12,
                  background: "#ffffff",
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  Proposition #{p.id} — {p.type}
                </div>
                {p.targetArticleId ? (
                  <div style={{ fontSize: 14, color: "#6b7280" }}>
                    Article ciblé : {p?.Article?.title || p.targetArticleId}
                  </div>
                ) : (
                  <div style={{ fontSize: 14, color: "#6b7280" }}>
                    Nouvelle fiche
                  </div>
                )}
                <div style={{ marginTop: 8 }}>
                  <Button
                    label="Approuver"
                    onClick={() => review(p.id, "APPROVED")}
                    color="#10b981"
                    size="small"
                    style={{ marginRight: "8px" }}
                  />
                  <Button
                    label="Rejeter"
                    onClick={() => review(p.id, "REJECTED")}
                    color="#ef4444"
                    size="small"
                  />
                </div>
                <details style={{ marginTop: 12 }}>
                  <summary style={{ cursor: "pointer", fontWeight: 500 }}>
                    Aperçu de la fiche
                  </summary>
                  <div style={{ marginTop: 10 }}>
                    {renderProposalContent(p)}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        )
      ) : // Affichage du tableau des utilisateurs
      loadingUsers ? (
        <p>Chargement des utilisateurs…</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Nom d'utilisateur</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Rôle</th>
                <th style={styles.th}>Statut</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={user.isActive ? {} : { opacity: 0.6 }}>
                  <td style={styles.td}>{user.id}</td>
                  <td style={styles.td}>{user.username}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                      style={styles.select}
                      disabled={
                        user.role === "ADMIN" &&
                        users.filter((u) => u.role === "ADMIN").length === 1
                      }
                    >
                      <option value="USER">Utilisateur</option>
                      <option value="MOD">Modérateur</option>
                      <option value="ADMIN">Administrateur</option>
                    </select>
                  </td>
                  <td style={styles.td}>
                    <span
                      style={
                        user.isActive
                          ? styles.activeStatus
                          : styles.inactiveStatus
                      }
                    >
                      {user.isActive ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <Button
                      label={user.isActive ? "Désactiver" : "Activer"}
                      onClick={() => toggleUserStatus(user.id, user.isActive)}
                      color={user.isActive ? "#ef4444" : "#10b981"}
                      size="small"
                      style={{
                        opacity:
                          user.role === "ADMIN" &&
                          users.filter((u) => u.role === "ADMIN" && u.isActive)
                            .length === 1 &&
                          user.isActive
                            ? 0.5
                            : 1,
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

const previewStyles = {
  container: {
    background: "#f9fafb",
    borderRadius: 8,
    padding: 12,
    border: "1px solid #e5e7eb",
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    marginTop: 0,
    marginBottom: 8,
    color: "#111827",
  },
  category: {
    display: "inline-block",
    background: "rgba(59,130,246,0.1)",
    color: "#3b82f6",
    padding: "2px 8px",
    borderRadius: 4,
    fontSize: 12,
    marginBottom: 10,
  },
  summary: {
    fontSize: 14,
    marginBottom: 12,
    fontStyle: "italic",
    color: "#4b5563",
  },
  content: {
    fontSize: 14,
    whiteSpace: "pre-wrap",
    lineHeight: 1.5,
    color: "#111827",
  },
};

const styles = {
  tabs: {
    display: "flex",
    marginBottom: 20,
  },
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    color: "#111827",
  },
  th: {
    textAlign: "left",
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
    color: "#6b7280",
    fontWeight: 500,
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
  },
  select: {
    padding: "6px 8px",
    background: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: 4,
    color: "#111827",
  },
  activeStatus: {
    display: "inline-block",
    padding: "2px 8px",
    background: "rgba(16,185,129,0.1)",
    color: "#10b981",
    borderRadius: 4,
    fontSize: 12,
  },
  inactiveStatus: {
    display: "inline-block",
    padding: "2px 8px",
    background: "rgba(239,68,68,0.1)",
    color: "#ef4444",
    borderRadius: 4,
    fontSize: 12,
  },
};
