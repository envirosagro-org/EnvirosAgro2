
import React, { useState } from 'react';
import { 
  Info, 
  Handshake, 
  ShieldCheck, 
  ChevronRight, 
  Scale, 
  BookOpen, 
  Globe, 
  Zap, 
  Users, 
  Lock, 
  FileText,
  AlertTriangle,
  HeartHandshake,
  X,
  Loader2,
  Send,
  Bot,
  User as UserIcon,
  MessageSquare
} from 'lucide-react';
import { chatWithAgroExpert } from '../services/geminiService';

const InfoPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'about' | 'guidelines' | 'privacy'>('about');
  const [showSupport, setShowSupport] = useState(false);
  const [supportChat, setSupportChat] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: "Hello Steward. I am the EOS Governance Assistant. How can I resolve your network dispute or protocol question today?" }
  ]);
  const [supportInput, setSupportInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const tabs = [
    { id: 'about', label: 'The Mission', icon: Info },
    { id: 'guidelines', label: 'Code of Conduct', icon: Handshake },
    { id: 'privacy', label: 'Privacy & Data', icon: ShieldCheck },
  ];

  const handleSupportSend = async () => {
    if (!supportInput.trim()) return;
    const msg = supportInput.trim();
    setSupportInput('');
    setSupportChat(prev => [...prev, { role: 'user', text: msg }]);
    setIsTyping(true);

    const response = await chatWithAgroExpert(msg, supportChat.map(c => ({ role: c.role === 'bot' ? 'model' : 'user', parts: [{ text: c.text }] })));
    setSupportChat(prev => [...prev, { role: 'bot', text: response.text }]);
    setIsTyping(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Navigation */}
      <div className="flex gap-4 p-1 glass-card rounded-2xl w-fit mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-[40px] overflow-hidden">
        {activeTab === 'about' && (
          <div className="p-12 space-y-10 animate-in fade-in duration-500">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">EnvirosAgro Ecosystem</span>
              <h2 className="text-5xl font-black text-white leading-tight">Decentralized <span className="text-emerald-400">Sustainability</span> at Scale</h2>
              <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
                EnvirosAgro is a next-generation blockchain protocol built to revolutionize global agriculture using the <strong>EOS Framework</strong> and <strong>SEHTI Calculus</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t border-white/5">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Globe className="w-6 h-6 text-emerald-400" />
                  Our Core Vision
                </h3>
                <p className="text-slate-400 leading-loose">
                  We believe that agriculture is the intersection of all human progress. By quantifying sustainability through the <strong>Agricultural Code C(a)</strong>, we enable a transparent economy where ecological stewardship is the primary currency.
                </p>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                  <p className="text-sm text-emerald-400 font-mono font-bold leading-relaxed">
                    "True sustainability is the equilibrium between Direct Nature (Dn) and Human Adoption (r)."
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Scale className="w-6 h-6 text-blue-400" />
                  The SEHTI Pillars
                </h3>
                <div className="space-y-4">
                  {[
                    { l: 'S', t: 'Societal', d: 'Anthropological lineages and community welfare.' },
                    { l: 'E', t: 'Environmental', d: 'Stewardship of soil, water, and biodiversity.' },
                    { l: 'H', t: 'Human', d: 'Health, psychology, and behavioral agro-outputs.' },
                    { l: 'T', t: 'Technological', d: 'IoT, AI, and autonomous precision monitoring.' },
                    { l: 'I', t: 'Informational', d: 'Blockchain registries and real-time market data.' },
                  ].map((p) => (
                    <div key={p.t} className="flex gap-4 items-start">
                      <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-emerald-400 border border-white/5 shrink-0">{p.l}</span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{p.t}</h4>
                        <p className="text-xs text-slate-500">{p.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guidelines' && (
          <div className="p-12 space-y-12 animate-in fade-in duration-500">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Code of Participation</span>
              <h2 className="text-4xl font-black text-white">Registry <span className="text-amber-500">Integrity</span> Standards</h2>
              <p className="text-slate-400 leading-relaxed max-w-2xl">
                Participation in the EnvirosAgro network requires strict adherence to evidence-based reporting and the collective stewardship of the EOS framework.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: Zap, 
                  title: 'Evidence Integrity', 
                  desc: 'All uploads (spectral scans, pH logs) must be grounded in physical reality. Fabrication of telemetry leads to immediate EAC slashing and node de-verification.',
                  color: 'text-amber-400'
                },
                { 
                  icon: Users, 
                  title: 'Societal Respect', 
                  desc: 'Align with the Societal Thrust (S). Respect anthropological lineages and prioritize community heritage over industrial extraction.',
                  color: 'text-blue-400'
                },
                { 
                  icon: ShieldCheck, 
                  title: 'Reaction Mining', 
                  desc: 'When verifying nodes, use scientific objectivity. Refuting valid research for economic gain is a violation of the network consensus.',
                  color: 'text-emerald-400'
                }
              ].map((g, i) => (
                <div key={i} className="glass-card p-8 rounded-[32px] border-white/5 space-y-4">
                  <div className={`p-4 bg-white/5 rounded-2xl w-fit ${g.color}`}>
                    <g.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white">{g.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{g.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-8 bg-rose-500/5 border border-rose-500/20 rounded-[32px] flex items-start gap-6">
              <AlertTriangle className="w-10 h-10 text-rose-500 shrink-0" />
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Zero Tolerance for "Green-Washing"</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  EnvirosAgro uses autonomous "Sentinel Nodes" to cross-reference satellite data with user uploads. Persistent misalignment between "Digital Twin" predictions and user-reported evidence will trigger an automatic audit.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="p-12 space-y-12 animate-in fade-in duration-500">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Data Protection Protocol</span>
              <h2 className="text-4xl font-black text-white">ZK-Privacy & <span className="text-blue-400">Telemetry</span> Sovereignty</h2>
              <p className="text-slate-400 leading-relaxed max-w-2xl">
                We protect farmer privacy through advanced cryptography while ensuring the world can verify your sustainability achievements.
              </p>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-10 bg-white/5 rounded-[40px] border border-white/10 space-y-6">
                  <Lock className="w-10 h-10 text-emerald-400" />
                  <h4 className="text-2xl font-bold text-white">Zero-Knowledge Proofs</h4>
                  <p className="text-sm text-slate-400 leading-loose">
                    Your exact farm location and private identifiers are never revealed on-chain. We use <strong>ZK-SNARKs</strong> to prove that your sustainability score meets high-resilience thresholds without exposing the raw telemetry data.
                  </p>
                </div>

                <div className="p-10 bg-white/5 rounded-[40px] border border-white/10 space-y-6">
                  <FileText className="w-10 h-10 text-blue-400" />
                  <h4 className="text-2xl font-bold text-white">Telemetry Ownership</h4>
                  <p className="text-sm text-slate-400 leading-loose">
                    You own the <strong>Agricultural Code C(a)</strong> generated by your land. EnvirosAgro acts only as the decentralized notary. Data can be exported at any time or used as collateral for EAC-based financing.
                  </p>
                </div>
              </div>

              <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-6">
                 <h4 className="text-xl font-bold text-white flex items-center gap-3">
                   <ShieldCheck className="w-5 h-5 text-emerald-400" />
                   Informational (I) Thrust Compliance
                 </h4>
                 <div className="space-y-4">
                    <p className="text-sm text-slate-500 leading-relaxed">
                      All data storage aligns with the Informational Thrust of the SEHTI framework:
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {[
                         'Immutable timestamping for audit trails.',
                         'Encrypted peer-to-peer data relay.',
                         'Decentralized storage on the Industrial Cloud.',
                         'User-controlled visibility toggles for market data.'
                       ].map((item, i) => (
                         <li key={i} className="flex items-center gap-3 text-xs text-slate-300">
                           <ChevronRight className="w-4 h-4 text-emerald-400" />
                           {item}
                         </li>
                       ))}
                    </ul>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Support */}
      <div className="flex flex-col md:flex-row items-center justify-between p-10 glass-card rounded-[40px] border-emerald-500/20 bg-emerald-500/5">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/40">
            <HeartHandshake className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-white">Need Governance Support?</h4>
            <p className="text-xs text-slate-500">Connect with the EnvirosAgro DAO for protocol disputes.</p>
          </div>
        </div>
        <button 
          onClick={() => setShowSupport(true)}
          className="mt-6 md:mt-0 px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Open Support Ticket
        </button>
      </div>

      {/* Support Modal */}
      {showSupport && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#050706]/95 backdrop-blur-2xl" onClick={() => setShowSupport(false)}></div>
          <div className="relative z-10 w-full max-w-2xl glass-card p-1 rounded-[40px] border-emerald-500/20 overflow-hidden flex flex-col h-[70vh]">
            <div className="p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-2xl">
                  <Bot className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Governance Support</h3>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Relay Node</p>
                </div>
              </div>
              <button onClick={() => setShowSupport(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide bg-black/40">
              {supportChat.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'bot' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500 text-white'}`}>
                      {msg.role === 'bot' ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed ${msg.role === 'bot' ? 'bg-white/5 text-slate-300 border border-white/5 rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none shadow-lg'}`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                   <div className="flex gap-3 items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-pulse">
                         <Bot className="w-4 h-4" />
                      </div>
                      <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                   </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-white/[0.02] border-t border-white/5">
              <div className="relative">
                <input 
                  type="text"
                  value={supportInput}
                  onChange={(e) => setSupportInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSupportSend()}
                  placeholder="State your network dispute or inquiry..."
                  className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
                <button 
                  onClick={handleSupportSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 rounded-xl text-white hover:bg-emerald-500 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="text-center text-[10px] text-slate-700 font-mono uppercase tracking-[0.3em]">
        EOS Framework Legal Registry v3.1.2 // HASH_0x882_AUDITED
      </p>
    </div>
  );
};

export default InfoPortal;
