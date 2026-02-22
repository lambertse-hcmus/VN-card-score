import { createContext, useContext, useState, useEffect } from "react";
import translations from "./translations";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("vn");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("language");
      if (stored === "vn" || stored === "en") setLanguage(stored);
    } catch {
      // ignore if storage unavailable
    }
  }, []);

  const toggleLanguage = () => {
    const next = language === "vn" ? "en" : "vn";
    setLanguage(next);
    try {
      window.localStorage.setItem("language", next);
    } catch {
      // ignore if storage unavailable
    }
  };

  const t = (key) => translations[language]?.[key] ?? key;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
