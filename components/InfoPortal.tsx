
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
  MessageSquare,
  // Fix: Added missing Fingerprint icon import from lucide-react
  Fingerprint
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
                    { l: 'I', t: 'Industry', d: 'Industrial data ledgers and blockchain registries.' },
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
          <div className="p-12 space-y-10 animate-in fade-in duration-500">
             <div className="space-y-4">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Steward Code <span className="text-blue-400">of Conduct</span></h2>
                <p className="text-slate-400 text-lg leading-relaxed italic">"Integrity is the bedrock of decentralized consensus."</p>
             </div>
             
             <div className="space-y-8">
                {[
                  { title: "Veracity of Evidence", desc: "All spectral scans and soil logs must be captured using verified hardware relays or approved third-party nodes." },
                  { title: "Economic Fair Play", desc: "Collateralized projects must maintain the 50% ratio. Gaming the multiplier via falsified C(a) inputs triggers auto-slashing." },
                  { title: "Community Vouching", desc: "Vouching for a node is a scientific commitment. False vouches decrease your regional reputation score." },
                ].map(g => (
                  <div key={g.title} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-blue-500/20 transition-all">
                     <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{g.title}</h4>
                     <p className="text-slate-500 text-sm leading-relaxed">{g.desc}</p>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="p-12 space-y-10 animate-in fade-in duration-500">
             <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center border border-blue-500/20 shadow-2xl">
                   <Lock className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                   <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Identity & ZK-Privacy</h2>
                   <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mt-1">
                      <ShieldCheck className="w-3 h-3" /> Zero-Knowledge Protocols
                   </p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <h3 className="text-xl font-bold text-white flex items-center gap-3">
                      <Fingerprint className="w-6 h-6 text-emerald-400" />
                      ESIN Anonymity
                   </h3>
                   <p className="text-slate-400 leading-relaxed">
                      While your ESIN is unique, the EnvirosAgro network uses ZK-SNARKs to prove your sustainability metrics to the marketplace without revealing your specific farm location or legal name to the public ledger.
                   </p>
                </div>
                <div className="space-y-6">
                   <h3 className="text-xl font-bold text-white flex items-center gap-3">
                      <Zap className="w-6 h-6 text-amber-500" />
                      Data Sovereignty
                   </h3>
                   <p className="text-slate-400 leading-relaxed">
                      Farmers retain 100% ownership of their raw telemetry. Only the derived 'Proofs of Sustainability' are recorded on the industrial blockchain for EAC minting.
                   </p>
                </div>
             </div>

             <div className="mt-10 p-8 glass-card rounded-[32px] border-white/10 bg-indigo-500/5">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Institutional Compliance</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                   EnvirosAgro is compliant with global ESG standards and GDPR-Agri mandates. Our data shards are stored across 1,200 decentralized validator nodes to ensure zero downtime and permanent immutability.
                </p>
             </div>
          </div>
        )}
      </div>

      {/* Support Chat Overlay (Keep as is) */}
      <div className="fixed bottom-10 right-10 z-[100]">
        {!showSupport ? (
          <button 
            onClick={() => setShowSupport(true)}
            className="w-16 h-16 agro-gradient rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-900/40 hover:scale-110 active:scale-95 transition-all animate-bounce"
          >
            <MessageSquare className="w-8 h-8" />
          </button>
        ) : (
          <div className="w-[400px] h-[550px] glass-card rounded-[40px] border-emerald-500/40 bg-[#050706] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
             {/* Support Header */}
             <div className="p-6 bg-emerald-600/10 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                      <Bot className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-widest">Governance AI</h4>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Online // Registry 01</p>
                   </div>
                </div>
                <button onClick={() => setShowSupport(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                   <X className="w-5 h-5" />
                </button>
             </div>

             {/* Support Messages */}
             <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {supportChat.map((chat, i) => (
                  <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[85%] p-4 rounded-3xl text-xs leading-relaxed ${chat.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/5 text-slate-300 border border-white/10 rounded-tl-none italic'}`}>
                        {chat.text}
                     </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                     <div className="bg-white/5 border border-white/10 p-4 rounded-3xl rounded-tl-none flex gap-1">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-200"></div>
                     </div>
                  </div>
                )}
             </div>

             {/* Support Input */}
             <div className="p-6 border-t border-white/5 bg-black/40">
                <div className="relative">
                   <input 
                    type="text" 
                    value={supportInput}
                    onChange={e => setSupportInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSupportSend()}
                    placeholder="Ask about protocol, ESIN, or dispute..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40" 
                   />
                   <button 
                    onClick={handleSupportSend}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-emerald-500 rounded-xl text-white shadow-lg hover:bg-emerald-400 transition-all"
                   >
                      <Send className="w-4 h-4" />
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoPortal;
