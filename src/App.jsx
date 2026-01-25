import { BrowserRouter, Routes, Route } from "react-router-dom";
import CredenceLandingPage from "./components/FincogniaLandingPage";
import Dashboard from "./components/Dashboard";
import CreditPage from "./components/CreditPage";
import Agents from "./components/Agents";
import PolicyPage from "./components/PolicyPage";
import TaxationPage from "./components/TaxationPage";
import AccountPage from "./components/AccountPage";
import ActivityPage from "./components/ActivityPage";
import CalendarPage from "./components/CalendarPage";
import ManagePage from "./components/ManagePage";
import HelpCenterPage from "./components/HelpCenterPage";
import SettingsPage from "./components/SettingsPage";
import Layout from "./Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<CredenceLandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/credit" element={<CreditPage />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/manage" element={<ManagePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/policy-agent" element={<PolicyPage />} />
          <Route path="/taxation-agent" element={<TaxationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
