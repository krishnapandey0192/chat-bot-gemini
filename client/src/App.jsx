import React, { useState, useEffect } from "react";
import Chat from "./components/Chat";

function App() {
  // Initialize dark mode based on localStorage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return false;
  });

  // Effect to apply the theme on initial load
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]); // Only runs when darkMode changes

  // Toggle dark mode and update the state
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className="App">
      {/* Dark mode toggle button */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 z-50 right-4 p-2 bg-blue-400 rounded-full shadow-md hover:bg-blue-300 dark:bg-gray-600 dark:hover:bg-gray-500"
      >
        {darkMode ? "🌞" : "🌙"}
      </button>
      <Chat />
    </div>
  );
}

export default App;
