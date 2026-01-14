import React, { useState, useRef, useEffect } from 'react';
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
  HelpCircle as QuestionIcon,
  MessageCircleQuestion,
  Eye,
  Lightbulb,
  Leaf,
  RefreshCw,
  Sun,
  Landmark,
  Layers,
  Target,
  Sparkles,
  Rocket,
  Flame,
  Activity,
  Copyright,
  Shield,
  Award,
  CheckCircle2,
  BadgeCheck,
  Headphones,
  Terminal,
  MessagesSquare
} from 'lucide-react';
import { chatWithAgroExpert } from '../services/geminiService';

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

const CORE_PRINCIPLES = [
  'Integration', 'Vision', 'Innovation', 'Sustainability', 'Kaizen'
];

const CORE_VALUES = [
  'Ethical', 'Communal', 'Optimistic', 'Supportive', 'Governed'
];

const TRADEMARKS = [
  { name: 'EnvirosAgro™', type: 'Primary Organization', desc: 'The overarching ecosystem for sustainable agricultural decentralization and blockchain coordination.' },
  { name: 'WhatIsAG™', type: 'Philosophical Definition', desc: 'Defines agriculture as an application of art or science from nature by human beings towards natural resources (Animals, plants, water, soil and air) for sustainability.' },
  { name: 'Five Thrusts™ (SEHTI)', type: 'Strategic Framework', desc: 'The mandatory quintuplicate pillar system (Societal, Environmental, Human, Technological, Industry) governing all registry nodes.' },
  { name: 'C(a)™ Agro Code', type: 'Mathematical Identity', desc: 'Proprietary formula for calculating node-specific agricultural growth density and regenerative value.' },
  { name: 'm™ Constant', type: 'Resilience Signature', desc: 'Proprietary time-signature metric for quantifying industrial stability, recovery, and ecosystem durability.' },
  { name: 'SID™ Remediation', type: 'Societal Protocol', desc: 'The official protocol for identifying and mitigating Social Influenza Disease within decentralized farm clusters.' },
];

