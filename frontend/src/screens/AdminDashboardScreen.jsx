import { useEffect, useState } from "react";
import { createProposal } from "../api/proposals";
import api from "../api/client";

export default function AdminDashboardScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

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
      setMsg(e?.response?.data?.error || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  async function review(id, decision) {
    try {
      await api.post(`/proposals/${id}/review`, { decision });
      setMsg(`Proposition ${id} ${decision}`);
      load();
    } catch (e) {
      console.error(e);
      setMsg(e?.response?.data?.error || "Erreur review");
    }
  }

  return (
    <section>
      <h1>Admin — Propositions en attente</h1>
      {msg && <div style={{ color: "#9ca3af", marginBottom: 10 }}>{msg}</div>}
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
              <details style={{ marginTop: 8 }}>
                <summary>Voir payload JSON</summary>
                <pre style={{ whiteSpace: "pre-wrap", fontSize: 13 }}>
                  {p.payloadJson}
                </pre>
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
  background: "rgba(16,185,129,0.15)",
  color: "#a7f3d0",
};

const btnReject = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid rgba(239,68,68,0.5)",
  background: "rgba(239,68,68,0.15)",
  color: "#fecaca",
};
