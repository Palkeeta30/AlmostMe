import React from "react";

const HelpCenterPage = () => {
  return (
    <div className="page-container" style={{ marginTop: "80px" }}>
      <h1>Help Center</h1>
      <p>
        Welcome to the AlmostMe Help Center. Here you will find answers to
        frequently asked questions, guides, and support resources to help you
        make the most of our platform. If you need further assistance, please
        contact our support team.
      </p>
      <h2>Frequently Asked Questions</h2>
      <ul>
        <li>How do I create an account?</li>
        <li>How can I reset my password?</li>
        <li>How do I track my fitness progress?</li>
        <li>How do I contact support?</li>
      </ul>
      <h2>Contact Support</h2>
      <p>
        For personalized assistance, please email us at{" "}
        <a href="mailto:talkto.almostme@gmail.com">talkto.almostme@gmail.com</a>
        .
      </p>
    </div>
  );
};

export default HelpCenterPage;
