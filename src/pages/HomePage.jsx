"use client";

import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  useEffect(() => {
    // Scroll to top on mount to fix login/signup button scroll issue
    window.scrollTo(0, 0);

    // Fade in animations
    const fadeElements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    });

    fadeElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background"></div>
        <div className="container">
          <div className="hero-content fade-in">
            <h1>
              Discover Your <span className="gradient-text">True Self</span>
            </h1>
            <p className="hero-subtitle fade-in stagger-delay-1">
              Wellness • Balance • Harmony • Growth • Peace
            </p>
            <div className="hero-buttons fade-in stagger-delay-2">
              <Link to="/games" className="btn btn-primary">
                Play Games
              </Link>
              <Link to="/emotion" className="btn btn-secondary">
                Analyze Mood
              </Link>
              <Link to="/fitness" className="btn btn-tertiary">
                Get Fit
              </Link>
            </div>
          </div>
        </div>
        <div className="scroll-indicator fade-in stagger-delay-3">
          <i className="fas fa-chevron-down"></i>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title fade-in">
            Our <span className="gradient-text">Features</span>
          </h2>
          <p className="section-subtitle fade-in stagger-delay-1">
            Discover all the ways AlmostMe can help you live better
          </p>

          <div className="features-grid">
            <div className="feature-card fade-in stagger-delay-2">
              <div className="feature-icon">
                <i className="fas fa-gamepad"></i>
              </div>
              <h3>Mind Games</h3>
              <p>
                Train your brain with fun and engaging games designed to improve
                cognitive function.
              </p>
              <Link to="/games" className="btn btn-primary">
                Play Now
              </Link>
            </div>

            <div className="feature-card fade-in stagger-delay-3">
              <div className="feature-icon">
                <i className="fas fa-smile"></i>
              </div>
              <h3>Emotion Detection</h3>
              <p>
                Understand your emotional state and get personalized
                recommendations.
              </p>
              <Link to="/emotion" className="btn btn-primary">
                Analyze Mood
              </Link>
            </div>

            <div className="feature-card fade-in stagger-delay-4">
              <div className="feature-icon">
                <i className="fas fa-heartbeat"></i>
              </div>
              <h3>Health & Fitness</h3>
              <p>
                Track your fitness progress and get insights to improve your
                overall health.
              </p>
              <Link to="/fitness" className="btn btn-primary">
                Get Fit
              </Link>
            </div>

            <div className="feature-card fade-in stagger-delay-5">
              <div className="feature-icon">
                <i className="fas fa-utensils"></i>
              </div>
              <h3>Diet & Nutrition</h3>
              <p>
                Get personalized meal recommendations based on your dietary
                preferences.
              </p>
              <Link to="/diet" className="btn btn-primary">
                Plan Meals
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
