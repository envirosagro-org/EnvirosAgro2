
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
  MessageCircle,
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
  Activity
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
              <Zap className="w-8 h-8 text-emerald-400 fill-emerald-400/20" /> Values of EnvirosAgro
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
              <Layers className="w-8 h-8 text-emerald-400" /> Principles of EnvirosAgro
            </h4>
            <ul className="grid grid-cols-1 gap-y-5">
              {CORE_PRINCIPLES.map(pr => (
                <li key={pr} className="flex items-center gap-4 group/item">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)] group-hover/item:scale-125 transition-transform"></div>
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
             <h2 className="text-4xl font-black text-white tracking-[0.5em] uppercase">EnvirosAgro Rocket</h2>
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
  const [activeTab, setActiveTab] = useState<'about' | 'environments' | 'faq' | 'guidelines' | 'privacy' | 'contact'>('about');
  const [showSupport, setShowSupport] = useState(false);
  const [supportChat, setSupportChat] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: "Hello Steward. I am the EnvirosAgro™ Governance Assistant. How can I resolve your network dispute or Five Thrusts™ protocol question today?" }
  ]);
  const [supportInput, setSupportInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const tabs = [
    { id: 'about', label: 'About & Mission', icon: Info },
    { id: 'environments', label: 'Official Environments', icon: Share2 },
    { id: 'faq', label: 'Expert Q&A (Quora)', icon: MessageCircleQuestion },
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
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
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

      <div className="glass-card rounded-[40px] overflow-hidden min-h-[600px]">
        {activeTab === 'about' && (
          <div className="p-12 space-y-16 animate-in fade-in duration-500">
            <div className="space-y-6 text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 agro-gradient rounded-3xl flex items-center justify-center shadow-2xl">
                  <Leaf className="w-10 h-10 text-white" />
                </div>
              </div>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">EnvirosAgro™ Ecosystem</span>
              <h2 className="text-6xl font-black text-white leading-tight tracking-tighter">About <span className="text-emerald-400 italic">EnvirosAgro™</span></h2>
              <p className="text-xl text-slate-400 leading-relaxed font-medium">
                EnvirosAgro is a pioneering organization committed to establishing a comprehensive network that advances and supports agricultural sustainability. By linking farmers, researchers, and diverse stakeholders, we catalyze transformation within the global agricultural community.
              </p>
            </div>

            {/* INTEGRATED ROCKET DESIGN */}
            <EnvirosAgroRocket />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-white/5">
              <div className="space-y-6 glass-card p-10 rounded-[48px] bg-emerald-500/5 border-emerald-500/10 group">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 mb-4 group-hover:scale-110 transition-transform">
                   <Target className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Industrial Ingest</h3>
                <p className="text-slate-300 leading-loose text-lg font-medium">
                  EnvirosAgro aims to promote environmentally responsible practices, facilitate knowledge exchange, and develop sustainable technologies. Our network links farmers, researchers, and diverse stakeholders within the agricultural sector.
                </p>
              </div>

              <div className="space-y-6 glass-card p-10 rounded-[48px] bg-blue-500/5 border-blue-500/10 group">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 mb-4 group-hover:scale-110 transition-transform">
                   <Eye className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Global Transformation</h3>
                <p className="text-slate-300 leading-loose text-lg font-medium">
                  Through collaboration and the dissemination of best practices, EnvirosAgro strives to catalyze positive transformation within the agricultural community, fostering a more sustainable approach.
                </p>
              </div>
            </div>

            <div className="p-12 glass-card rounded-[56px] bg-gradient-to-br from-[#050706] via-emerald-950/10 to-black border-emerald-500/20 text-center">
               <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Ensuring Longevity</h4>
               <p className="text-slate-400 max-w-3xl mx-auto text-lg italic leading-relaxed">
                  "By linking researchers and stakeholders, we ensure the long-term viability of farming for future generations, reducing environmental impact and improving resilience."
               </p>
            </div>
          </div>
        )}

        {activeTab === 'environments' && (
          <div className="p-12 space-y-12 animate-in slide-in-from-right-4 duration-500">
             <div className="space-y-4 text-center max-w-4xl mx-auto">
                <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic">Network <span className="text-blue-400">Environments</span></h2>
                <p className="text-slate-400 text-lg leading-relaxed">Official external shards of the EnvirosAgro ecosystem. Connect and interact with the global community while outside the protocol.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ENVIRONMENTS.map((env, i) => (
                  <a 
                    key={i} 
                    href={env.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="glass-card p-8 rounded-[40px] border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all flex flex-col group active:scale-[0.98] relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform">
                       <env.icon className="w-32 h-32 text-white" />
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                       <div className={`w-16 h-16 rounded-[24px] ${env.bg} flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform border border-white/10`}>
                          <env.icon className={`w-8 h-8 ${env.color}`} />
                       </div>
                       <div>
                          <h4 className="text-xl font-black text-white tracking-tight">{env.name}</h4>
                          <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">OFFICIAL_ENVIRONMENT</span>
                       </div>
                    </div>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed italic flex-1 group-hover:text-slate-300 transition-colors">"{env.desc}"</p>
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                       <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest group-hover:translate-x-1 transition-transform">Sync Node Shard</span>
                       <ExternalLink className="w-4 h-4 text-slate-700 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </a>
                ))}
             </div>
             
             <div className="p-10 glass-card rounded-[48px] bg-blue-600/5 border-blue-500/20 text-center space-y-4">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Environmental Notice</p>
                <p className="text-slate-400 text-sm italic max-w-2xl mx-auto">
                   "Stewards interacting in these environments are expected to maintain the Code of Conduct integrity. Reward payouts for external interactions are calculated via the Archive Ledger."
                </p>
             </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="p-12 space-y-12 animate-in fade-in duration-500">
             <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:col-span-1 space-y-8">
                   <div className="glass-card p-10 rounded-[40px] border-red-500/20 bg-red-500/5 space-y-6">
                      <div className="w-16 h-16 rounded-[24px] bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-xl">
                         <HelpCircle className="w-8 h-8 text-red-500" />
                      </div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Expert <span className="text-red-500">Shard</span></h3>
                      <p className="text-slate-400 text-sm leading-relaxed italic font-medium">
                         The official EnvirosAgro Expert Shard is hosted on Quora. Access deep scientific discussions and technical agriculture inquiries directly from the registry source.
                      </p>
                      <a 
                        href="https://www.quora.com/profile/EnvirosAgro?ch=10&oid=2274202272&share=cee3144a&srid=3uVNlE&target_type=user" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full py-5 bg-red-600 rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-red-900/40 hover:scale-105 transition-all flex items-center justify-center gap-3"
                      >
                         <ExternalLink className="w-4 h-4" /> Open Official Quora
                      </a>
                   </div>
                   
                   <div className="p-8 glass-card border-white/5 rounded-[32px] space-y-4">
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Agricultural Categories</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Regenerative', 'Blockchain', 'IoT Sensors', 'Soil Biome', 'Bantu Lineage', 'Carbon Offset'].map(tag => (
                          <span key={tag} className="px-3 py-1 bg-white/5 text-[9px] font-black text-slate-400 uppercase tracking-widest rounded-lg border border-white/10">{tag}</span>
                        ))}
                      </div>
                   </div>
                </div>

                <div className="flex-1 space-y-8">
                   <div className="flex items-center gap-4 mb-2">
                      <MessageCircleQuestion className="w-6 h-6 text-emerald-400" />
                      <h3 className="text-2xl font-black text-white uppercase tracking-widest italic">Frequently Asked <span className="text-emerald-400">Questions</span></h3>
                   </div>
                   <div className="grid gap-6">
                      {FAQS.map((faq, i) => (
                        <div key={i} className="glass-card p-8 rounded-[40px] border border-white/5 hover:border-emerald-500/20 transition-all group">
                           <div className="flex justify-between items-start mb-4">
                              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">{faq.category}</span>
                              <QuestionIcon className="w-5 h-5 text-slate-700 group-hover:text-emerald-400 transition-colors" />
                           </div>
                           <h4 className="text-xl font-bold text-white mb-4 leading-tight group-hover:text-emerald-400 transition-colors">"{faq.q}"</h4>
                           <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-emerald-500/20 pl-6 italic mb-6">
                              {faq.a}
                           </p>
                           <a 
                             href="https://www.quora.com/profile/EnvirosAgro" 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-2 hover:translate-x-1 transition-transform"
                           >
                              Full Thread on Quora <ArrowRight className="w-3 h-3" />
                           </a>
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
                   <p className="text-slate-400 leading-relaxed font-medium">
                      While your ESIN is unique, the EnvirosAgro™ network uses ZK-SNARKs to prove your C(a)™ Agro Code metrics to the marketplace without revealing farm location.
                   </p>
                </div>
                <div className="space-y-6">
                   <h3 className="text-xl font-bold text-white flex items-center gap-3">
                      <Zap className="w-6 h-6 text-amber-500" />
                      Data Sovereignty
                   </h3>
                   <p className="text-slate-400 leading-relaxed font-medium">
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
