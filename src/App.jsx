import { BrowserRouter, Routes, Route } from "react-router-dom";
import CredenceLandingPage from "./components/CredenceLandingPage";
import Dashboard from "./components/Dashboard";
import CreditPage from "./components/CreditPage";
import Agents from "./components/Agents";
import PolicyPage from "./components/PolicyPage";
import TaxationPage from "./components/TaxationPage";
import AdvisorDashboard from "./components/AdvisorDashboard";
import AccountPage from "./components/AccountPage";
import ActivityPage from "./components/ActivityPage";
import CalendarPage from "./components/CalendarPage";
import ManagePage from "./components/ManagePage";
import HelpCenterPage from "./components/HelpCenterPage";
import SettingsPage from "./components/SettingsPage";
import InvestorOnboarding from "./components/InvestorOnboarding";
import InvestorRecommendations from "./components/InvestorRecommendations";
import Layout from "./Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CredenceLandingPage />} />
        <Route element={<Layout />}>
          {/* Investor Routes */}
          <Route path="/dashboard" element={<ProtectedRoute requiredRole="investor"><Dashboard /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute requiredRole="investor"><AccountPage /></ProtectedRoute>} />
          <Route path="/activity" element={<ProtectedRoute requiredRole="investor"><ActivityPage /></ProtectedRoute>} />
          <Route path="/credit" element={<ProtectedRoute requiredRole="investor"><CreditPage /></ProtectedRoute>} />
          <Route path="/agents" element={<ProtectedRoute requiredRole="investor"><Agents /></ProtectedRoute>} />
          <Route path="/manage" element={<ProtectedRoute requiredRole="investor"><ManagePage /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute requiredRole="investor"><CalendarPage /></ProtectedRoute>} />
          <Route path="/policy-agent" element={<ProtectedRoute requiredRole="investor"><PolicyPage /></ProtectedRoute>} />
          <Route path="/taxation-agent" element={<ProtectedRoute requiredRole="investor"><TaxationPage /></ProtectedRoute>} />
          <Route path="/investor-onboarding" element={<ProtectedRoute requiredRole="investor"><InvestorOnboarding /></ProtectedRoute>} />
          <Route path="/investor-recommendations" element={<ProtectedRoute requiredRole="investor"><InvestorRecommendations /></ProtectedRoute>} />

          {/* Advisor Routes */}
          <Route path="/advisor-dashboard" element={<ProtectedRoute requiredRole="advisor"><AdvisorDashboard /></ProtectedRoute>} />

          {/* Shared Routes - No role requirement */}
          <Route path="/help" element={<ProtectedRoute><HelpCenterPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
