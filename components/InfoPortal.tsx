
import React, { useState } from 'react';
import { 
  Info, ShieldCheck, ChevronRight, Scale, BookOpen, Globe, Zap, Users, Lock, FileText,
  AlertTriangle, HeartHandshake, X, Loader2, Send, Bot, User as UserIcon, MessageSquare,
  Fingerprint, MapPin, Phone, Mail, ExternalLink, ArrowRight, Share2, Youtube, Twitter,
  Linkedin, AtSign, Pin, HelpCircle, Cloud, Wind, Facebook, MessageCircleQuestion, Eye,
  Target, Sparkles, Copyright, Shield, Award, CheckCircle2, BadgeCheck, Terminal,
  MessagesSquare, Copy, Check, ShieldPlus, Leaf, HelpCircle as FaqIcon,
  ChevronDown
} from 'lucide-react';
import { ViewState } from '../types';

interface InfoPortalProps {
  onNavigate: (view: ViewState) => void;
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

const FAQ_ITEMS = [
  { q: "What is the m-Constant?", a: "The sustainable time constant (m) measures a node's resilience against external stress. It is calculated as the square root of (Density * Intensity * Cumulative Stewardship) divided by Stress." },
  { q: "How are Carbon Credits minted?", a: "Credits are minted via Digital MRV (Monitoring, Reporting, and Verification). Visual or IoT evidence is sharded and audited by the Oracle before EAC finality." },
  { q: "What does SEHTI stand for?", a: "Societal, Environmental, Human, Technological, and Industry. These are the five thrusts that anchor the EnvirosAgro ecosystem." },
  { q: "What is a Registry Handshake?", a: "A Handshake is a ZK-verified protocol to link physical assets (land or hardware) to your digital steward node ID (ESIN)." }
];

const EnvirosAgroRocket: React.FC = () => {
  return (
    <div className="relative py-8 flex flex-col items-center bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent rounded-[56px] overflow-hidden">
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        <div className="relative w-48 md:w-64 flex flex-col items-center">
          <div className="w-0 h-0 border-l-[80px] border-l-transparent border-r-[80px] border-r-transparent border-b-[100px] border-b-emerald-600 rounded-t-[60px] relative drop-shadow-[0_20px_40px_rgba(5,150,105,0.2)]">
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-full text-center">
              <span className="text-[6px] font-black text-emerald-100 uppercase tracking-[0.2em]">EnvirosAgro™</span>
            </div>
          </div>
          <div className="w-full bg-emerald-700/90 border-x border-emerald-500 py-6 px-6 flex flex-col items-center text-center space-y-4 -mt-1 shadow-2xl backdrop-blur-xl">
            <div className="space-y-2">
              <h4 className="text-sm font-black text-white uppercase tracking-widest italic leading-none">Vision</h4>
              <p className="text-emerald-50 font-bold leading-relaxed max-w-xs text-[10px]">Socioeconomic and healthy future for agricultural community</p>
            </div>
            <div className="w-2/3 h-px bg-emerald-400/20"></div>
            <div className="space-y-2">
              <h4 className="text-sm font-black text-white uppercase tracking-widest italic leading-none">Mission</h4>
              <p className="text-emerald-50 font-bold leading-relaxed max-w-xs text-[10px]">Smooth, reliable and safe agriculture and environ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoPortal: React.FC<InfoPortalProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'environments' | 'faq' | 'contact'>('about');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const tabs = [
    { id: 'about', label: 'About', icon: Info },
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

            <EnvirosAgroRocket />
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
        .custom-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.7); }
      `}</style>
    </div>
  );
};

export default InfoPortal;