const EnvirosAgroRocket: React.FC = () => {
  return (
    <div className="relative py-24 flex flex-col items-center bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent rounded-[80px] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
      
      {/* Main Rocket Assembly */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        
        {/* Top Nose Cone */}
        <div className="relative w-80 md:w-96 flex flex-col items-center">
          <div className="w-0 h-0 border-l-[160px] border-l-transparent border-r-[160px] border-r-transparent border-b-[180px] border-b-emerald-600 rounded-t-[100px] relative drop-shadow-[0_20px_50px_rgba(5,150,105,0.3)]">
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full text-center">
              <span className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.5em] drop-shadow-md">EnvirosAgro™</span>
            </div>
          </div>
          
          {/* Main Module: Vision & Mission */}
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
                To ensure agriculture and it's environ is smooth, reliable and safe
              </p>
            </div>
          </div>
        </div>

        {/* The Five Thrusts Propulsion System */}
        <div className="grid grid-cols-5 gap-4 md:gap-8 w-full mt-4 max-w-3xl">
          {[
            { label: 'Social', id: '1', col: 'bg-emerald-600', delay: '0s' },
            { label: 'Environmental', id: '2', col: 'bg-emerald-500', delay: '0.1s' },
            { label: 'Health', id: '3', col: 'bg-emerald-400', delay: '0.2s' },
            { label: 'Technical', id: '4', col: 'bg-emerald-300', delay: '0.3s' },
            { label: 'Industrial', id: '5', col: 'bg-emerald-200', delay: '0.4s' },
          ].map((thrust, i) => (
            <div key={i} className="flex flex-col items-center group">
              {/* Individual Thruster Node */}
              <div className={`w-14 md:w-24 h-36 md:h-56 ${thrust.col} rounded-t-full relative border-x-2 border-white/10 flex items-center justify-center shadow-lg group-hover:-translate-y-2 transition-transform duration-500`}>
                <div className="absolute top-1/2 -translate-y-1/2 rotate-[-90deg] whitespace-nowrap">
                   <p className="text-[7px] md:text-[10px] font-black text-black uppercase tracking-widest">Thrust {thrust.id}:{thrust.label}</p>
                </div>
                <div className="absolute top-4 w-1/2 h-2 bg-black/10 rounded-full"></div>
              </div>
              {/* Animated Engine Flame */}
              <div className="mt-1 flex flex-col items-center">
                <div 
                  className="w-4 h-16 md:w-8 md:h-32 bg-gradient-to-b from-orange-500 via-amber-400 to-transparent rounded-full animate-pulse opacity-80 blur-[2px]"
                  style={{ animationDelay: thrust.delay }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Foundation: Values & Principles Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20 w-full px-6">
          {/* Values Block */}
          <div className="glass-card p-12 rounded-[56px] border-emerald-500/30 bg-emerald-950/40 relative overflow-hidden group hover:border-emerald-500/60 transition-all">
            <div className="absolute -top-10 -left-10 p-8 opacity-[0.05] group-hover:scale-110 transition-transform group-hover:opacity-[0.08]">
               <ShieldCheck className="w-48 h-48 text-emerald-400" />
            </div>
            <h4 className="text-3xl font-black text-white uppercase tracking-tighter mb-10 italic flex items-center gap-4">
              <Zap className="w-8 h-8 text-emerald-400 fill-emerald-400/20" /> Values of EnvirosAgro™
            </h4>
            <ul className="grid grid-cols-1 gap-y-5">
              {CORE_VALUES.map(val => (
                <li key={val} className="flex items-center gap-4 group/item">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] group-hover/item:scale-125 transition-transform"></div>
                  <span className="text-base font-black text-slate-100 uppercase tracking-widest">{val}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Principles Block */}
          <div className="glass-card p-12 rounded-[56px] border-emerald-500/30 bg-emerald-950/40 relative overflow-hidden group hover:border-emerald-500/60 transition-all">
             <div className="absolute -top-10 -right-10 p-8 opacity-[0.05] group-hover:scale-110 transition-transform group-hover:opacity-[0.08]">
               <Landmark className="w-48 h-48 text-emerald-400" />
            </div>
            <h4 className="text-3xl font-black text-white uppercase tracking-tighter mb-10 italic flex items-center gap-4">
              <Layers className="w-8 h-8 text-emerald-400" /> Principles of EnvirosAgro™
            </h4>
            <ul className="grid grid-cols-1 gap-y-5">
              {CORE_PRINCIPLES.map(pr => (
                <li key={pr} className="flex items-center gap-4 group/item">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_100px_rgba(52,211,153,0.5)] group-hover/item:scale-125 transition-transform"></div>
                  <span className="text-base font-black text-slate-100 uppercase tracking-widest">{pr}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Global Footer Banner */}
        <div className="mt-24 text-center space-y-8 w-full max-w-3xl">
          <div className="px-16 py-6 bg-emerald-900/40 border-y border-emerald-500/30 backdrop-blur-2xl rounded-2xl">
             <h3 className="text-3xl font-black text-white uppercase tracking-[0.2em] italic drop-shadow-lg">Embracing Sustainable Agriculture</h3>
          </div>
          <div className="flex flex-col items-center gap-4">
             <h2 className="text-4xl font-black text-white tracking-[0.5em] uppercase">EnvirosAgro™ Rocket</h2>
             <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
                <div className="h-px w-48 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>
                <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const InfoPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'about' | 'environments' | 'faq' | 'crm_chat' | 'trademarks' | 'privacy' | 'contact'>('about');
  const [supportChat, setSupportChat] = useState<{ role: 'user' | 'bot', text: string, time: string }[]>([
    { role: 'bot', text: "Hello Steward. I am the EnvirosAgro™ Governance Assistant. If you are encountering friction, technical problems, or challenges within the ecosystem, please describe them here.", time: new Date().toLocaleTimeString() }
  ]);
  const [supportInput, setSupportInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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
    setSupportChat(prev => [...prev, { role: 'user', text: msg, time: new Date().toLocaleTimeString() }]);
    setIsTyping(true);

    try {
        const response = await chatWithAgroExpert(msg, supportChat.map(c => ({ role: c.role === 'bot' ? 'model' : 'user', parts: [{ text: c.text }] })));
        setSupportChat(prev => [...prev, { role: 'bot', text: response.text, time: new Date().toLocaleTimeString() }]);
    } catch (e) {
        setSupportChat(prev => [...prev, { role: 'bot', text: "Governance Oracle Sync Timeout. Please retry or contact HQ directly.", time: new Date().toLocaleTimeString() }]);
    } finally {
        setIsTyping(false);
    }
  };

  const tabs = [
    { id: 'about', label: 'About & Mission', icon: Info },
    { id: 'crm_chat', label: 'CRM Support Shard', icon: MessagesSquare },
    { id: 'environments', label: 'Environments', icon: Share2 },
    { id: 'faq', label: 'Expert Q&A', icon: MessageCircleQuestion },
    { id: 'trademarks', label: 'Trademarks & IP', icon: Copyright },
    { id: 'privacy', label: 'Privacy & Data', icon: ShieldCheck },
    { id: 'contact', label: 'HQ Contact', icon: Globe },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-wrap gap-4 p-1 glass-card rounded-2xl w-fit mx-auto overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-[40px] overflow-hidden min-h-[600px] border border-white/5">
        {activeTab === 'about' && (
          <div className="p-12 space-y-16 animate-in fade-in duration-500">
            <div className="space-y-6 text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 agro-gradient rounded-3xl flex items-center justify-center shadow-2xl">
                  <Leaf className="w-10 h-10 text-white" />
                </div>
              </div>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">EnvirosAgro™ Ecosystem</span>
              <h2 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">About <span className="text-emerald-400 italic">EnvirosAgro™</span></h2>
              <p className="text-xl text-slate-400 leading-relaxed font-medium">
                EnvirosAgro™ establishes a comprehensive network that advances agricultural sustainability. By linking farmers, researchers, and diverse stakeholders, we catalyze transformation within the global agricultural community.
              </p>
            </div>

            <div className="p-10 glass-card rounded-[48px] border-emerald-500/20 bg-emerald-500/5 grid grid-cols-1 md:grid-cols-3 gap-8 shadow-inner">
               <div className="flex items-center gap-4">
                  <BadgeCheck className="w-10 h-10 text-emerald-500" />
                  <div>
                    <h4 className="text-lg font-black text-white uppercase italic">Registry Protection</h4>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">Registered Mark.</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <Award className="w-10 h-10 text-amber-500" />
                  <div>
                    <h4 className="text-lg font-black text-white uppercase italic">Protocol Authority</h4>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">C(a)™ & m™ Proprietary.</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <ShieldCheck className="w-10 h-10 text-indigo-400" />
                  <div>
                    <h4 className="text-lg font-black text-white uppercase italic">Legal Consensus</h4>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">SEHTI™ Certified.</p>
                  </div>
               </div>
            </div>

            <EnvirosAgroRocket />
          </div>
        )}

        {activeTab === 'crm_chat' && (
          <div className="flex flex-col h-[700px] animate-in zoom-in duration-500">
             <div className="p-8 border-b border-white/5 bg-emerald-600/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-xl">
                      <Bot className="w-8 h-8" />
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic m-0">CRM <span className="text-emerald-400">Support Terminal</span></h3>
                      <p className="text-emerald-400/60 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Official Ecosystem Resolution Shard</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-slate-400 hidden md:block">
                      <span className="text-[10px] font-mono uppercase font-black">NODE_AUTH: SECURE_BY_ZK</span>
                   </div>
                </div>
             </div>

             <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-black/40">
                {supportChat.map((chat, i) => (
                  <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                     <div className={`flex flex-col gap-2 max-w-[80%] ${chat.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`p-6 rounded-[32px] text-sm md:text-base leading-relaxed shadow-2xl ${
                          chat.role === 'user' 
                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                            : 'glass-card border border-white/10 rounded-tl-none italic bg-[#0B0F0D] text-slate-200'
                        }`}>
                           {chat.text}
                        </div>
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest px-2">{chat.time}</span>
                     </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                     <div className="bg-white/5 border border-white/10 p-4 rounded-3xl rounded-tl-none flex gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-200"></div>
                     </div>
                  </div>
                )}
             </div>

             <div className="p-8 border-t border-white/5 bg-black/90">
                <div className="relative max-w-4xl mx-auto">
                   <textarea 
                    value={supportInput}
                    onChange={e => setSupportInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSupportSend())}
                    placeholder="Describe your ecosystem friction, problem, or challenge..."
                    className="w-full bg-white/5 border border-white/10 rounded-[32px] py-6 pl-8 pr-24 text-sm md:text-lg text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all placeholder:text-slate-800 resize-none h-24 shadow-inner italic" 
                   />
                   <button 
                    onClick={handleSupportSend}
                    disabled={isTyping || !supportInput.trim()}
                    className="absolute right-4 bottom-4 p-4 bg-emerald-600 rounded-2xl text-white shadow-xl hover:bg-emerald-500 transition-all disabled:opacity-30 active:scale-90"
                   >
                      <Send size={24} />
                   </button>
                </div>
                <p className="text-center mt-4 text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">Governance AI Protocol v5.0 // End-to-End Encrypted Shard</p>
             </div>
          </div>
        )}

        {activeTab === 'trademarks' && (
          <div className="p-12 space-y-12 animate-in fade-in duration-500">
             <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center border border-emerald-500/20 shadow-2xl">
                   <Shield className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                   <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Intellectual <span className="text-emerald-400">Property</span></h2>
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Registered Trademarks & Registry Protocols</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {TRADEMARKS.map((tm, i) => (
                   <div key={i} className="glass-card p-10 rounded-[44px] border border-white/5 bg-black/40 shadow-xl relative overflow-hidden">
                      <div className="flex justify-between items-start mb-8">
                         <div className="p-4 rounded-2xl bg-white/5"><Sparkles className="w-7 h-7 text-emerald-400" /></div>
                         <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-slate-500 uppercase tracking-widest">{tm.type}</span>
                      </div>
                      <h4 className="text-2xl font-black text-white uppercase italic mb-4">{tm.name}</h4>
                      <p className="text-slate-400 text-base italic leading-relaxed">{tm.desc}</p>
                   </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'environments' && (
          <div className="p-12 space-y-12 animate-in slide-in-from-right-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ENVIRONMENTS.map((env, i) => (
                  <a key={i} href={env.url} target="_blank" rel="noopener noreferrer" className="glass-card p-8 rounded-[40px] border border-white/5 hover:border-blue-500/30 transition-all flex flex-col group relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-6">
                       <div className={`w-16 h-16 rounded-[24px] ${env.bg} flex items-center justify-center border border-white/10`}><env.icon className={`w-8 h-8 ${env.color}`} /></div>
                       <h4 className="text-xl font-black text-white tracking-tight">{env.name}</h4>
                    </div>
                    <p className="text-sm text-slate-500 font-medium italic flex-1">"{env.desc}"</p>
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[9px] font-black text-blue-400 uppercase tracking-widest">
                       Connect Shard <ExternalLink className="w-4 h-4" />
                    </div>
                  </a>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="p-12 space-y-12 animate-in fade-in duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                <div className="lg:col-span-1 space-y-8">
                   <div className="glass-card p-10 rounded-[40px] border-red-500/20 bg-red-500/5 space-y-6">
                      <HelpCircle className="w-12 h-12 text-red-500" />
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Expert Quora Shard</h3>
                      <p className="text-slate-400 text-sm italic font-medium">Access deep scientific discussions directly from the registry source.</p>
                      <a href="https://www.quora.com/profile/EnvirosAgro" target="_blank" rel="noopener noreferrer" className="w-full py-5 bg-red-600 rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"><ExternalLink className="w-4 h-4" /> Open Quora</a>
                   </div>
                </div>
                <div className="lg:col-span-3 grid gap-6">
                   {FAQS.map((faq, i) => (
                     <div key={i} className="glass-card p-8 rounded-[40px] border border-white/5 group">
                        <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 inline-block">{faq.category}</span>
                        <h4 className="text-xl font-bold text-white mb-4 italic">"{faq.q}"</h4>
                        <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-emerald-500/20 pl-6 italic">{faq.a}</p>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="p-12 space-y-10 animate-in fade-in duration-500">
             <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Identity & ZK-Privacy</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <h3 className="text-xl font-bold text-white flex items-center gap-3"><Fingerprint className="w-6 h-6 text-emerald-400" /> ESIN Anonymity</h3>
                   <p className="text-slate-400 leading-relaxed font-medium">EnvirosAgro™ uses ZK-SNARKs to prove metrics without revealing location shards.</p>
                </div>
                <div className="space-y-6">
                   <h3 className="text-xl font-bold text-white flex items-center gap-3"><Zap className="w-6 h-6 text-amber-500" /> Data Sovereignty</h3>
                   <p className="text-slate-400 leading-relaxed font-medium">Farmers retain ownership of raw telemetry. Only consensus proofs are anchored.</p>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="p-12 space-y-12 animate-in fade-in duration-500">
             <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">HQ <span className="text-emerald-400">Contact</span></h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-card p-8 rounded-[40px] space-y-6">
                   <MapPin className="w-10 h-10 text-emerald-400" />
                   <h4 className="text-xl font-bold text-white uppercase italic">Headquarters</h4>
                   <p className="text-slate-400 text-sm font-mono leading-relaxed">9X6C+P6, Kiriaini<br/>Global Zone Node</p>
                </div>
                <div className="glass-card p-8 rounded-[40px] space-y-6">
                   <Phone className="w-10 h-10 text-blue-400" />
                   <h4 className="text-xl font-bold text-white uppercase italic">Registry Support</h4>
                   <p className="text-slate-400 text-lg font-mono font-black">0740161447</p>
                </div>
                <div className="glass-card p-8 rounded-[40px] space-y-6">
                   <Mail className="w-10 h-10 text-indigo-400" />
                   <h4 className="text-xl font-bold text-white uppercase italic">Official Ingest</h4>
                   <p className="text-slate-400 text-sm font-mono break-all leading-relaxed">envirosagro.com@gmail.com</p>
                </div>
             </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default InfoPortal;