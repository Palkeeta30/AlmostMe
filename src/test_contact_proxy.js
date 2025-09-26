// Test script to check if the proxy is working for contact API
fetch("/contact/api/send/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Test User",
    email: "test@example.com",
    subject: "Test Subject",
    message: "This is a test message from frontend",
  }),
})
  .then((response) => {
    console.log("Response status:", response.status);
    return response.json();
  })
  .then((data) => {
    console.log("Response data:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
