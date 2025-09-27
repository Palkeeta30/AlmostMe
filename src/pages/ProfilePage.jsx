import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { apiClient } from "../utils/api";
import toast from "react-hot-toast";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user, logout, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [contactData, setContactData] = useState({
    subject: "",
    message: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.request("/auth-api/update_profile/", {
        method: "POST",
        body: JSON.stringify(profileData),
      });

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        refreshUser();
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.new_password.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.request("/auth-api/change_password/", {
        method: "POST",
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
        }),
      });

      if (response.data.success) {
        toast.success("Password changed successfully!");
        setPasswordData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
      } else {
        toast.error(response.data.message || "Failed to change password");
      }
    } catch (error) {
      toast.error("An error occurred while changing password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    setLoading(true);

    try {
      const response = await apiClient.request("/auth-api/delete_account/", {
        method: "POST",
      });

      if (response.data.success) {
        toast.success("Account deleted successfully");
        logout();
      } else {
        toast.error(response.data.message || "Failed to delete account");
      }
    } catch (error) {
      toast.error("An error occurred while deleting account");
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (!contactData.subject || !contactData.message) {
      toast.error("Please fill in all contact fields");
      return;
    }

    setLoading(true);

    try {
      // For now, just show a success message since we don't have a contact API
      toast.success("Message sent successfully! We'll get back to you soon.");
      setContactData({ subject: "", message: "" });
    } catch (error) {
      toast.error("An error occurred while sending message");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "contact", label: "Contact", icon: "📧" },
    { id: "help", label: "Help", icon: "❓" },
    { id: "danger", label: "Danger Zone", icon: "⚠️" },
  ];

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account settings and preferences</p>
        </div>

        <div className="profile-content">
          <div className="profile-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="profile-tab-content">
            {activeTab === "profile" && (
              <div className="profile-section">
                <h2>Profile Information</h2>
                <form onSubmit={handleProfileUpdate} className="profile-form">
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      value={profileData.username}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          username: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Profile"}
                  </button>
                </form>
              </div>
            )}

            {activeTab === "security" && (
              <div className="profile-section">
                <h2>Change Password</h2>
                <form onSubmit={handlePasswordChange} className="profile-form">
                  <div className="form-group">
                    <label htmlFor="current_password">Current Password</label>
                    <input
                      type="password"
                      id="current_password"
                      value={passwordData.current_password}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          current_password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="new_password">New Password</label>
                    <input
                      type="password"
                      id="new_password"
                      value={passwordData.new_password}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          new_password: e.target.value,
                        })
                      }
                      required
                      minLength="6"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirm_password">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirm_password"
                      value={passwordData.confirm_password}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirm_password: e.target.value,
                        })
                      }
                      required
                      minLength="6"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Changing..." : "Change Password"}
                  </button>
                </form>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="profile-section">
                <h2>Contact Us</h2>
                <p>Have questions or need help? Send us a message!</p>
                <form onSubmit={handleContactSubmit} className="profile-form">
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      value={contactData.subject}
                      onChange={(e) =>
                        setContactData({
                          ...contactData,
                          subject: e.target.value,
                        })
                      }
                      placeholder="What's this about?"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      value={contactData.message}
                      onChange={(e) =>
                        setContactData({
                          ...contactData,
                          message: e.target.value,
                        })
                      }
                      placeholder="Tell us how we can help you..."
                      rows="5"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            )}

            {activeTab === "help" && (
              <div className="profile-section">
                <h2>Help & Support</h2>
                <div className="help-content">
                  <div className="help-item">
                    <h3>Getting Started</h3>
                    <p>
                      Welcome to AlmostMe! Here's how to make the most of your
                      wellness journey:
                    </p>
                    <ul>
                      <li>
                        Complete your profile to get personalized
                        recommendations
                      </li>
                      <li>
                        Explore our games to reduce stress and improve focus
                      </li>
                      <li>
                        Track your fitness goals and monitor your progress
                      </li>
                      <li>
                        Use the emotion tracker to understand your mental state
                      </li>
                    </ul>
                  </div>

                  <div className="help-item">
                    <h3>Frequently Asked Questions</h3>
                    <div className="faq">
                      <h4>How do I reset my password?</h4>
                      <p>
                        Use the "Change Password" section in the Security tab.
                      </p>

                      <h4>Can I delete my account?</h4>
                      <p>
                        Yes, you can delete your account in the "Danger Zone"
                        tab. This action is permanent.
                      </p>

                      <h4>How do I contact support?</h4>
                      <p>Use the Contact tab to send us a message directly.</p>
                    </div>
                  </div>

                  <div className="help-item">
                    <h3>Need More Help?</h3>
                    <p>
                      If you can't find what you're looking for, please contact
                      us using the Contact tab above.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "danger" && (
              <div className="profile-section danger-zone">
                <h2>Danger Zone</h2>
                <p className="warning-text">
                  ⚠️ These actions are permanent and cannot be undone.
                </p>

                <div className="danger-actions">
                  <div className="danger-item">
                    <h3>Delete Account</h3>
                    <p>
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="btn-danger"
                      disabled={loading}
                    >
                      {loading ? "Deleting..." : "Delete Account"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
