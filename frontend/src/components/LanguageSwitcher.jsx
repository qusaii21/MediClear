import { useTranslation } from "react-i18next";
import "../styles/LanguageSwitcher.css";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "es" : "en"; // Toggle between English and Spanish
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="language-switcher">
      <label className="switch">
        <input
          type="checkbox"
          onChange={toggleLanguage}
          checked={i18n.language === "es"}
        />
        <span className="slider"></span>
      </label>
      <span>{i18n.language === "en" ? "English" : "मराठी"}</span>
    </div>
  );
}

export default LanguageSwitcher;