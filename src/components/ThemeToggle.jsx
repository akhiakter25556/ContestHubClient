import { useTheme } from "../contexts/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
  const { theme, toggleTheme, isInitialized } = useTheme();

  if (!isInitialized) return null;

  return (
    <button
      onClick={toggleTheme}
      className="text-red-500 text-xl p-2"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "dark" ? <FaSun /> : <FaMoon />}
    </button>
  );
}
