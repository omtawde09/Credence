import { BrowserRouter, Routes, Route } from "react-router-dom";
import CredenceLandingPage from "./components/FincogniaLandingPage";
import Dashboard from "./components/Dashboard";
import CreditPage from "./components/CreditPage";
import Agents from "./components/Agents";
import PolicyPage from "./components/PolicyPage";
import TaxationPage from "./components/TaxationPage";
import Layout from "./Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<CredenceLandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/credit" element={<CreditPage />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/policy-agent" element={<PolicyPage />} />
          <Route path="/taxation-agent" element={<TaxationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
