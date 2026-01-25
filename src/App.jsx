import { BrowserRouter, Routes, Route } from "react-router-dom";
import CredenceLandingPage from "./Components/FincogniaLandingPage";
import Dashboard from "./Components/Dashboard";
import CreditPage from "./Components/CreditPage";
import Agents from "./Components/Agents";
import PolicyPage from "./Components/PolicyPage";
import TaxationPage from "./Components/TaxationPage";
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
