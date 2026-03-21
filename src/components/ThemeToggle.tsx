"use client";

import { useTheme } from "./ThemeProvider";
import { Sparkles, ScrollText } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: "fixed",
        bottom: "2rem",
        left: "2rem",
        zIndex: 1000,
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-accent)",
        color: "var(--color-secondary)",
        border: "2px solid var(--color-secondary)",
        boxShadow: "var(--shadow-lg), 0 0 15px rgba(212, 175, 55, 0.3)",
        transition: "all 0.3s ease",
      }}
      title={theme === "traditional" ? "Switch to Modern View" : "Switch to Traditional View"}
    >
      {theme === "traditional" ? (
        <Sparkles size={24} />
      ) : (
        <ScrollText size={24} />
      )}
    </button>
  );
}
