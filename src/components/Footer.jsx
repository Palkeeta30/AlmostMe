import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Footer = () => {
  const { isAuthenticated } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigation = (e, path) => {
    e.preventDefault();
    if (isAuthenticated) {
      window.location.href = path;
    } else {
      // Redirect to login page if not authenticated
      window.location.href = "/login";
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section brand-section">
            <div className="footer-logo">
              <Link to="/" className="footer-brand">
                Almost<span className="brand-highlight">Me</span>
              </Link>
              <p className="brand-description">
                Your journey to wellness starts here. Discover balance, harmony,
                and your true self through our comprehensive wellness platform.
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>
                <Link
                  to="/games"
                  onClick={(e) => handleNavigation(e, "/games")}
                >
                  Mind Games
                </Link>
              </li>
              <li>
                <Link
                  to="/emotion"
                  onClick={(e) => handleNavigation(e, "/emotion")}
                >
                  Emotion Detection
                </Link>
              </li>
              <li>
                <Link
                  to="/fitness"
                  onClick={(e) => handleNavigation(e, "/fitness")}
                >
                  Fitness Tracker
                </Link>
              </li>
              <li>
                <Link to="/diet" onClick={(e) => handleNavigation(e, "/diet")}>
                  Diet Planner
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li>
                <Link
                  to="/contact"
                  onClick={(e) => handleNavigation(e, "/contact")}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/help" onClick={(e) => handleNavigation(e, "/help")}>
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  onClick={(e) => handleNavigation(e, "/privacy")}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  onClick={(e) => handleNavigation(e, "/terms")}
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer-section contact-section">
            <h4>Get in Touch</h4>
            <div className="contact-info">
              <p>
                <i className="fas fa-envelope"></i>
                <a href="mailto:talkto.almostme@gmail.com">
                  talkto.almostme@gmail.com
                </a>
              </p>
              <p>
                <i className="fas fa-map-marker-alt"></i>
                Uttar Pradesh, India
              </p>
            </div>

            <div className="social-icons">
              <a
                href="https://www.facebook.com"
                className="social-icon"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://www.twitter.com"
                className="social-icon"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://www.instagram.com"
                className="social-icon"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://www.linkedin.com"
                className="social-icon"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>
              &copy; 2025 AlmostMe. Made with <span className="heart">❤️</span>{" "}
              for your wellness journey.
            </p>
          </div>
          <div className="footer-actions">
            <button
              className="back-to-top"
              onClick={scrollToTop}
              aria-label="Back to top"
            >
              <i className="fas fa-arrow-up"></i>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
