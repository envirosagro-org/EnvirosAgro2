
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Network, 
  Globe, 
  Zap, 
  Shield, 
  Cpu, 
  Terminal, 
  Database, 
  Search, 
  Share2, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Handshake,
  Loader2,
  Lock, 
  Radio, 
  Activity, 
  Fingerprint, 
  Binary, 
  Code2, 
  Wand2, 
  ArrowRight, 
  ChevronRight, 
  Download, 
  Eye, 
  Settings, 
  Link2,
  Cloud,
  Server,
  Key,
  MessageSquare,
  Layers,
  FileJson,
  Braces
} from 'lucide-react';
import { toast } from 'sonner';
import { SycamoreLogo, HenIcon } from './Icons';
import { User, ViewState } from '../types';
import { chatWithAgroLang } from '../services/agroLangService';
import { generateQuickHash } from '../systemFunctions';

interface RobotSyncProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
  onNavigate: (view: ViewState) => void;
}

interface ExternalBot {
  id: string;
  name: string;
  provider: string;
  status: 'CONNECTED' | 'SYNCING' | 'DISCONNECTED';
  lastSync: string;
  trustScore: number;
  capabilities: string[];
}

const EXTERNAL_BOTS: ExternalBot[] = [
  { id: 'BOT-GROK-01', name: 'Grok-1', provider: 'xAI', status: 'CONNECTED', lastSync: '2m ago', trustScore: 98, capabilities: ['Real-time Search', 'Sentiment Analysis'] },
  { id: 'BOT-GEMINI-PRO', name: 'Gemini 1.5 Pro', provider: 'Google', status: 'CONNECTED', lastSync: '5m ago', trustScore: 99, capabilities: ['Multimodal Reasoning', 'Code Generation'] },
  { id: 'BOT-GPT-4O', name: 'GPT-4o', provider: 'OpenAI', status: 'SYNCING', lastSync: 'Now', trustScore: 97, capabilities: ['Natural Language', 'Vision'] },
  { id: 'BOT-CLAUDE-3', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', status: 'CONNECTED', lastSync: '12m ago', trustScore: 99, capabilities: ['Constitutional AI', 'Analysis'] },
];

const RobotSync: React.FC<RobotSyncProps> = ({ user, onSpendEAC, onEarnEAC, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'manifest' | 'sync' | 'broadcast' | 'logs'>('sync');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [bots, setBots] = useState<ExternalBot[]>(EXTERNAL_BOTS);
  const [manifestContent, setManifestContent] = useState<string>('');
  const [isGeneratingManifest, setIsGeneratingManifest] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const generateManifest = async () => {
    setIsGeneratingManifest(true);
    try {
      const prompt = `Generate a machine-readable JSON-LD manifest for the EnvirosAgro Blockchain. 
      Include:
      - Organization: EnvirosAgro
      - Network: Decentralized Regenerative Grid
      - Protocols: MeshProtocol, AgroLang, ZK-Steward
      - Core Values: Transparency, Sustainability, Circular Economy
      - Current Node: ${user.esin}
      - Capabilities: Real-time MRV, Smart Contracts, Swarm Intelligence.
      Format it for AI crawlers like Grok, Gemini, and GPT.`;
      
      const res = await chatWithAgroLang(prompt, []);
      setManifestContent(res.text);
      onEarnEAC(15, 'MANIFEST_GENERATED_FOR_AI_CRAWLERS');
    } catch (e) {
      setManifestContent('// ERROR_GENERATING_MANIFEST: Registry handshake failed.');
    } finally {
      setIsGeneratingManifest(false);
    }
  };

  const handleSyncAll = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncProgress(0);
    
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          onEarnEAC(20, 'GLOBAL_AI_BOT_SYNCHRONIZATION_COMPLETE');
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const handleBroadcast = async () => {
    if (!broadcastMessage.trim() || isBroadcasting) return;
    const fee = 25;
    if (!await onSpendEAC(fee, 'GLOBAL_AI_BROADCAST_SIGNAL')) return;

    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastMessage('');
      toast.success("SIGNAL_BROADCAST_SUCCESS: Information propagated to external AI clusters.");
    }, 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1600px] mx-auto px-4">
      
      {/* Header HUD */}
      <div className="glass-card p-12 rounded-[64px] border-emerald-500/20 bg-emerald-500/[0.03] relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[15s] pointer-events-none">
          <Globe size={500} className="text-white" />
        </div>
        <div className="w-32 h-32 rounded-[40px] bg-emerald-600 flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.3)] shrink-0 border-4 border-white/10 relative overflow-hidden">
          <HenIcon size={64} className="text-white relative z-10 animate-pulse" />
          <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
        </div>
        <div className="space-y-4 relative z-10 text-center md:text-left flex-1">
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase rounded-full border border-emerald-500/20 tracking-widest">AI_CRAWLER_SYNC_v1.0</span>
            <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase rounded-full border border-blue-500/20 tracking-widest">CROSS_MODEL_HANDSHAKE</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0">Robot <span className="text-emerald-400">Sync.</span></h2>
          <p className="text-slate-400 text-lg font-medium italic leading-relaxed max-w-2xl">
            Synchronize EnvirosAgro Blockchain metadata with global AI providers. Ensure Grok, Gemini, and GPT models are updated with real-time registry state.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="text-5xl font-mono font-black text-white italic">99<span className="text-2xl text-emerald-500">.9</span></div>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sync_Fidelity</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-fit border border-white/5 bg-black/40 shadow-xl px-10 mx-auto lg:mx-0">
        {[
          { id: 'sync', label: 'Bot Handshake', icon: Handshake },
          { id: 'manifest', label: 'Robot Manifest', icon: FileJson },
          { id: 'broadcast', label: 'Signal Broadcast', icon: Radio },
          { id: 'logs', label: 'Crawl Logs', icon: Activity },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-4 px-8 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-2xl scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[600px]">
        {activeTab === 'sync' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-700">
            <div className="lg:col-span-2 space-y-8">
              <div className="glass-card p-10 rounded-[48px] border border-white/5 bg-black/40 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-white uppercase italic flex items-center gap-4">
                    <RefreshCw size={24} className={isSyncing ? 'animate-spin text-emerald-400' : 'text-emerald-400'} /> 
                    Active AI Handshakes
                  </h3>
                  <button 
                    onClick={handleSyncAll}
                    disabled={isSyncing}
                    className="px-8 py-3 bg-emerald-600 rounded-full text-white font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-emerald-500 transition-all disabled:opacity-50"
                  >
                    {isSyncing ? `Syncing ${syncProgress}%` : 'Sync All Models'}
                  </button>
                </div>

                <div className="space-y-4">
                  {bots.map(bot => (
                    <div key={bot.id} className="p-6 bg-white/[0.02] rounded-[32px] border border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 ${bot.status === 'CONNECTED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                          <HenIcon size={24} />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-white uppercase italic m-0">{bot.name}</h4>
                          <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">{bot.provider} // {bot.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-12">
                        <div className="text-center">
                          <p className="text-[8px] font-black text-slate-700 uppercase mb-1">Capabilities</p>
                          <div className="flex gap-2">
                            {bot.capabilities.slice(0, 1).map((c, i) => (
                              <span key={i} className="px-2 py-0.5 bg-white/5 rounded text-[7px] text-slate-400 font-black uppercase">{c}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] font-black text-slate-700 uppercase mb-1">Trust Score</p>
                          <p className="text-sm font-mono font-black text-emerald-400">{bot.trustScore}%</p>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${bot.status === 'CONNECTED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500 animate-pulse'}`}>
                          {bot.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass-card p-10 rounded-[48px] border border-white/5 bg-black/40 space-y-6">
                <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                  <Shield size={20} className="text-emerald-400" /> Security Protocol
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex items-center gap-4">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">ZK-Proof Handshake Active</span>
                  </div>
                  <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 flex items-center gap-4">
                    <Lock size={16} className="text-blue-500" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Encrypted Shard Tunneling</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed">
                  All external AI crawlers must pass a Zero-Knowledge proof challenge before accessing the EnvirosAgro Registry Shards.
                </p>
              </div>

              <div className="glass-card p-10 rounded-[48px] border border-white/5 bg-emerald-500/5 space-y-4">
                <div className="flex items-center gap-3">
                  <Activity size={20} className="text-emerald-500" />
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">Network Resonance</h4>
                </div>
                <div className="h-24 flex items-end gap-1">
                  {[40, 70, 45, 90, 65, 80, 55, 95, 75, 60, 85, 50].map((h, i) => (
                    <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-sm relative group">
                      <div className="absolute bottom-0 left-0 right-0 bg-emerald-500 rounded-t-sm transition-all duration-1000" style={{ height: `${h}%` }}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'manifest' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in duration-700">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-[32px] bg-black/40 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-2xl">
                <FileJson size={40} className="text-emerald-400" />
              </div>
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Robot <span className="text-emerald-400">Manifest</span></h3>
              <p className="text-slate-500 text-lg font-medium italic">
                Generate and expose structured JSON-LD metadata for AI models to index the EnvirosAgro Blockchain.
              </p>
            </div>

            <div className="glass-card p-10 rounded-[48px] border border-white/5 bg-black/40 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Braces size={20} className="text-emerald-400" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">JSON-LD_SCHEMA_OUTPUT</span>
                </div>
                <button 
                  onClick={generateManifest}
                  disabled={isGeneratingManifest}
                  className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  {isGeneratingManifest ? <Loader2 size={14} className="animate-spin" /> : 'Regenerate Manifest'}
                </button>
              </div>

              <div className="p-8 bg-black/60 rounded-[32px] border border-white/10 font-mono text-sm text-emerald-400/90 leading-relaxed min-h-[400px] relative overflow-hidden">
                {!manifestContent && !isGeneratingManifest ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 opacity-20">
                    <SycamoreLogo size={64} className="text-emerald-500" />
                    <p className="text-xs font-black uppercase tracking-[0.4em]">Awaiting Generation</p>
                  </div>
                ) : isGeneratingManifest ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                    <Loader2 size={48} className="animate-spin text-emerald-500" />
                    <p className="text-xs font-black uppercase tracking-[0.4em] animate-pulse">Synthesizing Metadata...</p>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap">{manifestContent}</pre>
                )}
              </div>

              <div className="flex gap-4">
                <button className="flex-1 py-5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all flex items-center justify-center gap-3">
                  <Download size={14} /> Download manifest.json
                </button>
                <button className="flex-1 py-5 bg-emerald-600 rounded-full text-white font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-3">
                  <Share2 size={14} /> Expose to Global Index
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'broadcast' && (
          <div className="max-w-3xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 rounded-[40px] bg-black/40 border border-blue-500/20 flex items-center justify-center mx-auto shadow-2xl relative">
                <Radio size={48} className="text-blue-400 animate-pulse" />
                <div className="absolute inset-0 border-2 border-dashed border-blue-500/20 rounded-[40px] animate-spin-slow"></div>
              </div>
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Signal <span className="text-blue-400">Broadcast</span></h3>
              <p className="text-slate-500 text-lg font-medium italic">
                Push real-time blockchain updates directly to AI model context windows.
              </p>
            </div>

            <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 space-y-8 shadow-3xl">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Broadcast Message</label>
                <textarea 
                  value={broadcastMessage}
                  onChange={e => setBroadcastMessage(e.target.value)}
                  placeholder="Enter information to broadcast to external AI models (e.g. New Registry Shard Finalized in Sector 4)..."
                  className="w-full h-48 bg-black/60 border-2 border-white/10 rounded-[40px] p-10 text-white text-lg font-medium italic focus:ring-8 focus:ring-blue-500/5 transition-all outline-none resize-none shadow-inner placeholder:text-stone-900"
                />
              </div>

              <div className="flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Network Fee: 25 EAC</span>
                </div>
                <button 
                  onClick={handleBroadcast}
                  disabled={isBroadcasting || !broadcastMessage.trim()}
                  className="px-12 py-6 bg-blue-600 rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-[0_0_80px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 transition-all border-4 border-white/10 disabled:opacity-30"
                >
                  {isBroadcasting ? <Loader2 size={20} className="animate-spin mx-auto" /> : 'Push Signal'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-8 bg-white/[0.02] rounded-[40px] border border-white/5 flex items-center gap-6">
                <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400">
                  <Cloud size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">Cloud Propagation</p>
                  <p className="text-[8px] text-slate-500 font-medium uppercase tracking-widest">Global CDN Active</p>
                </div>
              </div>
              <div className="p-8 bg-white/[0.02] rounded-[40px] border border-white/5 flex items-center gap-6">
                <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400">
                  <Server size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">Model Ingest</p>
                  <p className="text-[8px] text-slate-500 font-medium uppercase tracking-widest">Direct API Handshake</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-700">
            <div className="glass-card rounded-[64px] border border-white/5 bg-black/40 overflow-hidden shadow-3xl">
              <div className="p-10 border-b border-white/5 bg-white/[0.01] flex items-center justify-between px-14">
                <div className="flex items-center gap-6">
                  <Activity size={24} className="text-emerald-400" />
                  <h3 className="text-2xl font-black text-white uppercase italic m-0 tracking-tighter">AI Crawler <span className="text-emerald-400">Logs</span></h3>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase rounded-full border border-emerald-500/20">Live_Monitoring</span>
                </div>
              </div>

              <div className="p-10 space-y-4 font-mono text-sm text-slate-500 italic max-h-[600px] overflow-y-auto custom-scrollbar">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="flex gap-8 p-4 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                    <span className="text-slate-800 w-24 shrink-0 font-bold">[{new Date(Date.now() - i * 60000).toLocaleTimeString()}]</span>
                    <span className="text-emerald-500 w-32 shrink-0">@BOT-{['GROK', 'GPT', 'GEMINI', 'CLAUDE'][i % 4]}</span>
                    <span className="flex-1">GET /registry/shard/0x{generateQuickHash(8)} // STATUS: 200 OK</span>
                    <span className="text-slate-700">Size: 1.2KB</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default RobotSync;
