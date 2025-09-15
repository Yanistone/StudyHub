import { NavLink } from "react-router-dom";

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay mobile */}
      <div className={`sh-overlay ${isOpen ? "open" : ""}`} onClick={onClose} />
      <aside className={`sh-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sh-sidebar-header">
          <span className="sh-sidebar-title">Navigation</span>
          <button aria-label="Fermer" className="sh-close" onClick={onClose}>
            ×
          </button>
        </div>

        <nav className="sh-sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `sh-item ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            Accueil
          </NavLink>

          <NavLink
            to="/articles"
            className={({ isActive }) => `sh-item ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            Fiches
          </NavLink>

          <NavLink
            to="/submit"
            className={({ isActive }) => `sh-item ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            Proposer une fiche
          </NavLink>

          <NavLink
            to="/admin"
            className={({ isActive }) => `sh-item ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            Admin
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
