"use client";

import React, { useState } from "react";
import { contactAPI } from "../utils/api";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSuccess(false);
    setShowError(false);
    setErrorMessage("");

    try {
      const response = await contactAPI.submit(formData);
      if (response.status === 200) {
        setShowSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      } else {
        setShowError(true);
        setErrorMessage(
          response.message || "Failed to send message. Please try again."
        );
      }
    } catch (error) {
      setShowError(true);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleSendEmail = () => {
    window.location.href = "mailto:talkto.almostme@gmail.com";
  };

  const faqs = [
    {
      question: "How does the emotion detection work?",
      answer:
        "Our emotion detection uses advanced AI algorithms to analyze facial expressions and mood indicators to provide personalized wellness recommendations.",
    },
    {
      question: "Is my data secure and private?",
      answer:
        "Yes, we take privacy seriously. All your data is encrypted and stored securely. We never share your personal information with third parties.",
    },
    {
      question: "Can I use AlmostMe on mobile devices?",
      answer:
        "AlmostMe is fully responsive and works seamlessly on all devices including smartphones and tablets.",
    },
    {
      question: "Are the fitness plans suitable for beginners?",
      answer:
        "Yes, we offer workout plans for all fitness levels, from complete beginners to advanced athletes. You can choose your preferred difficulty level.",
    },
    {
      question: "How accurate are the diet recommendations?",
      answer:
        "Our diet recommendations are based on nutritional science and can be customized based on your dietary preferences and restrictions.",
    },
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="hero-content">
            <h1>
              Contact <span className="gradient-text">Us</span>
            </h1>
            <p>
              Get in touch with our team for support, feedback, or questions
            </p>
          </div>

          {/* Floating Contact Icons */}
          <div className="floating-icons">
            <div className="contact-icon email">
              <i className="fas fa-envelope"></i>
            </div>
            <div className="contact-icon phone">
              <i className="fas fa-phone"></i>
            </div>
            <div className="contact-icon location">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="contact-icon chat">
              <i className="fas fa-comments"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="container">
          <div className="contact-layout">
            {/* Contact Information */}
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <p>
                We'd love to hear from you! Whether you have questions about our
                features, need technical support, or want to share feedback, our
                team is here to help.
              </p>

              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="method-info">
                    <h3>Email Us</h3>
                    <p>
                      <a
                        href="mailto:talkto.almostme@gmail.com"
                        className="email-link"
                      >
                        talkto.almostme@gmail.com
                      </a>
                    </p>
                    <span>We'll respond within 24 hours</span>
                    <button className="btn-chat" onClick={handleSendEmail}>
                      Send Email&nbsp;
                    </button>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="method-info">
                    <h3>Visit Us</h3>
                    <p>Uttar Pradesh, India</p>
                    <span>Open Mon-Fri, 9AM-5PM</span>
                    <button className="btn-chat">Get Directions&nbsp;</button>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-comments"></i>
                  </div>
                  <div className="method-info">
                    <h3>Live Chat</h3>
                    <p>Chat with our support team</p>
                    <span>Available 24/7</span>
                    <button className="btn-chat">Start Chat&nbsp;</button>
                  </div>
                </div>
              </div>

              <div className="social-section">
                <h3>Follow Us</h3>
                <div className="social-icons">
                  <a
                    href="https://www.facebook.com"
                    className="social-icon facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a
                    href="https://www.twitter.com"
                    className="social-icon twitter"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a
                    href="https://www.instagram.com"
                    className="social-icon instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a
                    href="https://www.linkedin.com"
                    className="social-icon linkedin"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a
                    href="https://www.youtube.com"
                    className="social-icon youtube"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form">
              <div className="form-container">
                <h2>Send us a Message</h2>

                {showSuccess && (
                  <div className="success-message">
                    <i className="fas fa-check-circle"></i>
                    Thank you! Your message has been sent successfully. We'll
                    get back to you soon.
                  </div>
                )}

                {showError && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i> {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <div className="floating-label">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder=" "
                        required
                      />
                      <label htmlFor="name" className="form-label">
                        <i className="fas fa-user"></i>
                        Your Name
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="floating-label">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder=" "
                        required
                      />
                      <label htmlFor="email" className="form-label">
                        <i className="fas fa-envelope"></i>
                        Your Email
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="floating-label">
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder=" "
                        required
                      />
                      <label htmlFor="subject" className="form-label">
                        <i className="fas fa-tag"></i>
                        Subject
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="floating-label">
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder=" "
                        rows={5}
                        required
                      />
                      <label htmlFor="message" className="form-label">
                        <i className="fas fa-comment"></i>
                        Your Message
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>

          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${activeFaq === index ? "active" : ""}`}
              >
                <div className="faq-question" onClick={() => toggleFaq(index)}>
                  <h3>{faq.question}</h3>
                  <i className="fas fa-plus"></i>
                </div>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
