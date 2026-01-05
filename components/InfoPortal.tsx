
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
  Fingerprint,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  // Added missing ArrowRight icon
  ArrowRight
} from 'lucide-react';
import { chatWithAgroExpert } from '../services/geminiService';

const InfoPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'about' | 'guidelines' | 'privacy' | 'contact'>('about');
  const [showSupport, setShowSupport] = useState(false);
  const [supportChat, setSupportChat] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: "Hello Steward. I am the EnvirosAgro™ Governance Assistant. How can I resolve your network dispute or Five Thrusts™ protocol question today?" }
  ]);
  const [supportInput, setSupportInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const tabs = [
    { id: 'about', label: 'The Mission', icon: Info },
    { id: 'guidelines', label: 'Code of Conduct', icon: Handshake },
    { id: 'privacy', label: 'Privacy & Data', icon: ShieldCheck },
    { id: 'contact', label: 'Contact & HQ', icon: Globe },
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
      <div className="flex flex-wrap gap-4 p-1 glass-card rounded-2xl w-fit mx-auto">
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
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">EnvirosAgro™ Ecosystem</span>
              <h2 className="text-5xl font-black text-white leading-tight">Decentralized <span className="text-emerald-400">Sustainability</span> at Scale</h2>
              <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
                EnvirosAgro™ is a next-generation blockchain protocol built to revolutionize global agriculture using the <strong>EOS Framework</strong> and <strong>Five Thrusts™</strong> calculus.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t border-white/5">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Globe className="w-6 h-6 text-emerald-400" />
                  Our Core Vision
                </h3>
                <p className="text-slate-400 leading-loose">
                  We believe that agriculture is the intersection of all human progress. By quantifying sustainability through the <strong>C(a)™ Agro Code</strong>, we enable a transparent economy where ecological stewardship is the primary currency.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Scale className="w-6 h-6 text-blue-400" />
                  The Five Thrusts™
                </h3>
                <div className="space-y-4">
                  {[
                    { l: 'S', t: 'Societal', d: 'Anthropological lineages and community welfare.' },
                    { l: 'E', t: 'Environmental', d: 'Stewardship of soil, water, and biodiversity.' },
                    { l: 'H', t: 'Human', d: 'Health, psychology, and behavioral agro-outputs.' },
                    { l: 'T', t: 'Technological', d: 'IoT, AI, and autonomous m™ Constant monitoring.' },
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
                <p className="text-slate-400 text-lg leading-relaxed italic">"Integrity is the bedrock of EnvirosAgro™ decentralized consensus."</p>
             </div>
             
             <div className="space-y-8">
                {[
                  { title: "Veracity of Evidence", desc: "All spectral scans and soil logs must be captured using verified hardware relays or approved third-party nodes." },
                  { title: "Economic Fair Play", desc: "Collateralized projects must maintain the 50% ratio. Gaming the multiplier via falsified C(a)™ Agro Code inputs triggers auto-slashing." },
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
                      While your ESIN is unique, the EnvirosAgro™ network uses ZK-SNARKs to prove your C(a)™ Agro Code metrics to the marketplace without revealing farm location.
                   </p>
                </div>
                <div className="space-y-6">
                   <h3 className="text-xl font-bold text-white flex items-center gap-3">
                      <Zap className="w-6 h-6 text-amber-500" />
                      Data Sovereignty
                   </h3>
                   <p className="text-slate-400 leading-relaxed">
                      Farmers retain 100% ownership of their raw telemetry and m™ Time Signatures. Only proofs are recorded on the industrial blockchain.
                   </p>
                </div>
             </div>

             <div className="mt-10 p-8 glass-card rounded-[32px] border-white/10 bg-indigo-500/5">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Institutional Compliance</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                   EnvirosAgro™ is compliant with global ESG standards and GDPR-Agri mandates. Our data shards are stored across decentralized validator nodes.
                </p>
             </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="p-12 space-y-12 animate-in fade-in duration-500">
             <div className="space-y-4">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Contact & <span className="text-emerald-400">Hub HQ</span></h2>
                <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">Connect with the EnvirosAgro industrial core for administrative inquiries or governance disputes.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-card p-8 rounded-[40px] border-emerald-500/10 bg-emerald-500/5 space-y-6 flex flex-col group hover:border-emerald-500/30 transition-all">
                   <div className="w-16 h-16 rounded-[24px] bg-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-xl group-hover:scale-110 transition-transform">
                      <MapPin className="w-8 h-8" />
                   </div>
                   <div className="space-y-2 flex-1">
                      <h4 className="text-xl font-bold text-white uppercase tracking-widest">Headquarters</h4>
                      <p className="text-slate-400 text-sm font-mono leading-relaxed">
                         9X6C+P6, Kiriaini<br/>
                         Global Zone Node
                      </p>
                   </div>
                   <a 
                    href="https://www.google.com/maps/search/9X6C%2BP6,+Kiriaini" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-emerald-600 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all"
                   >
                      <Globe className="w-4 h-4" /> Open in Google Maps
                   </a>
                </div>

                <div className="glass-card p-8 rounded-[40px] border-blue-500/10 bg-blue-500/5 space-y-6 flex flex-col group hover:border-blue-500/30 transition-all">
                   <div className="w-16 h-16 rounded-[24px] bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-xl group-hover:scale-110 transition-transform">
                      <Phone className="w-8 h-8" />
                   </div>
                   <div className="space-y-2 flex-1">
                      <h4 className="text-xl font-bold text-white uppercase tracking-widest">Line Number</h4>
                      <p className="text-slate-400 text-lg font-mono font-black">0740161447</p>
                      <p className="text-[10px] text-slate-500 uppercase font-black">24/7 NETWORK SUPPORT</p>
                   </div>
                   <a 
                    href="tel:0740161447"
                    className="w-full py-4 bg-blue-600 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-blue-500 transition-all"
                   >
                      <Zap className="w-4 h-4 fill-current" /> Initialize Call
                   </a>
                </div>

                <div className="glass-card p-8 rounded-[40px] border-indigo-500/10 bg-indigo-500/5 space-y-6 flex flex-col group hover:border-indigo-500/30 transition-all">
                   <div className="w-16 h-16 rounded-[24px] bg-indigo-500/10 flex items-center justify-center text-indigo-400 shadow-xl group-hover:scale-110 transition-transform">
                      <Mail className="w-8 h-8" />
                   </div>
                   <div className="space-y-2 flex-1">
                      <h4 className="text-xl font-bold text-white uppercase tracking-widest">Official Email</h4>
                      <p className="text-slate-400 text-sm font-mono break-all leading-relaxed">envirosagro.com@gmail.com</p>
                   </div>
                   <a 
                    href="mailto:envirosagro.com@gmail.com"
                    className="w-full py-4 bg-indigo-600 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all"
                   >
                      <Send className="w-4 h-4" /> Send Registry Signal
                   </a>
                </div>
             </div>

             <div className="p-10 glass-card rounded-[48px] border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 rounded-[28px] bg-emerald-500 flex items-center justify-center shadow-2xl">
                      <HeartHandshake className="w-8 h-8 text-white" />
                   </div>
                   <div>
                      <h4 className="text-xl font-bold text-white uppercase tracking-tighter italic">Stakeholder Resolution</h4>
                      <p className="text-slate-500 text-xs font-medium">All corporate inquiries are indexed on the EOS industrial shard within 24 hours.</p>
                   </div>
                </div>
                <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-white hover:bg-white/10 transition-all flex items-center gap-2">
                   Institutional FAQ <ArrowRight className="w-4 h-4" />
                </button>
             </div>
          </div>
        )}
      </div>

      {/* Support Chat Overlay */}
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
             <div className="p-6 bg-emerald-600/10 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                      <Bot className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-widest">EnvirosAgro™ AI</h4>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Online // Registry 01</p>
                   </div>
                </div>
                <button onClick={() => setShowSupport(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                   <X className="w-5 h-5" />
                </button>
             </div>

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

             <div className="p-6 border-t border-white/5 bg-black/40">
                <div className="relative">
                   <input 
                    type="text" 
                    value={supportInput}
                    onChange={e => setSupportInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSupportSend()}
                    placeholder="Ask about EOS or Five Thrusts™..."
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
