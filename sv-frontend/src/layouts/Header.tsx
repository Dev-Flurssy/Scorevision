import { FaChartBar } from "react-icons/fa6";
import { useTheme } from "../hooks/useTheme";
import { HiMoon, HiSun } from "react-icons/hi";

export const Header = () => {
  const { theme, toggle } = useTheme();
  return (
    <div className="nav">
      <header>
        <div className="nav-inner">
          <span className="nav-logo">
            <FaChartBar className="nav-logo-icon" aria-hidden="true" />
            ScoreVision
          </span>
          <div className="right">
            <span className="nav-tagline">Student Performance Analytics</span>
            <button
              className="theme-toggle"
              onClick={toggle}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <HiSun /> : <HiMoon />}
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};
