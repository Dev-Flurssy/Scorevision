import { FaChartBar, FaGithub } from "react-icons/fa6";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-logo">
          <FaChartBar className="footer-logo-icon" aria-hidden="true" />
          ScoreVision
        </span>

        <p className="footer-copy">
          © {year} ScoreVision. Built for educators who want clarity, not just
          numbers.
        </p>

        <a
          className="footer-github"
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source on GitHub"
        >
          <FaGithub aria-hidden="true" />
          GitHub
        </a>
      </div>
    </footer>
  );
};
