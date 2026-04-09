import React from 'react';
import { ViewState } from '../types';

const Dashboard = React.lazy(() => import('./Dashboard'));
const Sustainability = React.lazy(() => import('./Sustainability'));
const Economy = React.lazy(() => import('./Economy'));
const Industrial = React.lazy(() => import('./Industrial'));
const Intelligence = React.lazy(() => import('./Intelligence'));
const Community = React.lazy(() => import('./Community'));
const Explorer = React.lazy(() => import('./Explorer'));
const Ecosystem = React.lazy(() => import('./Ecosystem'));
const MediaHub = React.lazy(() => import('./MediaHub'));
const InfoPortal = React.lazy(() => import('./InfoPortal'));
const Login = React.lazy(() => import('./Login'));
const AgroWallet = React.lazy(() => import('./AgroWallet'));
const UserProfile = React.lazy(() => import('./UserProfile'));
const InvestorPortal = React.lazy(() => import('./InvestorPortal'));
const VendorPortal = React.lazy(() => import('./VendorPortal'));
const NetworkIngest = React.lazy(() => import('./NetworkIngest'));
const HardwareRegistry = React.lazy(() => import('./HardwareRegistry'));
const DeviceControl = React.lazy(() => import('./DeviceControl'));
const ToolsSection = React.lazy(() => import('./ToolsSection'));
const LiveVoiceBridge = React.lazy(() => import('./LiveVoiceBridge'));
const Channelling = React.lazy(() => import('./Channelling'));
const Governance = React.lazy(() => import('./Governance'));
const CarbonCredits = React.lazy(() => import('./CarbonCredits'));
const Traceability = React.lazy(() => import('./Traceability'));
const Marketplace = React.lazy(() => import('./Marketplace'));
const NexusCRM = React.lazy(() => import('./NexusCRM'));
const AgroMultimediaGenerator = React.lazy(() => import('./AgroMultimediaGenerator'));
const CostAccountingDashboard = React.lazy(() => import('./CostAccountingDashboard'));
const InternalControlDashboard = React.lazy(() => import('./InternalControlDashboard'));
const ImpactDashboard = React.lazy(() => import('./ImpactDashboard'));
const TraceabilityMap = React.lazy(() => import('./TraceabilityMap'));
const TelemetryHub = React.lazy(() => import('./TelemetryHub'));
const SwarmOrchestrator = React.lazy(() => import('./SwarmOrchestrator'));
const MRVEngine = React.lazy(() => import('./MRVEngine'));
const ReputationDashboard = React.lazy(() => import('./ReputationDashboard'));
const EscrowPortal = React.lazy(() => import('./EscrowPortal'));

export const getComponentForView = (
  view: ViewState,
  props: any
): React.ReactNode => {
  switch (view) {
    case 'dashboard': return <Dashboard {...props} />;
    case 'sustainability': return <Sustainability {...props} />;
    case 'economy': return <Economy {...props} />;
    case 'industrial': return <Industrial {...props} />;
    case 'intelligence': return <Intelligence {...props} />;
    case 'community': return <Community {...props} />;
    case 'explorer': return <Explorer {...props} />;
    case 'ecosystem': return <Ecosystem {...props} />;
    case 'media': return <MediaHub {...props} />;
    case 'info': return <InfoPortal {...props} />;
    case 'auth': return <Login {...props} />;
    case 'wallet': return <AgroWallet {...props} />;
    case 'profile': return <UserProfile {...props} />;
    case 'investor': return <InvestorPortal {...props} />;
    case 'vendor': return <VendorPortal {...props} />;
    case 'ingest': return <NetworkIngest {...props} />;
    case 'hardware_registry': return <HardwareRegistry {...props} />;
    case 'device_control': return <DeviceControl {...props} />;
    case 'tools': return <ToolsSection {...props} />;
    case 'live_voice_bridge': return <LiveVoiceBridge {...props} />;
    case 'channelling': return <Channelling {...props} />;
    case 'governance': return <Governance {...props} />;
    case 'carbon_credits': return <CarbonCredits {...props} />;
    case 'traceability': return <Traceability {...props} />;
    case 'marketplace': return <Marketplace {...props} />;
    case 'crm': return <NexusCRM {...props} />;
    case 'multimedia_generator': return <AgroMultimediaGenerator {...props} />;
    case 'cost_accounting': return <CostAccountingDashboard {...props} />;
    case 'internal_control': return <InternalControlDashboard {...props} />;
    case 'impact_dashboard': return <ImpactDashboard {...props} />;
    case 'traceability_map': return <TraceabilityMap {...props} />;
    case 'telemetry_hub': return <TelemetryHub {...props} />;
    case 'swarm_orchestrator': return <SwarmOrchestrator {...props} />;
    case 'mrv_engine': return <MRVEngine {...props} />;
    case 'reputation_dashboard': return <ReputationDashboard {...props} />;
    case 'escrow_portal': return <EscrowPortal {...props} />;
    default: return <Dashboard {...props} />;
  }
};
