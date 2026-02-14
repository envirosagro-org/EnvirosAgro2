import React, { useState, useEffect } from 'react';
import { 
  Info, ShieldCheck, ChevronRight, Scale, BookOpen, Globe, Zap, Users, Lock, FileText,
  AlertTriangle, HeartHandshake, X, Loader2, Send, Bot, User as UserIcon, MessageSquare,
  Fingerprint, MapPin, Phone, Mail, ExternalLink, ArrowRight, Share2, Youtube, Twitter,
  Linkedin, AtSign, Pin, HelpCircle, Cloud, Wind, Facebook, MessageCircleQuestion, Eye,
  Target, Sparkles, Copyright, Shield, Award, CheckCircle2, BadgeCheck, Terminal,
  MessagesSquare, Copy, Check, ShieldPlus, Leaf, HelpCircle as FaqIcon,
  ChevronDown, Code, Database, Gavel, Stamp, ShieldX, FileSignature, ScrollText,
  Cpu, Download, Target as TargetIcon, Activity, Binary, History, Scale as ScaleIcon,
  ArrowUpRight, Building
} from 'lucide-react';
import { ViewState } from '../types';
import { SycamoreLogo } from '../App';

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
  }
];

const FAQ_ITEMS = [
  { q: "What is the m-Constant?", a: "The sustainable time constant (m) measures a node's resilience against external stress. It is calculated as the square root of (Density * Intensity * Cumulative Stewardship) divided by Stress." },
  { q: "How are Carbon Credits minted?", a: "Credits are minted via Digital MRV (Monitoring, Reporting, and Verification). Visual or IoT evidence is sharded and audited by the Oracle before EAC finality." },
  { q: "What does SEHTI stand for?", a: "Societal, Environmental, Human, Technological, and Industry. These are the five thrusts that anchor the EnvirosAgro ecosystem." },
  { q: "What is a Registry Handshake?", a: "A Handshake is a ZK-verified protocol to link physical assets (land or hardware) to your digital steward node ID (ESIN)." }
];

