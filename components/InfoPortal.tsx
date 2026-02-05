import React, { useState, useRef, useEffect } from 'react';
import { 
  Info, 
  ShieldCheck, 
  ChevronRight, 
  Scale as ScaleIcon, 
  BookOpen, 
  Globe, 
  Zap, 
  Users, 
  Lock, 
  FileText,
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
  ArrowRight,
  Share2,
  Youtube,
  Twitter,
  Linkedin,
  AtSign,
  Pin,
  HelpCircle,
  Cloud,
  Wind,
  Facebook,
  MessageCircleQuestion,
  Eye,
  Target,
  Sparkles,
  Activity,
  Copyright,
  Shield,
  Award,
  CheckCircle2,
  BadgeCheck,
  Headphones,
  Terminal,
  MessagesSquare,
  Copy,
  Check,
  Binary,
  Map as MapIcon,
  Microscope,
  Quote,
  Database,
  History,
  Stamp,
  Search,
  LayoutGrid,
  Monitor,
  Cpu,
  Layers,
  Dna,
  Workflow,
  PlusCircle,
  FileCode,
  Waves,
  Layout,
  Globe2,
  Box,
  Satellite,
  Gavel
} from 'lucide-react';
import { chatWithAgroExpert } from '../services/geminiService';
import { User, ViewState } from '../types';

interface InfoPortalProps {
  user: User;
  onNavigate?: (view: ViewState) => void;
}

