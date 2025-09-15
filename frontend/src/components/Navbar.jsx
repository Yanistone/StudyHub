import { Link } from "react-router-dom";

export default function Navbar({ onToggleSidebar }) {
  return (
    <header className="sh-navbar">
      <button
        aria-label="Ouvrir le menu"
        className="sh-burger"
        onClick={onToggleSidebar}
      >
        ☰
      </button>

      <div className="sh-brand">
        <Link to="/">StudyHub</Link>
      </div>

      <div className="sh-nav-right">
        {/* Placeholders à adapter (search, profil, etc.) */}
        <Link className="sh-link" to="/articles">
          Fiches
        </Link>
        <Link className="sh-link" to="/submit">
          Proposer
        </Link>
        <Link className="sh-link" to="/admin">
          Admin
        </Link>
      </div>
    </header>
  );
}
