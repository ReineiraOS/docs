import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ScrollToTop from "./components/layout/ScrollToTop";
import DocsHub from "./pages/docs/DocsHub";
import SectionPage from "./pages/docs/SectionPage";
import NotFound from "./pages/NotFound";

// Get Started
import Overview from "./pages/docs/Overview";
import QuickStart from "./pages/docs/QuickStart";

// Project Status
import Status from "./pages/docs/Status";
import Risk from "./pages/docs/Risk";

// Settlement Standard (RSS)
import RssWhatIs from "./pages/docs/rss/RssWhatIs";
import RssConformance from "./pages/docs/rss/RssConformance";
import RssInterfaceSurface from "./pages/docs/rss/RssInterfaceSurface";
import RssVersioning from "./pages/docs/rss/RssVersioning";
import RssImplement from "./pages/docs/rss/RssImplement";

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

/** Redirect component for legacy /docs/* URLs */
function LegacyDocsRedirect() {
  const newPath = window.location.pathname.replace(/^\/docs/, "") || "/";
  return <Navigate to={newPath} replace />;
}

const App = () => (
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<DocsHub />} />
      {/* Get Started */}
      <Route path="/get-started/overview" element={<Overview />} />
      <Route path="/get-started/quick-start" element={<QuickStart />} />
      {/* Project Status */}
      <Route path="/status" element={<Status />} />
      <Route path="/risk" element={<Risk />} />
      {/* Settlement Standard (RSS) */}
      <Route path="/settlement-standard/what-is-rss" element={<RssWhatIs />} />
      <Route
        path="/settlement-standard/conformance"
        element={<RssConformance />}
      />
      <Route
        path="/settlement-standard/interface-surface"
        element={<RssInterfaceSurface />}
      />
      <Route
        path="/settlement-standard/versioning"
        element={<RssVersioning />}
      />
      <Route
        path="/settlement-standard/implement-rss"
        element={<RssImplement />}
      />
      {/* Developer Tools */}
      <Route
        path="/developer-tools/builder-journey"
        element={<BuilderJourney />}
      />
      <Route path="/developer-tools/atlas" element={<ReineiraAtlas />} />
      <Route path="/developer-tools/reineira-code" element={<ReineiraCode />} />
      <Route
        path="/developer-tools/platform-modules"
        element={<PlatformModules />}
      />
      {/* Legacy redirects */}
      <Route path="/get-started/atlas" element={<ReineiraAtlas />} />
      <Route path="/get-started/reineira-code" element={<ReineiraCode />} />
      {/* Learn */}
      <Route path="/learn/mental-model" element={<MentalModel />} />
      <Route path="/learn/architecture" element={<Architecture />} />
      <Route path="/learn/privacy-model" element={<PrivacyModel />} />
      <Route path="/learn/security" element={<Security />} />
      <Route path="/learn/resilience" element={<Resilience />} />
      <Route path="/learn/economics" element={<Economics />} />
      {/* Build */}
      <Route path="/build/escrow-lifecycle" element={<EscrowLifecycle />} />
      <Route path="/build/condition-resolvers" element={<ConditionPlugins />} />
      <Route
        path="/build/underwriter-policies"
        element={<InsurancePolicies />}
      />
      <Route path="/build/insurance-pools" element={<InsurancePools />} />
      <Route path="/build/cross-chain" element={<CrossChain />} />
      <Route path="/build/gas-performance" element={<GasPerformance />} />
      {/* Legacy redirects — Build */}
      <Route path="/build/condition-plugins" element={<ConditionPlugins />} />
      <Route path="/build/insurance-policies" element={<InsurancePolicies />} />
      <Route path="/operate/cross-chain" element={<CrossChain />} />
      {/* Operate */}
      <Route
        path="/operate/operator-network"
        element={<CoordinatorNetwork />}
      />
      <Route
        path="/operate/coordinator-network"
        element={<CoordinatorNetwork />}
      />{" "}
      {/* legacy */}
      <Route path="/operate/run-operator" element={<RunOperator />} />
      {/* API Reference */}
      <Route path="/reference/contracts" element={<Contracts />} />
      <Route path="/reference/sdk" element={<ReineiraSDK />} />
      <Route path="/reference/escrow-module" element={<EscrowModule />} />
      <Route path="/reference/insurance-module" element={<InsuranceModule />} />
      <Route path="/reference/mcp-server" element={<McpServer />} />
      {/* Dynamic fallbacks for section hubs */}
      <Route path="/:section" element={<SectionPage />} />
      <Route path="/:section/:page" element={<SectionPage />} />
      {/* Legacy /docs prefix redirect */}
      <Route path="/docs/*" element={<LegacyDocsRedirect />} />
      <Route path="/docs" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
