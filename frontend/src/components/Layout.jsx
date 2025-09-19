import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import useIsMobile from "../hooks/useIsMobile.js";

export default function Layout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  // Fermer la sidebar lors d'un changement de route (pratique sur mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setSidebarOpen((v) => !v);
  const closeSidebar = () => setSidebarOpen(false);

  const styles = `
:root {
  --sh-navbar-h: 56px;
  --sh-sidebar-w: 240px;
  --sh-bg: #0f172a;
  --sh-bg-2: #111827;
  --sh-text: #e5e7eb;
  --sh-text-2: #111827;
  --sh-muted: #9ca3af;
  --sh-accent: #3b82f6;
  --sh-border: #1f2937;
}

* { box-sizing: border-box; }
a { color: inherit; text-decoration: none; }
button { cursor: pointer; }

body {
  margin: 0;
  background:rgb(245, 245, 245);
  color: var(--sh-text-2);
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif;
}
/* NAVBAR */
.sh-navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: var(--sh-navbar-h);
  background: var(--sh-bg);
  border-bottom: 1px solid var(--sh-border);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px;
  z-index: 50;
}

.sh-burger {
  background: transparent;
  border: 1px solid var(--sh-border);
  color: var(--sh-text);
  width: 36px; height: 36px;
  border-radius: 8px;
  font-size: 18px;
  line-height: 1;
}

.sh-brand a {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  letter-spacing: .2px;
  font-size: 18px;
}

.sh-nav-right {
  margin-left: auto;
  display: flex;
  gap: 12px;
}

.sh-link {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid transparent;
}

.sh-link:hover {
  border-color: var(--sh-border);
  background: rgba(255,255,255,0.03);
}

/* SIDEBAR */
.sh-sidebar {
  position: fixed;
  top: var(--sh-navbar-h);
  left: 0;
  width: var(--sh-sidebar-w);
  bottom: 0;
  background: var(--sh-bg-2);
  border-right: 1px solid var(--sh-border);
  padding: 12px;
  overflow-y: auto;
  z-index: 40;
}

.sh-sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 4px 14px;
  border-bottom: 1px dashed var(--sh-border);
  margin-bottom: 12px;
}
.sh-sidebar-title {
  font-size: 12px;
  text-transform: uppercase;
  color: var(--sh-muted);
  letter-spacing: .8px;
  font-weight: bold;
}
.sh-close {
  display: none;
  background: transparent;
  border: none;
  color: var(--sh-muted);
  font-size: 22px;
  line-height: 1;
}

.sh-sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

.sh-item {
  display: block;
  padding: 10px 12px;
  border-radius: 10px;
  color: var(--sh-text);
  border: 1px solid transparent;
}
.sh-item:hover {
  background: rgba(255,255,255,0.04);
  border-color: var(--sh-border);
}
.sh-item.active {
  background: rgba(59,130,246,0.15);
  border-color: rgba(59,130,246,0.35);
  color: #dbeafe;
  font-weight: bold;
}

/* CONTENT */
.sh-content {
  padding-top: var(--sh-navbar-h);
  padding-left: var(--sh-sidebar-w);
  min-height: 100vh;
}
.sh-content-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px;
}

/* OVERLAY (mobile) */
.sh-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 39;
  opacity: 0;
  transition: opacity .2s ease;
}
.sh-overlay.open {
  display: block;
  opacity: 1;
}

/* Responsive */
@media (max-width: 992px) {
  .sh-content {
    padding-left: 0;
  }
  .sh-sidebar {
    transform: translateX(-100%);
    transition: transform .2s ease;
    width: min(82vw, 280px);
  }
  .sh-sidebar.open {
    transform: translateX(0);
  }
  .sh-close {
    display: inline-block;
  }
}
`;

  return (
    <div className="sh-root">
      {/* CSS injecté dans le composant */}
      <style>{styles}</style>

      <Navbar
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        isMobile={isMobile}
      />

      {/* Overlay mobile */}
      <div
        className={`sh-overlay ${isSidebarOpen ? "open" : ""}`}
        onClick={closeSidebar}
      />

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="sh-content">
        <div className="sh-content-inner">{children}</div>
      </div>
    </div>
  );
}