const ENVIRONMENTS = [
  { name: 'Threads', url: 'https://www.threads.com/@envirosagro', icon: AtSign, color: 'text-white', bg: 'bg-white/5', desc: 'Real-time sustainability dialogue.' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@envirosagro?_r=1&_t=ZM-92puItTmTF6', icon: Share2, color: 'text-pink-500', bg: 'bg-pink-500/10', desc: 'Short-form regenerative field logs.' },
  { name: 'YouTube', url: 'https://youtube.com/@envirosagro?si=JOezDZYuxRVmeplX', icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10', desc: 'Industrial documentary archive.' },
  { name: 'X / Twitter', url: 'https://x.com/EnvirosAgro', icon: Twitter, color: 'text-blue-400', bg: 'bg-blue-400/10', desc: 'Global network registry updates.' },
  { name: 'Pinterest', url: 'https://pin.it/B3PuCr4Oo', icon: Pin, color: 'text-rose-600', bg: 'bg-rose-600/10', desc: 'Visual SEHTI framework guides.' },
  { name: 'Quora', url: 'https://www.quora.com/profile/EnvirosAgro?ch=10&oid=2274202272&share=cee3144a&srid=3uVNlE&target_type=user', icon: HelpCircle, color: 'text-red-700', bg: 'bg-red-700/10', desc: 'Expert scientific inquiries & Q&A.' },
  { name: 'Telegram', url: 'https://t.me/EnvirosAgro', icon: Send, color: 'text-sky-400', bg: 'bg-sky-400/10', desc: 'Steward-to-steward encrypted signal.' },
  { name: 'Tumblr', url: 'https://envirosagro.tumblr.com/?source=share', icon: Cloud, color: 'text-indigo-400', bg: 'bg-indigo-400/10', desc: 'Bantu heritage and soil philosophy.' },
  { name: 'Bluesky', url: 'https://bsky.app/profile/envirosagro.org', icon: Wind, color: 'text-blue-500', bg: 'bg-blue-500/10', desc: 'Decentralized social protocol shard.' },
  { name: 'Facebook', url: 'https://www.facebook.com/share/1MuDmrsDo9/', icon: Facebook, color: 'text-blue-700', bg: 'bg-blue-700/10', desc: 'Community outreach and social care.' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/modern-agrarian-revolution', icon: Linkedin, color: 'text-blue-600', bg: 'bg-blue-600/10', desc: 'Institutional partnerships & B2B.' },
];

const FAQS = [
  { 
    q: "What is the C(a)™ Agro Code?", 
    a: "The Agricultural Code is a mathematical formula (C(a) = x * ((r^n - 1) / (r - 1)) + 1) used to quantify the cumulative regenerative output of a farm node over time.", 
    category: "Technical" 
  },
  { 
    q: "How does the Five Thrusts™ (SEHTI) framework work?", 
    a: "It integrates Societal, Environmental, Human, Technological, and Industry pillars into a unified sustainability calculus for decentralized agricultural management.", 
    category: "Framework" 
  },
  { 
    q: "What is Social Influenza Disease (SID)?", 
    a: "SID represents social pathogens (ideological overcrowding, trust decay) that negatively impact 'x' (social immunity) and overall node productivity.", 
    category: "Societal" 
  },
  { 
    q: "How do I earn EAC rewards?", 
    a: "Stewards earn EAC (EnvirosAgro Credits) by uploading scientific field evidence, validating research shards, and maintaining a high m™ constant resilience.", 
    category: "Economy" 
  },
  { 
    q: "What is the role of the m™ Time Signature?", 
    a: "m™ is the resilience constant (m = sqrt((Dn * In * C(a)) / S)) that determines how effectively a node preserves its value over a crop cycle.", 
    category: "Technical" 
  },
  { 
    q: "How can I participate in Tender Auctions?", 
    a: "Qualified stewards with a high reputation score and verified skills can bid on large-scale industrial projects via the Industrial Cloud.", 
    category: "Governance" 
  }
];

const TRADEMARKS = [
  { name: 'EnvirosAgro™', type: 'Primary Organization', desc: 'The overarching ecosystem for sustainable agricultural decentralization and blockchain coordination.' },
  { name: 'WhatIsAG™', type: 'Philosophical Definition', desc: 'Defines agriculture as an application of art or science from nature by human beings towards natural resources (Animals, plants, water, soil and air) for sustainability.' },
  { name: 'Five Thrusts™ (SEHTI)', type: 'Strategic Framework', desc: 'The mandatory quintuplicate pillar system (Societal, Environmental, Human, Technological, Industry) governing all registry nodes.' },
  { name: 'C(a)™ Agro Code', type: 'Mathematical Identity', desc: 'Proprietary formula for calculating node-specific agricultural growth density and regenerative value.' },
  { name: 'm™ Constant', type: 'Resilience Signature', desc: 'Proprietary time-signature metric for quantifying industrial stability, recovery, and ecosystem durability.' },
  { name: 'SID™ Remediation', type: 'Societal Protocol', desc: 'The official protocol for identifying and mitigating Social Influenza Disease within decentralized farm clusters.' },
];

const FIRESTORE_RULES = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /stewards/{stewardId} {
      allow read, write: if request.auth != null && request.auth.uid == stewardId;
    }
    match /recovery_shards/{email} {
      allow read: if false; 
      allow write: if false; 
    }
    match /{shard_type}/{docId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.stewardId == request.auth.uid;
      allow update: if request.auth != null && resource.data.stewardId == request.auth.uid;
      allow delete: if false; 
    }
    match /telemetry/{esin} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (request.auth.token.esin == esin || exists(/databases/$(database)/documents/auditors/$(request.auth.token.email)));
    }
  }
}`;

const EnvirosAgroRocket: React.FC = () => {
  return (
    <div className="relative py-24 flex flex-col items-center bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent rounded-[80px] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
      
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        <div className="relative w-80 md:w-96 flex flex-col items-center">
          {/* Rocket Tip */}
          <div className="w-0 h-0 border-l-[160px] border-l-transparent border-r-[160px] border-r-transparent border-b-[180px] border-b-emerald-600 rounded-t-[100px] relative drop-shadow-[0_20px_50px_rgba(5,150,105,0.3)]">
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full text-center">
              <span className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.5em] drop-shadow-md">EnvirosAgro™</span>
            </div>
          </div>
          
          {/* Rocket Body */}
          <div className="w-full bg-emerald-700/90 border-x-4 border-emerald-500 py-14 px-10 flex flex-col items-center text-center space-y-10 -mt-1 shadow-2xl backdrop-blur-xl">
            <div className="space-y-4">
              <div className="flex justify-center gap-2 mb-2">
                 <Eye className="w-6 h-6 text-emerald-200" />
              </div>
              <h4 className="text-2xl font-black text-white uppercase tracking-widest italic">Vision</h4>
              <p className="text-emerald-50 font-bold leading-relaxed max-w-xs text-lg">
                To have socioeconomic and healthy future for agricultural community
              </p>
            </div>
            
            <div className="w-2/3 h-px bg-emerald-400/30"></div>

            <div className="space-y-4">
              <div className="flex justify-center gap-2 mb-2">
                 <Target className="w-6 h-6 text-emerald-200" />
              </div>
              <h4 className="text-2xl font-black text-white uppercase tracking-widest italic">Mission</h4>
              <p className="text-emerald-50 font-bold leading-relaxed max-w-xs text-lg">
                To ensure agriculture and its environ is smooth, reliable and safe
              </p>
            </div>
          </div>
        </div>

        {/* Rocket Thrusters */}
        <div className="grid grid-cols-5 gap-4 md:gap-8 w-full mt-4 max-w-3xl">
          {[
            { label: 'Social', id: '1', col: 'bg-emerald-600', delay: '0s' },
            { label: 'Environmental', id: '2', col: 'bg-emerald-500', delay: '0.1s' },
            { label: 'Health', id: '3', col: 'bg-emerald-400', delay: '0.2s' },
            { label: 'Technical', id: '4', col: 'bg-emerald-300', delay: '0.3s' },
            { label: 'Industrial', id: '5', col: 'bg-emerald-200', delay: '0.4s' },
          ].map((thrust, i) => (
            <div key={i} className="flex flex-col items-center group">
              <div className={`w-14 md:w-24 h-36 md:h-56 ${thrust.col} rounded-t-full relative border-x-2 border-white/10 flex items-center justify-center shadow-lg group-hover:-translate-y-2 transition-transform duration-500`}>
                <div className="absolute top-1/2 -translate-y-1/2 rotate-[-90deg] whitespace-nowrap">
                   <p className="text-[7px] md:text-[10px] font-black text-black uppercase tracking-widest">Thrust {thrust.id}:{thrust.label}</p>
                </div>
              </div>
              <div className="mt-1 flex flex-col items-center">
                <div 
                  className="w-4 h-16 md:w-8 md:h-32 bg-gradient-to-b from-orange-500 via-amber-400 to-transparent rounded-full animate-pulse opacity-80 blur-[2px]"
                  style={{ animationDelay: thrust.delay }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const InfoPortal: React.FC<InfoPortalProps> = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'environments' | 'faq' | 'crm_chat' | 'trademarks' | 'privacy' | 'registry_rules' | 'contact'>('about');
  const [supportChat, setSupportChat] = useState<{ role: 'user' | 'bot', text: string, time: string }[]>([
    { role: 'bot', text: "Hello Steward. I am the EnvirosAgro™ Governance Assistant. Describe any friction shards you are encountering within the industrial mesh.", time: new Date().toLocaleTimeString() }
  ]);
  const [supportInput, setSupportInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [supportChat]);

  const handleSupportSend = async () => {
    if (!supportInput.trim() || isTyping) return;
    const msg = supportInput.trim();
    setSupportInput('');
    setSupportChat(prev => [...prev, { role: 'user', text: msg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setIsTyping(true);

    try {
        const response = await chatWithAgroExpert(msg, supportChat.map(c => ({ role: c.role === 'bot' ? 'model' : 'user', parts: [{ text: c.text }] })));
        setSupportChat(prev => [...prev, { role: 'bot', text: response.text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch (e) {
        setSupportChat(prev => [...prev, { role: 'bot', text: "Handshake Timeout. Oracle link unstable.", time: 'SYNC_ERROR' }]);
    } finally {
        setIsTyping(false);
    }
  };

  const tabs = [
    { id: 'about', label: 'About & Mission', icon: Info },
    { id: 'crm_chat', label: 'CRM Support Shard', icon: MessagesSquare },
    { id: 'registry_rules', label: 'Registry Security', icon: ShieldCheck },
    { id: 'environments', label: 'Environments', icon: Share2 },
    { id: 'faq', label: 'Expert Q&A', icon: MessageCircleQuestion },
    { id: 'trademarks', label: 'Trademarks & IP', icon: Copyright },
    { id: 'privacy', label: 'Privacy & Data', icon: Lock },
    { id: 'contact', label: 'HQ Contact', icon: Globe },
  ];

  return (
    <div className="max-w-[1500px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32 px-4 relative overflow-hidden">
      
      {/* Dynamic Tab Bar - Industrial Styling */}
      <div className="flex overflow-x-auto scrollbar-hide gap-4 p-2 glass-card rounded-[32px] w-full lg:w-fit mx-auto border border-white/5 bg-black/40 shadow-2xl px-6 relative z-30">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-emerald-600 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] scale-105 ring-4 ring-white/5 border-b-4 border-emerald-400' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[850px] relative z-20">
        
        {/* --- VIEW: ABOUT & MISSION --- */}
        {activeTab === 'about' && (
          <div className="space-y-20 animate-in fade-in duration-700">
            <div className="text-center space-y-8 max-w-5xl mx-auto">
              <div className="inline-block px-6 py-2 bg-emerald-500/10 text-emerald-400 text-[11px] font-black uppercase rounded-full tracking-[0.6em] border border-emerald-500/20 shadow-inner italic mb-4">PLANETARY_STEWARDSHIP_CORE</div>
              <h2 className="text-6xl md:text-9xl font-black text-white leading-[0.85] tracking-tighter uppercase italic drop-shadow-2xl">
                ABOUT <span className="text-emerald-400">ENVIROSAGRO.</span>
              </h2>
              <p className="text-slate-400 text-2xl md:text-4xl font-medium italic leading-relaxed">
                "We are the architectural layer of the next agricultural revolution. A decentralized ecosystem where biological biometrics meet industrial finality."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
               {[
                 { l: 'CORE PILLARS', v: 'SEHTI', i: Layers, c: 'text-emerald-400', d: 'Societal, Environmental, Human, Technological, Industrial.' },
                 { l: 'RECOVERY RATE', v: 'm-Resonance', i: Activity, c: 'text-blue-400', d: 'Calculating industrial durability via mathematical time-signatures.' },
                 { l: 'TRUST LAYER', i: Fingerprint, v: 'ESIN Node', c: 'text-indigo-400', d: 'Sovereign identity anchoring for land stewards.' },
                 { l: 'ASSET CLASS', i: Binary, v: 'EAC Credits', c: 'text-amber-500', d: 'Deflationary utility sharding backed by physical yield.' },
               ].map((card, i) => (
                 <div key={i} className="glass-card p-12 rounded-[64px] border-2 border-white/5 bg-black/40 hover:border-emerald-500/40 transition-all group flex flex-col justify-between h-[480px] shadow-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform duration-[10s]"><card.i size={200} /></div>
                    <div className="space-y-8 relative z-10">
                       <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:rotate-6 transition-transform shadow-inner">
                          <card.i size={32} className={card.c} />
                       </div>
                       <div className="space-y-2">
                         <p className="text-[11px] text-slate-600 font-black uppercase tracking-widest leading-none">{card.l}</p>
                         <h4 className="text-4xl font-black text-white uppercase italic leading-tight m-0">{card.v}</h4>
                       </div>
                       <p className="text-lg text-slate-500 italic font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">"{card.d}"</p>
                    </div>
                    <div className="flex justify-end relative z-10">
                      <div className="p-4 bg-white/5 rounded-2xl text-slate-800 group-hover:text-emerald-400 transition-colors shadow-2xl">
                         <ArrowRight size={24} />
                      </div>
                    </div>
                 </div>
               ))}
            </div>

            <EnvirosAgroRocket />
          </div>
        )}

        {/* --- VIEW: CRM SUPPORT TERMINAL --- */}
        {activeTab === 'crm_chat' && (
           <div className="max-w-6xl mx-auto h-[850px] glass-card rounded-[80px] border-2 border-emerald-500/20 bg-black/60 shadow-3xl overflow-hidden flex flex-col relative">
              <div className="absolute inset-0 pointer-events-none opacity-10">
                 <div className="w-full h-[3px] bg-emerald-500 absolute top-0 animate-scan"></div>
              </div>

              <div className="p-12 md:p-16 border-b border-white/5 bg-white/[0.01] flex items-center justify-between shrink-0 relative z-10">
                 <div className="flex items-center gap-10">
                    <div className="w-24 h-24 bg-emerald-600 rounded-[32px] flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.4)] border-4 border-white/10 animate-pulse relative overflow-hidden group">
                       <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                       <Bot size={48} className="text-white relative z-10 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                       <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Support <span className="text-emerald-400">Terminal</span></h3>
                       <p className="text-emerald-400/60 text-[11px] font-mono tracking-[0.5em] uppercase mt-4">ZK_SUPPORT_SESSION_#842 // STABLE_ORACLE</p>
                    </div>
                 </div>
                 <div className="hidden md:flex flex-col items-end gap-3">
                    <div className="flex items-center gap-3 px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                       <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest">INGEST_OK</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-700">NODE: {user.esin}</span>
                 </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 md:p-20 space-y-12 custom-scrollbar bg-black/40 relative z-10">
                 {supportChat.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                       <div className={`flex flex-col gap-4 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className={`flex items-center gap-4 mb-1 px-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 shadow-lg ${msg.role === 'user' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-emerald-600/20 text-emerald-400'}`}>
                                {msg.role === 'user' ? <UserIcon size={20} /> : <Bot size={20} />}
                             </div>
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{msg.role === 'user' ? user.name : 'NEXUS_ORACLE'}</span>
                          </div>
                          <div className={`p-10 rounded-[56px] text-xl leading-relaxed shadow-3xl relative overflow-hidden ${
                             msg.role === 'user' 
                               ? 'bg-indigo-600 text-white rounded-tr-none' 
                               : 'glass-card border border-white/10 rounded-tl-none italic bg-black/90 text-slate-200'
                          }`}>
                             {msg.role === 'bot' && <div className="absolute top-0 right-0 p-6 opacity-[0.03]"><Sparkles size={150} /></div>}
                             <p className="relative z-10 whitespace-pre-line font-medium leading-loose">{msg.text}</p>
                          </div>
                          <span className="text-[9px] font-mono text-slate-700 px-10 font-bold uppercase tracking-[0.4em]">{msg.time} // EOS_SYNC</span>
                       </div>
                    </div>
                 ))}
                 {isTyping && (
                    <div className="flex justify-start">
                       <div className="bg-white/5 border border-white/10 p-8 rounded-[48px] rounded-tl-none flex gap-4 shadow-inner">
                          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce"></div>
                          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse delay-200"></div>
                       </div>
                    </div>
                 )}
              </div>

              <div className="p-12 md:p-16 border-t border-white/5 bg-black/95 relative z-20">
                 <div className="relative max-w-5xl mx-auto group">
                    <textarea 
                      value={supportInput}
                      onChange={e => setSupportInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSupportSend())}
                      placeholder="Input support signal (e.g. 'Node m-constant drift detected')..."
                      className="w-full bg-white/5 border border-white/10 rounded-[48px] py-10 pl-14 pr-32 text-2xl text-white focus:outline-none focus:ring-8 focus:ring-emerald-500/5 transition-all placeholder:text-slate-800 resize-none h-40 shadow-inner italic" 
                    />
                    <button 
                      onClick={handleSupportSend}
                      disabled={isTyping || !supportInput.trim()}
                      className="absolute right-8 bottom-8 p-8 bg-emerald-600 rounded-[32px] text-white shadow-[0_0_50px_rgba(16,185,129,0.3)] hover:bg-emerald-500 transition-all disabled:opacity-30 active:scale-90 group-hover:scale-105 border border-white/10"
                    >
                       <Send size={36} />
                    </button>
                 </div>
                 <p className="text-center mt-10 text-[10px] font-black text-slate-700 uppercase tracking-[0.8em]">OFFICIAL_SUPPORT_HANDSHAKE_v6.2 // SECURE_SHARD_CHANNEL</p>
              </div>
           </div>
        )}

        {/* --- VIEW: REGISTRY SECURITY RULES --- */}
        {activeTab === 'registry_rules' && (
           <div className="space-y-12 animate-in slide-in-from-right-4 duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                 <div className="lg:col-span-8 glass-card p-12 md:p-20 rounded-[80px] border-2 border-indigo-500/20 bg-black/60 shadow-[0_40px_100px_rgba(0,0,0,0.9)] space-y-16 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-[15s]"><Lock size={800} className="text-indigo-400" /></div>
                    
                    <div className="relative z-10 text-center space-y-10 border-b border-white/5 pb-16">
                       <div className="w-32 h-32 bg-indigo-600 rounded-[48px] flex items-center justify-center shadow-3xl mx-auto border-4 border-white/10 ring-[15px] ring-indigo-500/5 animate-float">
                          <Terminal size={64} className="text-white" />
                       </div>
                       <div>
                          <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Security <span className="text-indigo-400">Statutes</span></h3>
                          <p className="text-slate-500 text-2xl font-medium italic mt-6 max-w-2xl mx-auto leading-relaxed opacity-80">"Defining the cryptographic permissions governing data sharding and node synchronization."</p>
                       </div>
                    </div>

                    <div className="relative z-10 bg-black/80 rounded-[64px] p-12 border border-white/5 shadow-inner overflow-x-auto custom-scrollbar group/code">
                       <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">FIRESTORE_SECURITY_V6.0</span>
                          <div className="flex gap-2">
                             <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20"></div>
                          </div>
                       </div>
                       <pre className="text-base font-mono text-blue-300/80 leading-[2] select-all scrollbar-hide">
                          {FIRESTORE_RULES}
                       </pre>
                    </div>
                 </div>

                 <div className="lg:col-span-4 space-y-10">
                    <div className="p-12 glass-card rounded-[64px] border border-blue-500/20 bg-blue-500/5 space-y-10 shadow-2xl relative overflow-hidden group/proto">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover/proto:scale-125 transition-transform"><Shield size={200} /></div>
                       <h4 className="text-2xl font-black text-white uppercase italic tracking-widest flex items-center gap-6 border-b border-white/5 pb-8 relative z-10">
                          <Info size={40} className="text-blue-400" /> Protocol
                       </h4>
                       <p className="text-slate-400 text-xl leading-relaxed italic relative z-10 font-medium opacity-80 group-hover/proto:opacity-100">
                         "Rules ensure identity sovereignty. Data is immutable once anchored. Every write shard requires a valid ESIN biometric token."
                       </p>
                    </div>
                    <button 
                      onClick={() => { navigator.clipboard.writeText(FIRESTORE_RULES); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); }}
                      className="w-full py-12 bg-indigo-600 hover:bg-indigo-500 rounded-[48px] text-white font-black text-sm uppercase tracking-[0.6em] shadow-[0_0_80px_rgba(99,102,241,0.3)] active:scale-95 transition-all flex items-center justify-center gap-6 border-2 border-white/10 ring-[16px] ring-white/5"
                    >
                       {isCopied ? <CheckCircle2 size={36} /> : <Copy size={36} />}
                       {isCopied ? 'COPIED_TO_BUFFER' : 'COPY_SECURITY_SHARD'}
                    </button>
                    <div className="p-10 glass-card rounded-[56px] border border-emerald-500/10 bg-emerald-500/5 flex items-center justify-between shadow-xl">
                       <div className="space-y-1">
                          <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Handshake Status</p>
                          <p className="text-2xl font-mono font-black text-emerald-400">VERIFIED</p>
                       </div>
                       <ShieldCheck size={40} className="text-emerald-500" />
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: EXPERT Q&A (FAQ) --- */}
        {activeTab === 'faq' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in slide-in-from-bottom-8 duration-700">
              <div className="lg:col-span-3 space-y-10">
                 <div className="glass-card p-12 rounded-[64px] border-indigo-500/20 bg-indigo-500/5 text-center space-y-10 shadow-3xl group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform"><MessageCircleQuestion size={200} /></div>
                    <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white mx-auto shadow-[0_0_50px_rgba(99,102,241,0.3)] border-2 border-white/10 relative z-10 animate-float">
                       <MessageCircleQuestion size={48} />
                    </div>
                    <div className="space-y-4 relative z-10">
                       <h4 className="text-3xl font-black text-white uppercase italic m-0 leading-tight">Inquiry <br/> <span className="text-indigo-400">Oracle</span></h4>
                       <p className="text-slate-500 text-lg italic font-medium leading-relaxed opacity-80">"Analyzing the most frequent industrial sharding queries."</p>
                    </div>
                 </div>
                 <div className="p-10 glass-card rounded-[56px] border border-white/5 bg-black/40 space-y-6 shadow-xl text-center">
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em]">Node Sync Status</p>
                    <div className="flex items-center justify-center gap-4">
                       <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                       <span className="text-2xl font-mono font-black text-white">99.8%</span>
                    </div>
                 </div>
              </div>
              <div className="lg:col-span-9 grid gap-10">
                 {FAQS.map((faq, i) => (
                    <div key={i} className="glass-card p-12 md:p-16 rounded-[72px] border-2 border-white/5 bg-black/40 group hover:border-emerald-500/40 transition-all shadow-3xl relative overflow-hidden active:scale-[0.99] duration-300">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity"><Quote size={250} /></div>
                       <div className="flex justify-between items-start mb-10 relative z-10">
                          <span className="px-5 py-2 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black text-slate-500 uppercase tracking-widest backdrop-blur-md shadow-inner">{faq.category} Shard</span>
                          <span className="text-[10px] font-mono text-slate-800 font-black">#FAQ_0{i+1}</span>
                       </div>
                       <h4 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 group-hover:text-emerald-400 transition-colors leading-[1.1] relative z-10">
                          "{faq.q}"
                       </h4>
                       <div className="mt-12 pt-10 border-t border-white/5 relative z-10">
                          <p className="text-slate-400 text-2xl leading-relaxed italic font-medium pl-12 border-l-8 border-emerald-500/30 font-serif">
                             {faq.a}
                          </p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* --- VIEW: ENVIRONMENTS --- */}
        {activeTab === 'environments' && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in slide-in-from-right-4 duration-700">
              {ENVIRONMENTS.map((env, i) => (
                <a key={i} href={env.url} target="_blank" rel="noopener noreferrer" className="glass-card p-12 rounded-[64px] border-2 border-white/5 hover:border-blue-500/40 hover:bg-blue-600/5 transition-all flex flex-col items-center text-center gap-10 group shadow-3xl relative overflow-hidden h-[520px] active:scale-95">
                   <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <div className={`w-24 h-24 rounded-[32px] ${env.bg} flex items-center justify-center shadow-3xl group-hover:scale-110 border-2 border-white/10 transition-transform ${env.color} ring-8 ring-transparent group-hover:ring-white/5`}>
                      <env.icon size={48} />
                   </div>
                   <div className="space-y-4 relative z-10 flex-1 flex flex-col justify-center">
                     <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none group-hover:text-blue-400 transition-colors">{env.name}</h4>
                     <p className="text-slate-500 italic text-xl opacity-80 group-hover:opacity-100 leading-relaxed px-4">"{env.desc}"</p>
                   </div>
                   <div className="flex items-center justify-center gap-4 text-[11px] font-black text-blue-400 uppercase tracking-widest group-hover:translate-x-1 transition-transform mt-auto pt-8 border-t border-white/5 w-full">
                      SYNC EXTERNAL SHARD <ExternalLink size={18} />
                   </div>
                </a>
              ))}
           </div>
        )}

        {/* --- VIEW: TRADEMARKS & IP --- */}
        {activeTab === 'trademarks' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in zoom-in duration-500">
             {TRADEMARKS.map((tm, i) => (
                <div key={i} className="glass-card p-12 md:p-16 rounded-[80px] border-2 border-white/5 bg-black/40 flex flex-col group hover:border-amber-500/40 transition-all shadow-3xl relative overflow-hidden h-[550px] active:scale-[0.98]">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><Database size={400} className="text-amber-400" /></div>
                   <div className="flex justify-between items-start mb-12 relative z-10">
                      <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 text-amber-500 shadow-3xl group-hover:rotate-6 transition-all ring-8 ring-amber-500/5">
                         <BadgeCheck size={48} />
                      </div>
                      <div className="text-right">
                        <span className="px-5 py-2 bg-black/80 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-inner text-amber-500/80">REG_MARK_{i+1}</span>
                        <p className="text-[11px] text-slate-700 font-mono mt-4 uppercase font-black italic">SHARD_ID: IP_0{i+1}_EOS</p>
                      </div>
                   </div>
                   <div className="flex-1 space-y-6 relative z-10">
                      <div className="space-y-2">
                        <h4 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter m-0 leading-[0.9] group-hover:text-amber-400 transition-colors drop-shadow-2xl">{tm.name}</h4>
                        <p className="text-[11px] text-amber-500/60 font-black uppercase tracking-[0.6em] italic">{tm.type}</p>
                      </div>
                      <p className="text-xl md:text-2xl text-slate-400 leading-relaxed italic mt-8 opacity-80 group-hover:opacity-100 transition-opacity font-medium border-l-4 border-amber-500/20 pl-10 font-serif">"{tm.desc}"</p>
                   </div>
                   <div className="mt-14 pt-10 border-t border-white/5 text-[10px] font-black text-slate-700 uppercase tracking-[0.8em] relative z-10 flex justify-between items-center">
                      <span>Immutable IP Shard</span>
                      <Stamp size={24} className="opacity-20" />
                   </div>
                </div>
             ))}
          </div>
        )}

        {/* --- VIEW: PRIVACY & DATA --- */}
        {activeTab === 'privacy' && (
          <div className="max-w-6xl mx-auto space-y-16 animate-in slide-in-from-bottom-10 duration-700">
             <div className="glass-card p-16 md:p-24 rounded-[80px] border-2 border-blue-500/20 bg-blue-950/10 flex flex-col items-center text-center space-y-12 shadow-[0_60px_150px_rgba(0,0,0,0.9)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.04] group-hover:rotate-12 transition-transform duration-[20s] pointer-events-none"><ShieldCheck size={800} className="text-blue-400" /></div>
                
                <div className="w-48 h-48 bg-blue-600 rounded-[56px] flex items-center justify-center shadow-[0_0_100px_rgba(59,130,246,0.3)] animate-float relative z-10 border-4 border-white/10 ring-[20px] ring-blue-500/5 group-hover:scale-105 transition-transform duration-1000">
                   <Fingerprint size={100} className="text-white" />
                </div>
                
                <div className="space-y-8 relative z-10">
                   <h2 className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">ZK-PROOFS & <span className="text-blue-400">PRIVACY</span></h2>
                   <p className="text-slate-400 text-2xl md:text-4xl font-medium italic max-w-4xl mx-auto leading-relaxed">
                      "Utilizing Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge (ZK-SNARKs) to prove node sustainability without revealing steward biometrics."
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl relative z-10 pt-16 border-t border-white/10">
                   <div className="p-12 bg-black/60 rounded-[56px] border-2 border-white/5 text-left space-y-8 shadow-inner group/box hover:border-blue-500/40 transition-all flex flex-col justify-between">
                      <div className="space-y-6">
                        <div className="flex items-center gap-6">
                           <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400 shadow-2xl"><Lock size={32} /></div>
                           <h4 className="text-3xl font-black text-white uppercase italic m-0">Data Sovereignty</h4>
                        </div>
                        <p className="text-slate-500 text-lg leading-relaxed italic opacity-80 group-hover/box:opacity-100 font-medium">"Stewards retain 100% ownership of raw telemetry. Only the 'Truth-Shard' is anchored to the global industrial registry."</p>
                      </div>
                      <div className="pt-6 border-t border-white/5 flex items-center gap-3 text-[10px] font-black text-slate-700 uppercase tracking-widest">
                         <Binary size={14} /> ENCRYPTED_SHARD_ACTIVE
                      </div>
                   </div>
                   <div className="p-12 bg-black/60 rounded-[56px] border-2 border-white/5 text-left space-y-8 shadow-inner group/box hover:border-emerald-500/40 transition-all flex flex-col justify-between">
                      <div className="space-y-6">
                        <div className="flex items-center gap-6">
                           <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 shadow-2xl"><Eye size={32} className="text-emerald-400" /></div>
                           <h4 className="text-3xl font-black text-white uppercase italic m-0">Audit Anonymity</h4>
                        </div>
                        <p className="text-slate-500 text-lg leading-relaxed italic opacity-80 group-hover/box:opacity-100 font-medium">"Satellite verification protocols verify land-mass growth density (C(a)) without mapping private property shards."</p>
                      </div>
                      <div className="pt-6 border-t border-white/5 flex items-center gap-3 text-[10px] font-black text-slate-700 uppercase tracking-widest">
                         <Globe size={14} /> GLOBAL_CONSENSUS_SYNC
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- VIEW: HQ CONTACT --- */}
        {activeTab === 'contact' && (
           <div className="max-w-7xl mx-auto space-y-16 animate-in zoom-in duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                 {[
                    { l: 'HEADQUARTERS', v: '9X6C+P6, Kiriaini', i: MapPin, c: 'text-emerald-400', d: 'Primary Regional Cluster', sync: 'STABLE' },
                    { l: 'ORACLE SUPPORT', v: '0740161447', i: Headphones, c: 'text-blue-400', d: 'Steward Response Shard', sync: 'ACTIVE' },
                    { l: 'REGISTRY INGEST', v: 'envirosagro.com@gmail.com', i: Mail, c: 'text-indigo-400', d: 'Official Communication', sync: 'SYNCING' },
                 ].map((box, i) => (
                    <div key={i} className="glass-card p-12 rounded-[72px] border-2 border-white/5 bg-black/40 flex flex-col items-center text-center space-y-10 group hover:border-white/20 transition-all shadow-3xl h-[520px] relative overflow-hidden active:scale-[0.98]">
                       <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><box.i size={250} /></div>
                       <div className={`w-28 h-28 rounded-[40px] bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 ring-8 ring-transparent group-hover:ring-white/5`}>
                          <box.i size={56} className={box.c} />
                       </div>
                       <div className="space-y-6 flex-1 flex flex-col justify-center">
                          <p className="text-[11px] text-slate-600 font-black uppercase tracking-[0.4em]">{box.l}</p>
                          <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl leading-tight">{box.v}</h4>
                          <p className="text-lg text-slate-500 italic mt-6 opacity-80 group-hover:opacity-100 font-medium">"{box.d}"</p>
                       </div>
                       <div className="mt-auto w-full pt-8 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full animate-pulse ${box.c.replace('text', 'bg')}`}></div>
                             <span className={`text-[9px] font-mono font-black uppercase tracking-widest ${box.c}`}>{box.sync}</span>
                          </div>
                          <button className="text-[11px] font-black text-white uppercase tracking-[0.5em] flex items-center gap-4 group/link transition-all hover:text-emerald-400">
                             Connect <ArrowRight size={20} className="group-hover/link:translate-x-2 transition-transform" />
                          </button>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="p-16 md:p-24 glass-card rounded-[80px] border-2 border-white/5 bg-black/60 shadow-[0_40px_150px_rgba(0,0,0,0.8)] relative overflow-hidden group/map flex flex-col lg:flex-row items-center gap-20">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                 <div className="w-full lg:w-1/2 h-[500px] rounded-[64px] border-4 border-white/5 bg-slate-950 relative overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] group-hover/map:border-emerald-500/20 transition-all duration-1000">
                    {/* Stylized Node Map visualizer */}
                    <div className="absolute inset-0 flex items-center justify-center">
                       <MapIcon size={300} className="text-slate-900 opacity-40 animate-pulse" />
                       <div className="absolute top-[40%] left-[55%]">
                          <div className="w-20 h-20 bg-emerald-500 rounded-full animate-ping opacity-30"></div>
                          <div className={`w-6 h-6 bg-emerald-500 rounded-full shadow-[0_0_50px_#10b981] relative z-10 border-4 border-white animate-pulse`}></div>
                       </div>
                       {[...Array(12)].map((_, i) => (
                          <div key={i} className="absolute w-2 h-2 bg-indigo-500/40 rounded-full" style={{ 
                            top: `${20 + Math.random() * 60}%`, 
                            left: `${20 + Math.random() * 60}%` 
                          }}></div>
                       ))}
                    </div>
                    <div className="absolute bottom-12 left-12 p-8 glass-card rounded-[40px] border border-white/10 bg-black/80 backdrop-blur-2xl shadow-3xl">
                       <p className="text-[11px] text-slate-500 font-black uppercase mb-2 tracking-[0.4em]">Primary Registry Node</p>
                       <div className="flex items-center gap-4">
                          <h4 className="text-3xl font-black text-emerald-400 uppercase italic leading-none m-0">9X6C+P6_ACTIVE</h4>
                          <BadgeCheck size={28} className="text-emerald-500" />
                       </div>
                    </div>
                 </div>
                 <div className="flex-1 space-y-10 relative z-10 text-center lg:text-left">
                    <div className="space-y-4">
                       <span className="px-5 py-2 bg-emerald-500/10 text-emerald-400 text-[11px] font-black uppercase rounded-full border border-emerald-500/20 tracking-[0.5em] shadow-inner italic">JOIN_THE_QUORUM</span>
                       <h3 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">Regional <span className="text-emerald-400">Command.</span></h3>
                    </div>
                    <p className="text-slate-400 text-2xl md:text-3xl font-medium leading-relaxed italic opacity-80 max-w-3xl">
                       "HQ Stewards are available for node calibration, physical audit coordination, and multi-thrust strategic guidance across all 12 regional clusters."
                    </p>
                    <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-6">
                       <button className="p-10 bg-white/5 border-2 border-white/10 rounded-[40px] text-emerald-400 hover:text-white hover:bg-emerald-600 transition-all shadow-2xl active:scale-90"><MessagesSquare size={40} /></button>
                       <button className="p-10 bg-white/5 border-2 border-white/10 rounded-[40px] text-blue-400 hover:text-white hover:bg-blue-600 transition-all shadow-2xl active:scale-90"><Headphones size={40} /></button>
                       <button className="p-10 bg-white/5 border-2 border-white/10 rounded-[40px] text-indigo-400 hover:text-white hover:bg-indigo-600 transition-all shadow-2xl active:scale-90"><MapIcon size={40} /></button>
                    </div>
                 </div>
              </div>
           </div>
        )}

      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        
        .shadow-3xl { box-shadow: 0 50px 100px -30px rgba(0, 0, 0, 0.9); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
      `}</style>
    </div>
  );
};

export default InfoPortal;