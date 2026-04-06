import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/layout/ScrollToTop";
import Index from "./pages/Index";
import DocsHub from "./pages/docs/DocsHub";
import SectionPage from "./pages/docs/SectionPage";
import NotFound from "./pages/NotFound";

// Get Started
import Overview from "./pages/docs/Overview";
import QuickStart from "./pages/docs/QuickStart";

// Developer Tools
import BuilderJourney from "./pages/docs/BuilderJourney";
import ReineiraAtlas from "./pages/docs/ReineiraAtlas";
import ReineiraCode from "./pages/docs/ReineiraCode";
import PlatformModules from "./pages/docs/PlatformModules";

// Learn
import MentalModel from "./pages/docs/MentalModel";
import Architecture from "./pages/docs/Architecture";
import PrivacyModel from "./pages/docs/PrivacyModel";
import Security from "./pages/docs/Security";
import Resilience from "./pages/docs/Resilience";

import Economics from "./pages/docs/Economics";

// Build
import EscrowLifecycle from "./pages/docs/EscrowLifecycle";
import ConditionPlugins from "./pages/docs/ConditionPlugins";
import InsurancePolicies from "./pages/docs/InsurancePolicies";
import InsurancePools from "./pages/docs/InsurancePools";
import GasPerformance from "./pages/docs/GasPerformance";

// Operate
import CrossChain from "./pages/docs/CrossChain";
import CoordinatorNetwork from "./pages/docs/CoordinatorNetwork";
import RunOperator from "./pages/docs/RunOperator";

// API Reference
import Contracts from "./pages/docs/Contracts";
import ReineiraSDK from "./pages/docs/ReineiraSDK";
import EscrowModule from "./pages/docs/EscrowModule";
import InsuranceModule from "./pages/docs/InsuranceModule";
import McpServer from "./pages/docs/McpServer";

const App = () => (
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/docs" element={<DocsHub />} />

      {/* Get Started */}
      <Route path="/docs/get-started/overview" element={<Overview />} />
      <Route path="/docs/get-started/quick-start" element={<QuickStart />} />

      {/* Developer Tools */}
      <Route
        path="/docs/developer-tools/builder-journey"
        element={<BuilderJourney />}
      />
      <Route path="/docs/developer-tools/atlas" element={<ReineiraAtlas />} />
      <Route
        path="/docs/developer-tools/reineira-code"
        element={<ReineiraCode />}
      />
      <Route
        path="/docs/developer-tools/platform-modules"
        element={<PlatformModules />}
      />

      {/* Legacy redirects */}
      <Route path="/docs/get-started/atlas" element={<ReineiraAtlas />} />
      <Route
        path="/docs/get-started/reineira-code"
        element={<ReineiraCode />}
      />

      {/* Learn */}
      <Route path="/docs/learn/mental-model" element={<MentalModel />} />
      <Route path="/docs/learn/architecture" element={<Architecture />} />
      <Route path="/docs/learn/privacy-model" element={<PrivacyModel />} />
      <Route path="/docs/learn/security" element={<Security />} />
      <Route path="/docs/learn/resilience" element={<Resilience />} />

      <Route path="/docs/learn/economics" element={<Economics />} />

      {/* Build */}
      <Route
        path="/docs/build/escrow-lifecycle"
        element={<EscrowLifecycle />}
      />
      <Route
        path="/docs/build/condition-plugins"
        element={<ConditionPlugins />}
      />
      <Route
        path="/docs/build/underwriter-policies"
        element={<InsurancePolicies />}
      />
      <Route path="/docs/build/insurance-pools" element={<InsurancePools />} />
      <Route path="/docs/build/cross-chain" element={<CrossChain />} />
      <Route path="/docs/build/gas-performance" element={<GasPerformance />} />

      {/* Legacy redirects — Build */}
      <Route
        path="/docs/build/insurance-policies"
        element={<InsurancePolicies />}
      />
      <Route path="/docs/operate/cross-chain" element={<CrossChain />} />

      {/* Operate */}
      <Route
        path="/docs/operate/operator-network"
        element={<CoordinatorNetwork />}
      />
      <Route
        path="/docs/operate/coordinator-network"
        element={<CoordinatorNetwork />}
      /> {/* legacy */}
      <Route path="/docs/operate/run-operator" element={<RunOperator />} />

      {/* API Reference */}
      <Route path="/docs/reference/contracts" element={<Contracts />} />
      <Route path="/docs/reference/sdk" element={<ReineiraSDK />} />
      <Route path="/docs/reference/escrow-module" element={<EscrowModule />} />
      <Route
        path="/docs/reference/insurance-module"
        element={<InsuranceModule />}
      />
      <Route path="/docs/reference/mcp-server" element={<McpServer />} />

      {/* Dynamic fallbacks for section hubs */}
      <Route path="/docs/:section" element={<SectionPage />} />
      <Route path="/docs/:section/:page" element={<SectionPage />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
