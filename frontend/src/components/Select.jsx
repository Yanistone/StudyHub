import React from "react";

export default function Select({ 
  options = [], 
  value, 
  onChange, 
  color = "#4b5563", 
  textColor = "#fff", 
  size = "medium", 
  style 
}) {

  const sizes = {
    small: { padding: "6px 10px", fontSize: "14px" },
    medium: { padding: "8px 14px", fontSize: "16px" },
    large: { padding: "10px 16px", fontSize: "18px" },
  };

  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        borderRadius: "8px",
        border: `2px solid ${color}`,
        backgroundColor: "#111827",
        color: textColor,
        fontWeight: 500,
        cursor: "pointer",
        transition: "border-color 0.3s",
        ...sizes[size],
        ...style,
      }}
    >
      {options.map((opt, index) => (
        <option key={index} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
