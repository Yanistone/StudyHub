import { Link, useNavigate } from "react-router-dom";
import { IoPerson } from "react-icons/io5";
import Dropdown from "./Dropdown";

export default function Navbar({ onToggleSidebar, isSidebarOpen, isMobile }) {
  const navigate = useNavigate();
  const isAuthed = !!localStorage.getItem("authToken");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/", { replace: true });
  };

  const dropdownItems = [
    { label: "Mon profil", to: "/profile" },
    { label: "Se déconnecter", onClick: handleLogout },
  ];

  return (
    <header className="sh-navbar" style={{ color: "var(--sh-text)" }}>
      {isMobile && (
        <button
          aria-label="Ouvrir le menu"
          className="sh-burger"
          onClick={onToggleSidebar}
          style={{ display: isSidebarOpen ? "none" : "block" }}
        >
          ☰
        </button>
      )}

      <div className="sh-brand">
        <Link to="/">
          <img src="/favicon.png" alt="StudyHub Logo" width="38" height="38" />
          StudyHub
        </Link>
      </div>

      <div className="sh-nav-right">
        {isAuthed ? (
          <Dropdown
            trigger={
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IoPerson size={24} color="#e5e7eb" />
              </button>
            }
            items={dropdownItems}
          />
        ) : (
          <Link className="sh-link" to="/login">
            Se connecter
          </Link>
        )}
      </div>
    </header>
  );
}
