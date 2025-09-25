import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoPerson } from "react-icons/io5";
import { useUser } from "../contexts/UserContext";
import Dropdown from "./Dropdown";

export default function Navbar({ onToggleSidebar, isSidebarOpen, isMobile }) {
  const navigate = useNavigate();
  const isAuthed = !!localStorage.getItem("authToken");
  const { userData, fetchUserData } = useUser();

  useEffect(() => {
    if (isAuthed && !userData) {
      fetchUserData();
    }
  }, [isAuthed, userData, fetchUserData]);

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
        {isAuthed && userData && (
          <div
            style={{
              marginRight: "15px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#111827",
                color: "#fff",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {userData.points || 0}
            </div>
            <span style={{ fontSize: "14px" }}>points</span>
          </div>
        )}

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
                <IoPerson size={24} />
              </button>
            }
            items={dropdownItems}
          />
        ) : (
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
            }}
          >
            <IoPerson size={24} />
          </Link>
        )}
      </div>
    </header>
  );
}
