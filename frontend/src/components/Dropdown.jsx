import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const styles = {
  dropdown: {
    position: "relative",
  },
  trigger: {
    cursor: "pointer",
  },
  menu: {
    position: "absolute",
    top: "100%",
    right: 0,
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    minWidth: "180px",
    zIndex: 100,
    overflow: "hidden",
  },
  item: {
    padding: 0,
  },
  link: {
    display: "block",
    padding: "10px 16px",
    color: "#374151",
    textDecoration: "none",
    textAlign: "left",
    width: "100%",
    fontSize: "14px",
  },
  button: {
    display: "block",
    padding: "10px 16px",
    color: "#374151",
    textAlign: "left",
    width: "100%",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  },
  divider: {
    borderBottom: "1px solid #e5e7eb",
  },
};

export default function Dropdown({ trigger, items }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Ferme le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={styles.dropdown} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} style={styles.trigger}>
        {trigger}
      </div>

      {isOpen && (
        <div style={styles.menu}>
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                ...styles.item,
                ...(index !== items.length - 1 ? styles.divider : {}),
              }}
            >
              {item.to ? (
                <Link
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  style={{
                    ...styles.link,
                    ":hover": { background: "#f3f4f6" },
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                  style={{
                    ...styles.button,
                    ":hover": { background: "#f3f4f6" },
                  }}
                >
                  {item.label}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
