import React from "react";

const PrivacyPolicyPage = () => {
  return (
    <div className="page-container" style={{ marginTop: "80px" }}>
      <h1>Privacy Policy</h1>
      <p>
        At AlmostMe, we are committed to protecting your privacy. This Privacy
        Policy explains how we collect, use, and safeguard your personal
        information when you use our platform.
      </p>
      <h2>Information We Collect</h2>
      <ul>
        <li>Personal identification information (Name, email address, etc.)</li>
        <li>Usage data and analytics</li>
        <li>Cookies and tracking technologies</li>
      </ul>
      <h2>How We Use Your Information</h2>
      <ul>
        <li>To provide and maintain our services</li>
        <li>To improve user experience</li>
        <li>To communicate with you</li>
        <li>To comply with legal obligations</li>
      </ul>
      <h2>Your Rights</h2>
      <p>
        You have the right to access, update, or delete your personal
        information. For any privacy-related concerns, please contact us at{" "}
        <a href="mailto:talkto.almostme@gmail.com">talkto.almostme@gmail.com</a>
        .
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
