import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import { useAuth } from "../auth/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const openLoginModal = () => {
    setShowLogin(true);
    setShowSignup(false);
    closeMobileMenu();
  };

  const openSignupModal = () => {
    setShowSignup(true);
    setShowLogin(false);
    closeMobileMenu();
  };

  const onLoginSuccess = () => {
    setShowLogin(false);
  };

  const onSignupSuccess = () => {
    setShowSignup(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="container">
          <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
            <span className="navbar-logo-text">
              Almost<span className="brand-highlight">Me</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-desktop">
            <div className="navbar-nav">
              <Link
                to="/"
                className={`nav-link ${
                  location.pathname === "/" ? "active" : ""
                }`}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                to="/emotion"
                className={`nav-link ${
                  location.pathname === "/emotion" ? "active" : ""
                }`}
                onClick={closeMobileMenu}
              >
                Emotion
              </Link>
              <Link
                to="/fitness"
                className={`nav-link ${
                  location.pathname === "/fitness" ? "active" : ""
                }`}
                onClick={closeMobileMenu}
              >
                Fitness
              </Link>
              <Link
                to="/diet"
                className={`nav-link ${
                  location.pathname === "/diet" ? "active" : ""
                }`}
                onClick={closeMobileMenu}
              >
                Diet
              </Link>
              <Link
                to="/games"
                className={`nav-link ${
                  location.pathname === "/games" ? "active" : ""
                }`}
                onClick={closeMobileMenu}
              >
                Game
              </Link>
              <Link
                to="/contact"
                className={`nav-link ${
                  location.pathname === "/contact" ? "active" : ""
                }`}
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
              <Link
                to="/profile"
                className={`nav-link ${
                  location.pathname === "/profile" ? "active" : ""
                }`}
                onClick={closeMobileMenu}
              >
                Profile
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="auth-buttons">
              {!isAuthenticated ? (
                <>
                  <button onClick={openLoginModal} className="btn-login">
                    Login
                  </button>
                  <button onClick={openSignupModal} className="btn-signup">
                    Signup
                  </button>
                </>
              ) : (
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`mobile-menu-toggle ${isMobileMenuOpen ? "active" : ""}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>

          {/* Mobile Menu */}
          <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
            <div className="mobile-menu-content">
              {/* Mobile Navigation Links */}
              <div className="mobile-nav-links">
                <Link
                  to="/"
                  className="mobile-nav-link"
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>
                <Link
                  to="/emotion"
                  className="mobile-nav-link"
                  onClick={closeMobileMenu}
                >
                  Emotion
                </Link>
                <Link
                  to="/fitness"
                  className="mobile-nav-link"
                  onClick={closeMobileMenu}
                >
                  Fitness
                </Link>
                <Link
                  to="/diet"
                  className="mobile-nav-link"
                  onClick={closeMobileMenu}
                >
                  Diet
                </Link>
                <Link
                  to="/games"
                  className="mobile-nav-link"
                  onClick={closeMobileMenu}
                >
                  Game
                </Link>
                <Link
                  to="/contact"
                  className="mobile-nav-link"
                  onClick={closeMobileMenu}
                >
                  Contact
                </Link>
                <Link
                  to="/profile"
                  className="mobile-nav-link"
                  onClick={closeMobileMenu}
                >
                  Profile
                </Link>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="mobile-auth-buttons">
                {!isAuthenticated ? (
                  <>
                    <button onClick={openLoginModal} className="btn-login">
                      Login
                    </button>
                    <button onClick={openSignupModal} className="btn-signup">
                      Signup
                    </button>
                  </>
                ) : (
                  <button onClick={handleLogout} className="btn-logout">
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* Only show login/signup modals on home page and only if user is not authenticated */}
      {!isAuthenticated && location.pathname === "/" && showLogin && (
        <Login onLoginSuccess={onLoginSuccess} />
      )}
      {!isAuthenticated && location.pathname === "/" && showSignup && (
        <Signup onSignupSuccess={onSignupSuccess} />
      )}
    </>
  );
};

export default Navbar;
