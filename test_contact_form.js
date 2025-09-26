const axios = require("axios");

async function testContactForm() {
  try {
    const response = await axios.post(
      "http://localhost:8000/contact/api/send/",
      {
        name: "Test User",
        email: "test@example.com",
        subject: "Test Subject",
        message: "This is a test message.",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response:", response.data);
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }
}

testContactForm();
