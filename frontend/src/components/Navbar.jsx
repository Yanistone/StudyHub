import { Link, useNavigate } from "react-router-dom";
import { IoPerson } from "react-icons/io5";

export default function Navbar({ onToggleSidebar, isSidebarOpen, isMobile }) {
  const navigate = useNavigate();
  const isAuthed = !!localStorage.getItem("authToken");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/", { replace: true });
  };

  return (
    <header className="sh-navbar">
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
        <Link to="/">StudyHub</Link>
      </div>

      <div className="sh-nav-right">
        {isAuthed ? (
          <>
            <button 
              onClick={handleLogout}
              style={{ 
                background: "none", 
                border: "none", 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center" 
              }}
            >
              <IoPerson size={24} color="#fff" />
            </button>
          </>
        ) : (
          <Link className="sh-link" to="/login">
            Se connecter
          </Link>
        )}
      </div>
    </header>
  );
}
