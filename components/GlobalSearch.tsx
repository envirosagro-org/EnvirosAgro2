
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Loader2, Search, X, Users, FileStack, ShoppingBag, ArrowRight, Command, Download, Zap, ArrowUpRight, User as UserIcon } from 'lucide-react';
import { SycamoreLogo } from './SycamoreLogo';
import { ViewState, VendorProduct } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';
import { REGISTRY_NODES, GLOBAL_STEWARD_REGISTRY, SEARCHABLE_MEDIA_LEDGER, GLOBAL_PROJECTS_MISSIONS, ITEM_CATEGORY_EXPERIENCES, LOGISTICS_SHARDS, LMS_EXAMS_MODULES, RECOMMENDED_SEARCHES } from '../constants';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (v: ViewState, section?: string) => void;
  vendorProducts: VendorProduct[];
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, onNavigate, vendorProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiDeepSuggestion, setAiDeepSuggestion] = useState<{ view: string; section?: string; explanation: string; stewardEsin?: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSearchTerm('');
      setAiDeepSuggestion(null);
    }
  }, [isOpen]);

  const handleAiDeepQuery = async () => {
    if (!searchTerm.trim()) return;
    setIsAiSearching(true);
    setAiDeepSuggestion(null);
    try {
      const sitemapContext = REGISTRY_NODES.map(g => `Group: ${g.category}\n${g.items.map(i => `- ${i.name} (id: ${i.id}): ${i.sections?.map(s => s.label).join(', ')}`).join('\n')}`).join('\n\n');
      const socialContext = GLOBAL_STEWARD_REGISTRY.map(s => `- Steward: ${s.name} (ESIN: ${s.esin}), Role: ${s.role}, Skills: ${s.skills.join(', ')}`).join('\n');
      const ledgerContext = `- Media Shards: ${SEARCHABLE_MEDIA_LEDGER.map(m => m.title).join(', ')}\n- Missions: ${GLOBAL_PROJECTS_MISSIONS.map(m => m.name).join(', ')}\n- Experiences: ${ITEM_CATEGORY_EXPERIENCES.map(e => e.title).join(', ')}\n- Logistics: ${LOGISTICS_SHARDS.map(l => l.name).join(', ')}\n- Community Exams/Modules: ${LMS_EXAMS_MODULES.map(e => e.title).join(', ')}\n- Market Products: ${vendorProducts.map(p => p.name).join(', ')}`;
      const prompt = `Act as the EnvirosAgro Navigation and Multi-Ledger Oracle. Based on the sitemap, steward registry, and ledger archives, recommend EXACTLY ONE shard, section, or ledger entry that best answers the user's query.\n\nRegistry Sitemap: ${sitemapContext}\nSocial Steward Registry: ${socialContext}\nIndustrial Ledgers Index: ${ledgerContext}\n\nUser Query: "${searchTerm}"\n\nReturn format:\nREASON: [Why relevant]\nVIEW: [shard id]\nSECTION: [section id or all]\nSTEWARD_ESIN: [optional esin]`;
      const res = await chatWithAgroExpert(prompt, []);
      const reason = res.text.match(/REASON:\s*(.*)/i)?.[1] || "Deep semantic match found in registry.";
      const view = res.text.match(/VIEW:\s*([a-z_0-9]+)/i)?.[1] || "dashboard";
      const section = res.text.match(/SECTION:\s*([a-z_0-9]+)/i)?.[1];
      const stewardEsin = res.text.match(/STEWARD_ESIN:\s*(EA-[A-Z0-9-]+)/i)?.[1];
      setAiDeepSuggestion({ view, section: section === 'all' ? undefined : section, explanation: reason, stewardEsin });
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiSearching(false);
    }
  };

  const filteredResults = useMemo(() => {
    if (!searchTerm.trim()) return { shards: [], stewards: [], assets: [], knowledge: [], infrastructure: [] };
    const term = searchTerm.toLowerCase();
    const shards: any[] = [];
    REGISTRY_NODES.forEach(group => group.items.forEach(item => { if (item.name.toLowerCase().includes(term) || item.id.toLowerCase().includes(term) || group.category.toLowerCase().includes(term)) shards.push({ ...item, category: group.category, matchedSections: item.sections?.filter(s => s.label.toLowerCase().includes(term)) }); }));
    const stewards = GLOBAL_STEWARD_REGISTRY.filter(s => s.name.toLowerCase().includes(term) || s.esin.toLowerCase().includes(term) || s.role.toLowerCase().includes(term) || s.skills.some(sk => sk.toLowerCase().includes(term)));
    const assets = [...vendorProducts.filter(p => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)), ...ITEM_CATEGORY_EXPERIENCES.filter(e => e.title.toLowerCase().includes(term) || e.desc.toLowerCase().includes(term))];
    const knowledge = [...SEARCHABLE_MEDIA_LEDGER.filter(m => m.title.toLowerCase().includes(term) || m.desc.toLowerCase().includes(term) || m.source.toLowerCase().includes(term)), ...LMS_EXAMS_MODULES.filter(e => e.title.toLowerCase().includes(term) || e.category.toLowerCase().includes(term))];
    const infrastructure = [...LOGISTICS_SHARDS.filter(l => l.name.toLowerCase().includes(term)), ...GLOBAL_PROJECTS_MISSIONS.filter(m => m.name.toLowerCase().includes(term) || m.desc.toLowerCase().includes(term))];
    return { shards: shards.slice(0, 5), stewards: stewards.slice(0, 5), assets: assets.slice(0, 5), knowledge: knowledge.slice(0, 5), infrastructure: infrastructure.slice(0, 5) };
  }, [searchTerm, vendorProducts]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300 overflow-hidden" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-4xl glass-card rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_150px_rgba(0,0,0,0.8)] flex flex-col h-[85vh] md:h-[80vh] animate-in zoom-in-95 duration-300">
        <div className="p-6 md:p-10 border-b border-white/5 flex items-center justify-between bg-black/20 shrink-0">
          <div className="flex items-center gap-4 md:gap-8 flex-1">
             <Search className="w-6 h-6 md:w-8 md:h-8 text-emerald-400 shrink-0" />
             <div className="flex-1 relative">
               <input ref={inputRef} type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAiDeepQuery()} placeholder="Query ledgers, media, stewards..." className="w-full bg-transparent border-none outline-none text-xl md:text-3xl text-white placeholder:text-slate-700 font-bold italic" />
             </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <button onClick={handleAiDeepQuery} disabled={isAiSearching || !searchTerm.trim()} className="p-3 md:p-4 bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/20 rounded-2xl md:rounded-3xl transition-all shadow-xl group active:scale-95 disabled:opacity-30 flex items-center justify-center" title="Oracle deep query">
               {isAiSearching ? <Loader2 className="animate-spin text-white w-6 h-6" /> : <SycamoreLogo size={24} className="text-emerald-400 group-hover:text-white" />}
            </button>
            <button onClick={onClose} className="p-3 md:p-4 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-2xl active:scale-95"><X size={24} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 space-y-12 bg-[#050706]/40">
           {aiDeepSuggestion && (
             <div className="p-8 md:p-12 bg-indigo-900/10 border-2 border-indigo-500/30 rounded-[48px] animate-in slide-in-from-top-4 duration-500 space-y-8 relative overflow-hidden group/sugg">
                <div className="absolute top-0 right-0 p-8 opacity-[0.1] group-hover/sugg:rotate-12 transition-transform"><SycamoreLogo size={180} className="text-indigo-400" /></div>
                <div className="flex items-center gap-4 relative z-10">
                   <div className="p-3 bg-indigo-600 rounded-2xl shadow-2xl"><SycamoreLogo size={20} className="text-white" /></div>
                   <h5 className="text-xs font-black text-indigo-400 uppercase tracking-widest italic">Oracle Logic Match</h5>
                </div>
                <div className="space-y-8 border-l-4 border-indigo-600/40 pl-8 md:pl-12 relative z-10">
                   <p className="text-slate-300 italic text-xl md:text-2xl leading-relaxed max-w-3xl">{aiDeepSuggestion.explanation}</p>
                   <button onClick={() => { onNavigate(aiDeepSuggestion.view as ViewState, aiDeepSuggestion.section); onClose(); }} className="px-12 py-6 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all ring-8 ring-indigo-500/5">Navigate Shard <ArrowRight size={18} /></button>
                </div>
             </div>
           )}
           {searchTerm.trim() === '' ? (
             <div className="h-full flex flex-col space-y-16 py-8">
                <div className="flex flex-col items-center justify-center text-center opacity-30 space-y-10">
                   <div className="relative">
                      <Command size={100} className="text-slate-600 animate-float" />
                      <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-full scale-150 animate-spin-slow"></div>
                   </div>
                   <div className="space-y-4">
                     <p className="text-4xl font-black uppercase tracking-[0.5em] text-white italic drop-shadow-2xl">SEARCH_MATRIX</p>
                     <p className="text-sm md:text-lg font-bold uppercase tracking-widest italic text-slate-500 max-w-md mx-auto leading-relaxed">Query organizational ledgers, media shards, or industrial stewards</p>
                   </div>
                </div>
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-1000">
                   <div className="flex items-center gap-4 px-4"><SycamoreLogo size={16} className="text-emerald-400" /><p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] italic">Recommended_Queries</p></div>
                   <div className="flex flex-wrap gap-4 px-4">
                      {RECOMMENDED_SEARCHES.map((rec, i) => (
                         <button key={i} onClick={() => setSearchTerm(rec.query)} className="flex items-center gap-4 px-8 py-5 bg-white/5 hover:bg-emerald-600/10 border-2 border-white/5 hover:border-emerald-500/40 rounded-[32px] transition-all group/chip active:scale-95 shadow-xl">
                            <rec.icon size={18} className="text-slate-500 group-hover/chip:text-emerald-400 transition-colors" />
                            <span className="text-sm font-black text-slate-400 group-hover/chip:text-white uppercase tracking-widest italic">{rec.label}</span>
                         </button>
                      ))}
                   </div>
                </div>
                <div className="p-8 bg-indigo-900/10 border-2 border-indigo-500/20 rounded-[48px] flex items-center justify-between group/bot-hint shadow-2xl mx-4">
                   <div className="flex items-center gap-8">
                      <div className="p-5 bg-indigo-600 rounded-[28px] shadow-3xl border-2 border-white/10 group-hover/bot-hint:rotate-12 transition-transform"><SycamoreLogo size={32} className="text-white animate-pulse" /></div>
                      <div className="text-left">
                         <h4 className="text-xl font-black text-white uppercase italic tracking-tighter m-0">Need more depth?</h4>
                         <p className="text-[10px] text-slate-500 mt-2 font-medium italic opacity-80 group-hover/bot-hint:opacity-100 transition-opacity">"Initialize an Oracle Deep Query to perform a high-fidelity scan across all unindexed sharded data."</p>
                      </div>
                   </div>
                   <div className="hidden md:flex gap-4"><div className="px-6 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full"><span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest italic">NEURAL_READY</span></div></div>
                </div>
             </div>
           ) : (
             <div className="space-y-20">
                {filteredResults.stewards.length > 0 && (
                   <div className="space-y-8">
                      <div className="flex items-center gap-4 px-4"><Users size={16} className="text-indigo-400" /><p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] italic">Social_Steward_Registry</p></div>
                      <div className="grid gap-4">
                         {filteredResults.stewards.map(steward => (
                            <div key={steward.esin} className="glass-card p-6 md:p-10 rounded-[40px] border-white/5 hover:border-indigo-500/40 bg-black/60 transition-all group flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden active:scale-[0.99] duration-300 group/card">
                               <div className="flex items-center gap-8 relative z-10 w-full md:w-auto">
                                  <div className="relative shrink-0">
                                     <div className="w-16 h-16 md:w-24 md:h-24 rounded-[28px] md:rounded-[40px] overflow-hidden border-2 border-white/10 group-hover:card:border-indigo-500 transition-all shadow-xl cursor-pointer">
                                        <img src={steward.avatar} className="w-full h-full object-cover" alt="" />
                                     </div>
                                     <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${steward.online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-800'}`}></div>
                                  </div>
                                  <div className="space-y-2">
                                     <h4 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:card:text-indigo-400 transition-colors">{steward.name}</h4>
                                     <p className="text-[10px] text-slate-600 font-mono tracking-widest uppercase mt-2">{steward.role} // {steward.esin}</p>
                                  </div>
                               </div>
                               <div className="flex gap-4 relative z-10 shrink-0 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-10 justify-center md:justify-end">
                                  <button onClick={() => { onNavigate('profile'); onClose(); }} className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all shadow-xl"><UserIcon size={20} /></button>
                                  <button onClick={() => { onNavigate('contract_farming'); onClose(); }} className="px-8 py-4 bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/20 rounded-2xl text-indigo-400 hover:bg-indigo-600 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all">Connect Shard</button>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                )}
                {filteredResults.knowledge.length > 0 && (
                   <div className="space-y-8">
                      <div className="flex items-center gap-4 px-4"><FileStack size={16} className="text-blue-400" /><p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] italic">Knowledge_&_Media_Archive</p></div>
                      <div className="grid gap-4">
                         {filteredResults.knowledge.map((item: any) => (
                            <div key={item.id} className="glass-card p-6 md:p-10 rounded-[40px] border-white/5 hover:border-blue-500/40 bg-black/60 transition-all group flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden active:scale-[0.99]">
                               <div className="flex items-center gap-8 relative z-10 w-full md:w-auto">
                                  <div className="p-6 rounded-[28px] md:rounded-[36px] bg-blue-600/10 border border-blue-500/20 text-blue-400 group-hover:rotate-6 transition-all shadow-inner">
                                     <item.icon size={40} />
                                  </div>
                                  <div className="space-y-2">
                                     <h4 className="text-xl font-black text-white uppercase italic tracking-tighter m-0 group-hover:text-blue-400 transition-colors leading-tight">{item.title}</h4>
                                     <p className="text-[10px] text-slate-600 font-mono tracking-widest uppercase mt-1">{item.source || item.category} // {item.id}</p>
                                  </div>
                               </div>
                               <div className="flex gap-4 relative z-10 shrink-0">
                                  <button onClick={() => { onNavigate(item.reward ? 'community' : 'media_ledger'); onClose(); }} className="px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-full text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl flex items-center gap-3 transition-all active:scale-95">{item.type === 'PAPER' ? <Download size={18} /> : <Zap size={18} />} Access Shard</button>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                )}
                {filteredResults.assets.length > 0 && (
                   <div className="space-y-8">
                      <div className="flex items-center gap-4 px-4"><ShoppingBag size={16} className="text-emerald-400" /><p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] italic">Industrial_Asset_Quorum</p></div>
                      <div className="grid grid-cols-2 gap-6">
                         {filteredResults.assets.map((item: any) => (
                            <div key={item.id} className="glass-card p-6 md:p-8 rounded-[40px] border-white/5 hover:border-emerald-500/40 bg-black/60 transition-all group flex flex-col justify-between h-[380px] shadow-3xl relative overflow-hidden active:scale-[0.99] group/asset">
                               <div className="absolute top-0 right-0 p-8 opacity-[0.01] group-hover/asset:opacity-[0.05] group-hover/asset:scale-110 transition-all"><ShoppingCart size={200} /></div>
                               <div className="flex items-start justify-between mb-6 relative z-10">
                                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-[28px] overflow-hidden border-2 border-white/10 group-hover/asset:border-emerald-500 transition-all shadow-xl"><img src={item.thumb || item.image || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=400'} className="w-full h-full object-cover" alt="" /></div>
                                  <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded-full border border-emerald-500/20 tracking-widest shadow-inner">ASSET_MINTED</span>
                               </div>
                               <div className="space-y-2 relative z-10">
                                  <h4 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter group-hover/asset:text-emerald-400 transition-colors m-0 drop-shadow-2xl">{item.name || item.title}</h4>
                                  <p className="text-[9px] text-slate-700 font-mono font-black uppercase tracking-widest mt-2">{item.price || item.cost} EAC // {item.id}</p>
                               </div>
                               <div className="pt-6 border-t border-white/5 mt-auto flex justify-end relative z-10">
                                  <button onClick={() => { onNavigate(item.node ? 'agrowild' : 'economy'); onClose(); }} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-white font-black text-[9px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"><ArrowUpRight size={14} /> Procure Shard</button>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                )}
             </div>
           )}
        </div>
        <div className="p-6 md:p-8 border-t border-white/5 border-emerald-500/10 bg-black/80 flex items-center justify-between shrink-0 relative z-10">
           <div className="flex items-center gap-4 text-[7px] font-black text-slate-700 uppercase tracking-widest italic"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20 animate-pulse"></div>MULTI_LEDGER_INDEXING_ACTIVE</div>
           <div className="flex items-center gap-3"><span className="text-[7px] font-mono text-slate-800 uppercase tracking-widest">v6.5.2 // QUORUM_SYNC</span></div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