const InfoPortal: React.FC<InfoPortalProps> = ({ onNavigate, onAcceptAll }) => {
  const [activeSection, setActiveSection] = useState<string>('about');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const shards = [
    { id: 'about', label: 'Institutional Bio', icon: Info, color: 'text-emerald-400' },
    { id: 'security', label: 'Security Protocols', icon: ShieldCheck, color: 'text-indigo-400' },
    { id: 'legal', label: 'Legal Statutes', icon: Gavel, color: 'text-amber-500' },
    { id: 'agreements', label: 'Node Covenant', icon: FileText, color: 'text-blue-400' },
    { id: 'environments', label: 'Mesh Nodes', icon: Share2, color: 'text-rose-400' },
    { id: 'faq', label: 'Registry FAQ', icon: FaqIcon, color: 'text-slate-400' },
    { id: 'contact', label: 'HQ Terminal', icon: Globe, color: 'text-emerald-400' },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'about':
        return (
          <section className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="flex items-center gap-6 mb-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-600 flex items-center justify-center text-white shadow-3xl border-4 border-white/10 animate-float">
                <Info size={32} />
              </div>
              <div>
                <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">REGISTRY <span className="text-emerald-400">BIO.</span></h2>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.6em] mt-4 italic opacity-60">SHARD_01 // INSTITUTIONAL_ORIGIN</p>
              </div>
            </div>
            <div className="p-12 md:p-16 glass-card rounded-[80px] border-2 border-emerald-500/20 bg-emerald-600/[0.02] shadow-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><SycamoreLogo size={600} className="text-emerald-400" /></div>
              <p className="text-slate-300 text-2xl md:text-4xl leading-[2.1] italic font-medium relative z-10 border-l-[16px] border-emerald-500 pl-12 md:pl-20 font-sans">
                "EnvirosAgro™ is a decentralized agrarian ecosystem engineered to stabilize the global m-constant through high-fidelity biological sharding. We catalyze transformation by bridging ancestral land wisdom with cybernetic industrial logic."
              </p>
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 pt-16 border-t border-white/5">
                {[
                  { i: Target, t: 'Precision', c: 'Ca-Weighted', cl: 'text-blue-400' },
                  { i: Activity, t: 'Resonance', c: 'm-Constant Peak', cl: 'text-emerald-400' },
                  { i: Binary, t: 'Integrity', c: 'ZK-Handshaked', cl: 'text-indigo-400' },
                ].map((box, i) => (
                  <div key={i} className="p-8 bg-black/60 rounded-[48px] border border-white/10 group/box hover:border-emerald-500/40 transition-all shadow-inner text-center">
                    <box.i className={`w-12 h-12 ${box.cl} mx-auto mb-6 group-hover/box:scale-110 transition-transform`} />
                    <h4 className="text-xl font-black text-white uppercase italic mb-1">{box.t}</h4>
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{box.c}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case 'security':
        return (
          <section className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-16 h-16 rounded-[28px] bg-indigo-600 flex items-center justify-center text-white shadow-3xl animate-pulse">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter m-0">SECURITY <span className="text-indigo-400">SHARDS</span></h3>
            </div>
            <div className="grid gap-8">
              {SECURITY_SHARDS.map((shard, i) => (
                <div key={i} className="glass-card p-12 md:p-16 rounded-[72px] border-2 border-white/5 bg-black/40 relative overflow-hidden group shadow-3xl">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform pointer-events-none">
                    <Lock size={300} />
                  </div>
                  <div className="flex flex-col space-y-10 relative z-10">
                    <div className="space-y-4">
                      <h4 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">{shard.title}</h4>
                      <p className="text-slate-400 text-xl font-medium italic opacity-80 max-w-2xl">"{shard.desc}"</p>
                    </div>
                    <div className="bg-black/90 rounded-[56px] p-10 md:p-14 border border-indigo-500/20 shadow-inner max-w-5xl relative overflow-hidden group/code">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover/code:scale-125 transition-transform"><Database size={200} className="text-indigo-400" /></div>
                      <div className="flex items-center gap-5 mb-8">
                        <Code size={24} className="text-indigo-400" />
                        <span className="text-xs font-mono font-black text-indigo-400 uppercase tracking-[0.5em]">SYSTEM_CALL_v6.5 // HASH_0x882A</span>
                      </div>
                      <div className="bg-black/40 p-10 rounded-[40px] border border-white/5 shadow-2xl">
                        <code className="text-emerald-400 font-mono text-xl md:text-3xl block leading-relaxed selection:bg-indigo-500/30">
                          {shard.logic}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'legal':
        return (
          <section className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-16 h-16 rounded-[28px] bg-amber-600 flex items-center justify-center text-white shadow-3xl">
                <Gavel size={32} />
              </div>
              <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter m-0">LEGAL <span className="text-amber-500">REGISTRY</span></h3>
            </div>
            <div className="grid grid-cols-1 gap-10">
              {LEGAL_REGISTRY.map((law, i) => (
                <div key={i} className="glass-card p-12 md:p-16 rounded-[80px] border-2 border-white/5 bg-black/40 shadow-3xl group hover:border-amber-500/30 transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-[15s]"><law.icon size={400} className="text-amber-500" /></div>
                  <div className="flex flex-col md:flex-row justify-between items-start mb-12 relative z-10 gap-10 border-b border-white/5 pb-10">
                    <div className="flex items-center gap-8">
                      <div className={`p-6 rounded-[32px] bg-white/5 border border-white/10 ${law.color} shadow-inner group-hover:rotate-6 transition-all`}>
                        <law.icon size={48} />
                      </div>
                      <div>
                        <h4 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">{law.title}</h4>
                        <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.5em] mt-4 italic">STATUTE_ID: {law.id.toUpperCase()}_v6.5</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <p className="text-slate-300 text-2xl md:text-3xl leading-[2.1] italic font-medium pl-10 border-l-[12px] border-white/5 group-hover:border-amber-500/40 transition-all font-sans">
                      "{law.content}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'agreements':
        return (
          <section className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="flex items-center gap-6 mb-10 px-4">
              <div className="w-16 h-16 rounded-[28px] bg-blue-600 flex items-center justify-center text-white shadow-3xl">
                <FileText size={32} />
              </div>
              <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter m-0">STEWARD <span className="text-blue-400">COVENANT</span></h3>
            </div>
            <div className="p-16 md:p-24 glass-card rounded-[80px] border-4 border-double border-indigo-500/30 bg-black/60 shadow-[0_60px_150px_rgba(0,0,0,0.95)] relative overflow-hidden flex flex-col items-center text-center space-y-16 group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.05)_0%,_transparent_70%)] pointer-events-none"></div>
              <div className="relative z-10 space-y-8">
                <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-[0_0_120px_rgba(99,102,241,0.5)] border-4 border-white/10 animate-float mx-auto group-hover:rotate-12 transition-transform">
                  <Fingerprint size={64} />
                </div>
                <div className="space-y-4">
                  <h4 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">NODE OPERATOR <br/><span className="text-indigo-400">SIGN-OFF</span></h4>
                  <p className="text-slate-400 text-xl md:text-2xl font-medium italic max-w-3xl mx-auto leading-relaxed px-10">
                    "Participation in the mesh constitutes acceptance of all active covenants. Drift is monitored by the Quorum to ensure biological finality."
                  </p>
                </div>
              </div>
              <div className="w-full max-w-4xl p-12 md:p-16 bg-black/90 rounded-[64px] border-2 border-white/5 relative overflow-hidden shadow-inner group/text">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover/text:scale-110 transition-transform duration-[15s] pointer-events-none"><Database size={400} /></div>
                <p className="text-slate-200 text-2xl md:text-4xl italic leading-[2.1] font-medium relative z-10 text-center font-sans">
                  {"\"As a Node Operator, you are responsible for the uptime of your paired hardware. You agree to submit your node to 'Periodic Quorum Audits'. In exchange for maintaining mesh stability (m > 1.42), you are authorized to mint EAC shards. Failure to maintain a verified m-constant below the threshold may result in temporary registry suspension.\""}
                </p>
              </div>
              <button 
                onClick={onAcceptAll}
                className="w-full max-w-md py-12 bg-emerald-600 hover:bg-emerald-500 rounded-[48px] text-white font-black text-xl uppercase tracking-[0.5em] shadow-[0_0_120px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95 transition-all border-4 border-white/10 ring-[32px] ring-white/5 relative z-10"
              >
                ACCEPT ALL SHARDS
              </button>
            </div>
          </section>
        );
      case 'environments':
        return (
          <section className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="flex items-center gap-6 mb-10 px-4">
              <div className="w-16 h-16 rounded-[28px] bg-rose-600 flex items-center justify-center text-white shadow-3xl">
                <Share2 size={32} />
              </div>
              <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter m-0">EXTERNAL <span className="text-rose-500">NODES</span></h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {ENVIRONMENTS.map((env, i) => (
                <a key={i} href={env.url} target="_blank" rel="noopener noreferrer" className="glass-card p-10 rounded-[56px] border border-white/5 hover:border-blue-500/30 transition-all flex flex-col group relative overflow-hidden bg-black/40 h-[420px] shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center gap-5 mb-8 relative z-10">
                    <div className={`w-16 h-16 rounded-[24px] ${env.bg} flex items-center justify-center border border-white/10 shrink-0 group-hover:scale-110 transition-transform shadow-xl`}>
                      <env.icon size={28} className={`${env.color}`} />
                    </div>
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter truncate">{env.name}</h4>
                  </div>
                  <p className="text-slate-400 text-base font-medium italic leading-relaxed flex-1 opacity-80 group-hover:opacity-100 transition-opacity">"{env.desc}"</p>
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-black text-blue-400 uppercase tracking-widest relative z-10">
                    CONNECT SHARD <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
          </section>
        );
      case 'faq':
        return (
          <section className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-700 max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaqIcon size={40} className="text-slate-700" />
              </div>
              <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter m-0">REGISTRY <span className="text-slate-400">FAQ</span></h3>
              <p className="text-slate-600 text-lg uppercase font-black tracking-[0.5em] italic">System Protocols & Guidelines</p>
            </div>
            <div className="space-y-4">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="glass-card rounded-[40px] border-2 border-white/5 overflow-hidden transition-all group hover:border-emerald-500/20 bg-black/20 shadow-xl">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-10 md:p-12 flex items-center justify-between hover:bg-white/[0.02] transition-all text-left"
                  >
                    <span className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tight">{item.q}</span>
                    <div className={`p-4 rounded-full bg-white/5 transition-transform duration-500 ${openFaq === i ? 'rotate-180 bg-emerald-600 text-white' : 'text-slate-700'}`}>
                      <ChevronDown size={24} />
                    </div>
                  </button>
                  {openFaq === i && (
                    <div className="p-10 md:p-12 pt-0 border-t border-white/5 animate-in slide-in-from-top-4 duration-500">
                      <p className="text-lg md:text-xl text-slate-400 leading-relaxed italic font-medium border-l-4 border-emerald-500/40 pl-8 font-sans">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      case 'contact':
        return (
          <section className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="text-center space-y-6 mb-16">
              <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">HQ <span className="text-emerald-400">NODES.</span></h2>
              <p className="text-slate-500 text-2xl italic font-medium">Physical and digital touchpoints for the global registry core.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
              {[
                { i: MapPin, t: 'Headquarters', c: '9X6C+P6, Kiriaini', sub: 'Global Zone Node', cl: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { i: Phone, t: 'Support', c: '0740 161 447', sub: 'Registry Direct', cl: 'text-blue-400', bg: 'bg-blue-500/10' },
                { i: Mail, t: 'Ingest', c: 'envirosagro.com@gmail.com', sub: 'Archive Official', cl: 'text-indigo-400', bg: 'bg-indigo-500/10' },
              ].map((box, i) => (
                <div key={i} className="glass-card p-12 rounded-[64px] border-2 border-white/5 bg-black/60 space-y-8 hover:border-white/10 transition-all group shadow-3xl text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] to-transparent"></div>
                  <div className={`w-20 h-20 rounded-[32px] ${box.bg} border-2 border-white/5 flex items-center justify-center mx-auto shadow-2xl group-hover:rotate-6 transition-all duration-700`}>
                    <box.i className={`w-10 h-10 ${box.cl}`} />
                  </div>
                  <div>
                    <h4 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 italic">{box.t}</h4>
                    <p className="text-slate-100 text-xl font-mono font-black truncate leading-tight mb-4 group-hover:text-emerald-400 transition-colors">{box.c}</p>
                    <span className="px-4 py-1.5 bg-white/5 rounded-full text-[9px] font-black uppercase text-slate-700 tracking-widest border border-white/5">{box.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-40 relative">
      
      {/* 1. STICKY NAVIGATOR SHARD */}
      <aside className="lg:w-80 shrink-0">
        <div className="sticky top-28 space-y-8">
           <div className="glass-card p-8 rounded-[48px] border-2 border-white/5 bg-black/40 space-y-8 shadow-3xl">
              <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                 <div className="p-3 bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-900/40">
                    <SycamoreLogo size={24} className="text-white" />
                 </div>
                 <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Matrix Index</h3>
              </div>
              <nav className="space-y-1">
                 {shards.map((shard) => (
                    <button
                       key={shard.id}
                       onClick={() => setActiveSection(shard.id)}
                       className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                          activeSection === shard.id 
                             ? 'bg-white text-black shadow-2xl scale-105' 
                             : 'text-slate-500 hover:text-white hover:bg-white/5'
                       }`}
                    >
                       <div className="flex items-center gap-4">
                          <shard.icon size={16} className={activeSection === shard.id ? 'text-black' : shard.color} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{shard.label}</span>
                       </div>
                       {activeSection === shard.id && <ChevronRight size={14} className="animate-pulse" />}
                    </button>
                 ))}
              </nav>
              <div className="pt-6 border-t border-white/5 space-y-4">
                 <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-700">
                    <span>Registry Depth</span>
                    <span className="text-emerald-400">100%</span>
                 </div>
                 <div className="h-1 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                    <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" style={{ width: '100%' }}></div>
                 </div>
              </div>
           </div>

           <div className="p-8 glass-card rounded-[40px] border border-blue-500/20 bg-blue-500/5 space-y-4 shadow-xl group">
              <div className="flex items-center gap-3">
                 <Info size={16} className="text-blue-400" />
                 <h4 className="text-[10px] font-black text-white uppercase tracking-widest italic">Truth protocol</h4>
              </div>
              <p className="text-[9px] text-slate-500 leading-relaxed uppercase tracking-tight italic">
                 "Every shard in this registry is verified by the root node consensus and anchored in the Layer-3 industrial ledger."
              </p>
           </div>
        </div>
      </aside>

      {/* 2. MASTER LEDGER CONTENT - RENDERED PAGE BY PAGE */}
      <main className="flex-1 min-h-[700px] pt-2">
        {renderSection()}
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 4s linear infinite; }
      `}</style>
    </div>
  );
};

export default InfoPortal;