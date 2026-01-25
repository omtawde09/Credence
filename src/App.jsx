import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import OnboardingPage from "./components/pages/OnboardingPage";
import RecommendationPage from "./components/pages/RecommendationPage";
import AdvisorDashboard from "./components/pages/AdvisorDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/recommendation" element={<RecommendationPage />} />
        <Route path="/advisor" element={<AdvisorDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
