import React, { useState } from 'react';
import { 
  Info, ShieldCheck, ChevronRight, Scale, BookOpen, Globe, Zap, Users, Lock, FileText,
  AlertTriangle, HeartHandshake, X, Loader2, Send, Bot, User as UserIcon, MessageSquare,
  Fingerprint, MapPin, Phone, Mail, ExternalLink, ArrowRight, Share2, Youtube, Twitter,
  Linkedin, AtSign, Pin, HelpCircle, Cloud, Wind, Facebook, MessageCircleQuestion, Eye,
  Target, Sparkles, Copyright, Shield, Award, CheckCircle2, BadgeCheck, Terminal,
  MessagesSquare, Copy, Check, ShieldPlus, Leaf, HelpCircle as FaqIcon,
  ChevronDown, Code, Database, Gavel, Stamp, ShieldX, FileSignature, ScrollText,
  Cpu, Download
} from 'lucide-react';
import { ViewState } from '../types';

interface InfoPortalProps {
  onNavigate: (view: ViewState) => void;
  onAcceptAll?: () => void;
}

const ENVIRONMENTS = [
  { name: 'Threads', url: 'https://www.threads.com/@envirosagro', icon: AtSign, color: 'text-white', bg: 'bg-white/5', desc: 'Real-time sustainability dialogue.' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@envirosagro?_r=1&_t=ZM-92puItTmTF6', icon: Share2, color: 'text-pink-500', bg: 'bg-pink-500/10', desc: 'Short-form regenerative field logs.' },
  { name: 'YouTube', url: 'https://youtube.com/@envirosagro?si=JOezDZYuxRVmeplX', icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10', desc: 'Industrial documentary archive.' },
  { name: 'X / Twitter', url: 'https://x.com/EnvirosAgro', icon: Twitter, color: 'text-blue-400', bg: 'bg-blue-400/10', desc: 'Global network registry updates.' },
  { name: 'Pinterest', url: 'https://pin.it/B3PuCr4Oo', icon: Pin, color: 'text-rose-600', bg: 'bg-rose-600/10', desc: 'Visual SEHTI framework guides.' },
  { name: 'Quora', url: 'https://www.quora.com/profile/EnvirosAgro?ch=10&oid=2274202272&share=cee3144a&srid=3uVNlE&target_type=user', icon: HelpCircle, color: 'text-red-700', bg: 'bg-red-700/10', desc: 'Expert scientific inquiries & Q&A.' },
  { name: 'Telegram', url: 'https://t.me/EnvirosAgro', icon: Send, color: 'text-sky-400', bg: 'bg-sky-400/10', desc: 'Encrypted signal hub.' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/modern-agrarian-revolution', icon: Linkedin, color: 'text-blue-600', bg: 'bg-blue-600/10', desc: 'Institutional partnerships.' },
];

const SECURITY_SHARDS = [
  { 
    title: "SOVEREIGN NODE PROTOCOL", 
    logic: "allow write: if isOwner(stewardId);", 
    desc: "Ensures only authorized Stewards can modify their own local node biometrics." 
  },
  { 
    title: "IMMUTABLE LEDGER FINALITY", 
    logic: "allow update, delete: if false;", 
    desc: "Prevents historical revisionism. All commercial and biological shards are permanent." 
  },
  { 
    title: "AUDITOR QUORUM", 
    logic: "allow write: if isAuditor();", 
    desc: "Restricts physical verification updates to verified HQ Auditor nodes." 
  }
];

const LEGAL_REGISTRY = [
  {
    id: 'privacy',
    title: 'Privacy & Data Sharding',
    icon: Shield,
    color: 'text-blue-400',
    content: 'EnvirosAgro utilizes Zero-Knowledge (ZK) proofs to maintain steward anonymity while proving compliance. Personal telemetry—including geofence data and bio-signatures—is encrypted at the edge. No raw data is stored outside your node; only cryptographic hashes are sharded to the global registry.'
  },
  {
    id: 'trademarks',
    title: 'Trademarks & IP',
    icon: Stamp,
    color: 'text-amber-500',
    content: 'The following are registered marks of the EnvirosAgro ecosystem: EnvirosAgro™, SEHTI™, C(a)™ (Agro Code), m™ (Time Signature), WhatIsAG™, MedicAg™, and Agroboto™. Unauthorized use of these designations within external agricultural frameworks is a violation of registry integrity.'
  },
  {
    id: 'copyright',
    title: 'Copyright Policy',
    icon: Copyright,
    color: 'text-indigo-400',
    content: 'All research papers, media shards, and botanical blueprints generated through the Forge are protected by the Open Ledger Covenant. While shared within the mesh, commercial redistribution without an EAC-based licensing handshake is prohibited. "AgroInPDF" archives are immutable copyrighted records.'
  },
  {
    id: 'consent',
    title: 'Consent Protocols',
    icon: FileSignature,
    color: 'text-emerald-400',
    content: 'Pairing a physical device or land plot constitutes explicit consent for telemetry ingest. Stewards retain the right to "Sever the Handshake," which ceases active syncing but leaves existing historical shards in the permanent archive for m-constant baseline integrity.'
  },
  {
    id: 'disclaimer',
    title: 'Legal Disclaimer',
    icon: AlertTriangle,
    color: 'text-rose-500',
    content: 'EnvirosAgro is a decentralized autonomous network. Financial sharding and carbon minting are contingent on community consensus. The organization is not liable for m-constant decay resulting from unverified agricultural practices or SID-related node contamination.'
  }
];

const FAQ_ITEMS = [
  { q: "What is the m-Constant?", a: "The sustainable time constant (m) measures a node's resilience against external stress. It is calculated as the square root of (Density * Intensity * Cumulative Stewardship) divided by Stress." },
  { q: "How are Carbon Credits minted?", a: "Credits are minted via Digital MRV (Monitoring, Reporting, and Verification). Visual or IoT evidence is sharded and audited by the Oracle before EAC finality." },
  { q: "What does SEHTI stand for?", a: "Societal, Environmental, Human, Technological, and Industry. These are the five thrusts that anchor the EnvirosAgro ecosystem." },
  { q: "What is a Registry Handshake?", a: "A Handshake is a ZK-verified protocol to link physical assets (land or hardware) to your digital steward node ID (ESIN)." }
];

const InfoPortal: React.FC<InfoPortalProps> = ({ onNavigate, onAcceptAll }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'security' | 'legal' | 'agreements' | 'environments' | 'faq' | 'contact'>('about');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const tabs = [
    { id: 'about', label: 'About', icon: Info },
    { id: 'security', label: 'Security Shards', icon: ShieldCheck },
    { id: 'legal', label: 'Legal Registry', icon: Gavel },
    { id: 'agreements', label: 'Agreements', icon: FileText },
    { id: 'environments', label: 'Nodes', icon: Share2 },
    { id: 'faq', label: 'Registry FAQ', icon: FaqIcon },
    { id: 'contact', label: 'HQ Hub', icon: Globe },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div className="flex flex-wrap gap-2 md:gap-3 p-1 glass-card rounded-2xl w-fit mx-auto overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon size={12} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-[40px] md:rounded-[48px] overflow-hidden min-h-[500px] border border-white/5 bg-black/20">
        {activeTab === 'about' && (
          <div className="p-8 md:p-12 space-y-10 animate-in fade-in duration-500">
            <div className="space-y-4 text-center max-w-3xl mx-auto">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 agro-gradient rounded-xl flex items-center justify-center shadow-xl">
                  <Leaf className="w-7 h-7 text-white" />
                </div>
              </div>
              <span className="text-[7px] font-black text-emerald-500 uppercase tracking-[0.4em]">EnvirosAgro™ Ecosystem</span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tighter m-0 uppercase italic">About <span className="text-emerald-400">EnvirosAgro™</span></h2>
              <p className="text-sm md:text-base text-slate-400 leading-relaxed font-medium italic opacity-80">
                EnvirosAgro™ establishes a comprehensive network that advances agricultural sustainability. By linking farmers, researchers, and stakeholders, we catalyze transformation within the global agrarian community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
               {[
                 { i: BadgeCheck, t: 'Protection', c: 'Registered Mark', cl: 'text-emerald-500' },
                 { i: Award, t: 'Protocol', c: 'Proprietary Root', cl: 'text-amber-500' },
                 { i: ShieldCheck, t: 'Legal', c: 'SEHTI Certified', cl: 'text-indigo-400' },
               ].map((box, i) => (
                  <div key={i} className="glass-card p-6 rounded-[32px] border-white/5 bg-white/[0.02] flex items-center gap-4 group hover:border-white/10 transition-all">
                    <box.i className={`w-8 h-8 ${box.cl} group-hover:scale-110 transition-transform`} />
                    <div className="space-y-0.5">
                       <h4 className="text-xs md:text-sm font-black text-white uppercase italic leading-none">{box.t}</h4>
                       <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest leading-none">{box.c}</p>
                    </div>
                  </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="p-8 md:p-12 space-y-12 animate-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-4">
              <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">NETWORK <span className="text-indigo-400">SECURITY SHARDS</span></h3>
              <p className="text-slate-500 text-lg md:text-xl italic font-medium">Governing the flow of industrial data via Tooling.</p>
            </div>
            
            <div className="grid gap-10">
              {SECURITY_SHARDS.map((shard, i) => (
                <div key={i} className="glass-card p-10 md:p-14 rounded-[64px] border-2 border-white/5 bg-black/40 relative overflow-hidden group shadow-3xl">
                   <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-[0.05] group-hover:scale-110 transition-transform pointer-events-none">
                     <Lock size={280} />
                   </div>
                   <div className="flex flex-col space-y-10 relative z-10">
                      <div className="space-y-4">
                         <h4 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter m-0">{shard.title}</h4>
                         <p className="text-slate-400 text-lg md:text-xl italic font-medium opacity-80">"{shard.desc}"</p>
                      </div>
                      <div className="bg-black/60 rounded-[40px] p-8 md:p-12 border border-white/10 shadow-inner max-w-4xl">
                         <div className="flex items-center gap-4 mb-6">
                            <Code size={20} className="text-indigo-400" />
                            <span className="text-xs md:text-sm font-mono font-black text-indigo-400 uppercase tracking-widest">RULES_ENGINE_v6.5</span>
                         </div>
                         <code className="text-emerald-400 font-mono text-lg md:text-2xl block bg-black/40 p-6 md:p-10 rounded-3xl border border-white/5 shadow-2xl">
                            {shard.logic}
                         </code>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'legal' && (
          <div className="p-8 md:p-12 space-y-12 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">LEGAL <span className="text-emerald-400">REGISTRY</span></h3>
              <p className="text-slate-500 text-lg md:text-xl italic font-medium">Codifying the Agro-Legal Framework (SEHTI).</p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
               {LEGAL_REGISTRY.map((law, i) => (
                 <div key={i} className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 shadow-2xl group hover:border-emerald-500/30 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform"><law.icon size={200} /></div>
                    <div className="flex items-center gap-6 mb-8 border-b border-white/5 pb-6">
                       <div className={`p-4 rounded-2xl bg-white/5 ${law.color} shadow-inner group-hover:rotate-6 transition-all`}>
                          <law.icon size={32} />
                       </div>
                       <div>
                          <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">{law.title}</h4>
                          <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">SEHTI_STATUTE_OK</p>
                       </div>
                    </div>
                    <p className="text-slate-300 text-lg leading-relaxed italic font-medium pl-6 border-l-4 border-white/10 group-hover:border-emerald-500/40 transition-colors">
                      "{law.content}"
                    </p>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'agreements' && (
          <div className="p-8 md:p-12 space-y-12 animate-in slide-in-from-top-4 duration-500">
             <div className="glass-card p-10 md:p-14 rounded-[64px] border-2 border-white/5 bg-black/40 shadow-3xl relative overflow-hidden flex flex-col group/card">
                {/* Header of Agreement Card */}
                <div className="flex items-center justify-between mb-12 relative z-10">
                   <div className="flex items-center gap-8">
                      <div className="w-20 h-20 rounded-3xl bg-black/60 border-2 border-white/10 flex items-center justify-center text-blue-400 shadow-2xl group-hover/card:rotate-6 transition-transform">
                         <Cpu size={40} />
                      </div>
                      <div className="text-left">
                         <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 drop-shadow-2xl">NODE OPERATOR <br/> <span className="text-white">COVENANT</span></h3>
                         <p className="text-slate-600 font-mono text-[10px] uppercase tracking-[0.4em] mt-3">VERSION 2.0.4 // NODE_ANCHOR</p>
                      </div>
                   </div>
                   <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all shadow-xl active:scale-95">
                      <Download size={32} />
                   </div>
                </div>

                <div className="space-y-10 relative z-10">
                   <p className="text-[14px] font-black text-blue-500 uppercase tracking-[0.2em] px-4 italic">RIGHTS AND RESPONSIBILITIES OF A SOVEREIGN STEWARD.</p>
                   
                   <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border-l-[16px] border-l-indigo-600 relative overflow-hidden shadow-inner group/text">
                      <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover/text:scale-110 transition-transform"><Database size={400} /></div>
                      <p className="text-slate-200 text-3xl leading-[2.1] italic font-medium relative z-10 font-sans">
                         "As a Node Operator, you are responsible for the uptime of your paired hardware. You agree to submit your node to \"Periodic Quorum Audits.\" In exchange for maintaining mesh stability (m > 1.42), you are authorized to mint EAC shards. Failure to maintain a verified m-constant below the fallowing threshold may result in temporary registry suspension."
                      </p>
                   </div>
                </div>

                <div className="mt-16 flex justify-end items-center gap-6 relative z-10 px-6 opacity-40 group-hover/card:opacity-100 transition-opacity">
                   <Stamp size={28} className="text-slate-500" />
                   <span className="text-[12px] font-mono text-slate-500 font-black uppercase tracking-[0.5em] italic">COMMITTED_BY_ROOT_STEWARD_#0X882A</span>
                </div>
             </div>

             <div className="p-12 md:p-20 glass-card rounded-[80px] border-2 border-indigo-500/20 bg-indigo-950/5 flex flex-col items-center justify-center text-center space-y-12 shadow-[0_50px_150px_rgba(0,0,0,0.8)] relative overflow-hidden group/consent">
                <div className="absolute inset-0 bg-indigo-500/[0.02] pointer-events-none"></div>
                <div className="relative">
                   <div className="w-28 h-28 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-[0_0_100px_rgba(99,102,241,0.5)] border-4 border-white/10 animate-float">
                      <Fingerprint size={56} />
                   </div>
                   <div className="absolute inset-[-20px] border-2 border-dashed border-indigo-500/20 rounded-full animate-spin-slow"></div>
                </div>

                <div className="space-y-6">
                   <h4 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">MUTUAL <span className="text-white">CONSENT</span></h4>
                   <p className="text-slate-400 text-xl md:text-2xl font-medium italic leading-relaxed max-w-2xl mx-auto opacity-80 group-hover/consent:opacity-100 transition-opacity">
                      "Participation in the registry constitutes acceptance of all active covenants. Drift is monitored by the Quorum."
                   </p>
                </div>

                <div className="w-full max-w-md p-3 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-[48px] relative group/btn">
                   <button 
                     onClick={onAcceptAll}
                     className="w-full py-12 bg-emerald-600 hover:bg-emerald-500 rounded-[40px] text-white font-black text-lg uppercase tracking-[0.5em] shadow-[0_0_120px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95 transition-all border-4 border-white/10 ring-[32px] ring-white/5 relative z-10"
                   >
                      ACCEPT ALL SHARDS
                   </button>
                   <div className="absolute inset-0 bg-emerald-400/20 blur-2xl group-hover/btn:blur-3xl transition-all opacity-40"></div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'environments' && (
          <div className="p-8 md:p-12 space-y-8 animate-in slide-in-from-right-4 duration-500">
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {ENVIRONMENTS.map((env, i) => (
                  <a key={i} href={env.url} target="_blank" rel="noopener noreferrer" className="glass-card p-6 rounded-[32px] border border-white/5 hover:border-blue-500/20 transition-all flex flex-col group relative overflow-hidden bg-black/40">
                    <div className="flex items-center gap-3 mb-4">
                       <div className={`w-10 h-10 rounded-[16px] ${env.bg} flex items-center justify-center border border-white/10 shrink-0`}><env.icon size={16} className={`${env.color}`} /></div>
                       <h4 className="text-xs font-black text-white tracking-tight truncate">{env.name}</h4>
                    </div>
                    <p className="text-[9px] text-slate-500 font-medium italic flex-1 line-clamp-2 leading-relaxed">"{env.desc}"</p>
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[7px] font-black text-blue-400 uppercase tracking-widest">
                       CONNECT SHARD <ExternalLink size={10} />
                    </div>
                  </a>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="p-8 md:p-12 space-y-8 animate-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
             <div className="text-center space-y-2 mb-10">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Frequently <span className="text-indigo-400">Asked Shards</span></h3>
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">System Protocols & User Guidelines</p>
             </div>
             <div className="space-y-3">
                {FAQ_ITEMS.map((item, i) => (
                  <div key={i} className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                    <button 
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-all text-left"
                    >
                      <span className="text-[11px] font-black text-white uppercase italic tracking-tight">{item.q}</span>
                      <ChevronDown size={14} className={`text-slate-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === i && (
                      <div className="p-5 pt-0 border-t border-white/5 animate-in slide-in-from-top-2">
                        <p className="text-[10px] text-slate-400 leading-relaxed italic">{item.a}</p>
                      </div>
                    )}
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="p-8 md:p-12 space-y-10 animate-in fade-in duration-500 text-center">
             <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter italic m-0">HQ <span className="text-emerald-400">Registry Nodes</span></h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  { i: MapPin, t: 'Headquarters', c: '9X6C+P6, Kiriaini', sub: 'Global Zone Node', cl: 'text-emerald-400' },
                  { i: Phone, t: 'Support', c: '0740161447', sub: 'Registry Direct', cl: 'text-blue-400' },
                  { i: Mail, t: 'Ingest', c: 'envirosagro.com@gmail.com', sub: 'Archive Official', cl: 'text-indigo-400' },
                ].map((box, i) => (
                   <div key={i} className="glass-card p-8 rounded-[40px] border border-white/5 bg-black space-y-4 hover:border-white/10 transition-all group shadow-xl">
                      <box.i className={`w-8 h-8 ${box.cl} mx-auto group-hover:scale-110 transition-transform`} />
                      <div>
                        <h4 className="text-[10px] font-black text-white uppercase italic mb-1 tracking-widest">{box.t}</h4>
                        <p className="text-slate-300 text-xs font-mono font-bold truncate leading-none mb-1">{box.c}</p>
                        <p className="text-[7px] text-slate-600 font-black uppercase tracking-widest">{box.sub}</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.7); }
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -10px; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default InfoPortal;
