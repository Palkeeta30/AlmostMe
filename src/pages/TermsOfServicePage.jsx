import React from "react";
const TermsOfServicePage = () => {
  return (
    <div className="page-container" style={{ marginTop: "80px" }}>
      <h1>Terms of Service</h1>
      <p>
        Welcome to AlmostMe. By using our platform, you agree to comply with and
        be bound by the following terms and conditions.
      </p>
      <h2>User Responsibilities</h2>
      <ul>
        <li>You agree to use the platform for lawful purposes only.</li>
        <li>
          You are responsible for maintaining the confidentiality of your
          account information.
        </li>
        <li>You agree not to misuse the services provided.</li>
      </ul>
      <h2>Intellectual Property</h2>
      <p>
        All content and materials on AlmostMe are the property of AlmostMe or
        its licensors and are protected by intellectual property laws.
      </p>
      <h2>Limitation of Liability</h2>
      <p>
        AlmostMe is not liable for any damages arising from the use or inability
        to use the platform.
      </p>
      <h2>Changes to Terms</h2>
      <p>
        We reserve the right to update these terms at any time. Continued use of
        the platform constitutes acceptance of the updated terms.
      </p>
      <h2>Contact Us</h2>
      <p>
        For any questions regarding these terms, please contact us at{" "}
        <a href="mailto:talkto.almostme@gmail.com">talkto.almostme@gmail.com</a>
        .
      </p>
    </div>
  );
};

export default TermsOfServicePage;
