import React from "react";

export default function Button({ 
  label, 
  color = "#111827", 
  textColor = "#fff", 
  size = "medium", 
  onClick, 
  style 
}) {

  const sizes = {
    small: { padding: "6px 12px", fontSize: "14px" },
    medium: { padding: "10px 16px", fontSize: "16px" },
    large: { padding: "14px 20px", fontSize: "18px" },
  };

  return (
    <button
      onClick={onClick}
      style={{
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: color,
        color: textColor,
        fontWeight: 600,
        transition: "background-color 0.3s",
        ...sizes[size],
        ...style,
      }}
    >
      {label}
    </button>
  );
}
