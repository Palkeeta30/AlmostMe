import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./auth/AuthContext";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import GamesPage from "./pages/GamesPage";
import DietPage from "./pages/DietPage";
import EmotionPage from "./pages/EmotionPage";
import FitnessPage from "./pages/FitnessPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HelpCenterPage from "./pages/HelpCenterPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/games"
                  element={
                    <ProtectedRoute>
                      <GamesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/diet"
                  element={
                    <ProtectedRoute>
                      <DietPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/emotion"
                  element={
                    <ProtectedRoute>
                      <EmotionPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/fitness"
                  element={
                    <ProtectedRoute>
                      <FitnessPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <ProtectedRoute>
                      <ContactPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/help" element={<HelpCenterPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsOfServicePage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
        <Toaster position="top-right" />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
