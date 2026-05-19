import React, { useState } from 'react';
import { 
  FileText, Send, Download, Share2, Loader2, ClipboardList, 
  TrendingUp, Leaf, Coins, ShieldCheck, ChevronRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateAgroDocument } from '../services/agroLangService';
import { toast } from 'sonner';
import { User, SignalShard } from '../types';

interface AgroLangReportGeneratorProps {
  user: User;
  onEmitSignal: (signal: Partial<SignalShard>) => Promise<void>;
}

const REPORT_TYPES = [
  { id: 'SUSTAINABILITY', label: 'Ecosystem Sustainability Audit', icon: Leaf, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'PRODUCTION', label: 'Industrial Production Analysis', icon: ClipboardList, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'FINANCIAL', label: 'Treasury & Economic Forecast', icon: Coins, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { id: 'STRATEGIC', label: 'High-Fidelity Strategic Blueprint', icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { id: 'RISK', label: 'Blockchain Risk & Finality Audit', icon: ShieldCheck, color: 'text-rose-400', bg: 'bg-rose-500/10' },
];

export const AgroLangReportGenerator: React.FC<AgroLangReportGeneratorProps> = ({ user, onEmitSignal }) => {
  const [selectedType, setSelectedType] = useState(REPORT_TYPES[0].id);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please provide an operational context for the report.");
      return;
    }

    setIsGenerating(true);
    setReport(null);

    try {
      const typeLabel = REPORT_TYPES.find(t => t.id === selectedType)?.label || 'System Report';
      const response = await generateAgroDocument(typeLabel, prompt);
      
      if (response.text) {
        setReport(response.text);
        toast.success("Agro Lang Report Generated successfully.");
        
        onEmitSignal({
          type: 'ledger_anchor',
          origin: 'ORACLE',
          title: 'REPORT_GENERATED',
          message: `Automated report generation finalized for type ${selectedType}. Context: ${prompt.substring(0, 50)}...`,
          priority: 'medium',
          actionIcon: 'FileText'
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Handshake failed. Oracle could not sequence the report.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!report) return;
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EA_Report_${selectedType}_${new Date().getTime()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Report downloaded as Markdown.");
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-500 bg-[#050706]">
      {/* Header */}
      <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between px-10 md:px-16">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-xl group border border-white/10">
            <FileText size={32} className="text-white group-hover:rotate-12 transition-transform" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase italic tracking-widest m-0 leading-none">Agro Lang <span className="text-indigo-400">Reporter</span></h3>
            <div className="flex items-center gap-3 mt-2">
              <div className="px-3 py-0.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase tracking-widest">AUTOREPORT_v2.0</div>
              <span className="text-[8px] text-slate-600 uppercase tracking-widest font-mono italic">EOS_CERTIFIED_OUTPUT</span>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
           {report && (
             <>
               <button 
                 onClick={handleDownload}
                 className="px-6 py-3 bg-white/5 hover:bg-emerald-600/20 border border-white/10 rounded-full text-slate-400 hover:text-emerald-400 transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-widest"
               >
                 <Download size={14} /> Download
               </button>
               <button className="px-6 py-3 bg-white/5 hover:bg-indigo-600/20 border border-white/10 rounded-full text-slate-400 hover:text-indigo-400 transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                 <Share2 size={14} /> Share
               </button>
             </>
           )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Left Panel: Configuration */}
        <div className="w-full md:w-96 border-r border-white/5 bg-black/40 p-8 flex flex-col gap-8 md:min-h-0 min-h-[400px]">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-widest px-2">Report Classification</h4>
            <div className="space-y-2">
              {REPORT_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${
                    selectedType === type.id 
                      ? `${type.bg} border-white/20 text-white shadow-lg` 
                      : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10'
                  }`}
                >
                  <type.icon size={18} className={selectedType === type.id ? type.color : 'text-slate-600'} />
                  <span className="text-[10px] font-black uppercase tracking-wider">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 flex-1 flex flex-col">
            <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-widest px-2">Operational Context</h4>
            <textarea
              className="flex-1 w-full bg-white/[0.02] border-2 border-white/5 rounded-3xl p-6 text-sm text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium italic placeholder:text-stone-900 shadow-inner resize-none mb-6"
              placeholder="Describe the current agricultural scenario, node status, or specific research objectives..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 border border-white/10 flex items-center justify-center gap-4 group"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
              Generate Shard
            </button>
          </div>
        </div>

        {/* Right Panel: Report View */}
        <div className="flex-1 bg-black/60 p-8 md:p-12 overflow-y-auto custom-scrollbar relative">
          {!report && !isGenerating ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 space-y-8 animate-in fade-in duration-1000">
              <div className="w-32 h-32 bg-white/5 border-2 border-dashed border-white/10 rounded-[48px] flex items-center justify-center">
                <FileText size={64} className="text-slate-700" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Awaiting Signal Ingest</h3>
                <p className="text-slate-500 text-sm italic font-medium max-w-sm">
                  Configure the classification and context on the left panel to trigger the AI-powered report sharding process.
                </p>
              </div>
            </div>
          ) : isGenerating ? (
            <div className="h-full flex flex-col items-center justify-center space-y-12 animate-in fade-in">
              <div className="relative">
                <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white shadow-3xl animate-float border-2 border-white/10">
                  <Loader2 size={48} className="animate-spin" />
                </div>
                <div className="absolute inset-[-15px] border-2 border-dashed border-indigo-400/20 rounded-[44px] animate-spin-slow"></div>
              </div>
              <div className="space-y-4 text-center">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter animate-pulse">Sequencing Report...</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] italic">Mesh Oracle active. Calculating Industrial Delta.</p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700">
               {/* Document Ribbon */}
               <div className="flex items-center gap-6 p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"><FileText size={24} className="text-white" /></div>
                  <div className="flex-1">
                     <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-black text-[10px] uppercase italic tracking-widest">{selectedType}_REPORT</span>
                        <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest">QUALIFIED_SHARD</span>
                     </div>
                     <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-full shadow-[0_0_15px_#6366f1]"></div>
                     </div>
                  </div>
               </div>

               <div className="glass-card p-12 md:p-20 rounded-[64px] border border-white/5 bg-black/40 shadow-3xl prose prose-invert prose-emerald max-w-none relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-20 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-[30s]"><FileText size={600} /></div>
                  <div className="markdown-body relative z-10">
                    <ReactMarkdown>{report || ''}</ReactMarkdown>
                  </div>
                  
                  {/* Digital Signature */}
                  <div className="mt-20 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-50 relative z-10">
                     <div className="text-center md:text-left space-y-2">
                        <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Timestamp</p>
                        <p className="text-[10px] font-mono font-black text-white">{new Date().toISOString()}</p>
                     </div>
                     <div className="text-center md:text-right space-y-2">
                        <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Finality Signature</p>
                        <p className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest truncate max-w-[200px]">0x{Math.random().toString(16).substring(2, 34).toUpperCase()}</p>
                     </div>
                  </div>
               </div>

               <div className="flex justify-center gap-4 pb-20">
                  <button 
                    onClick={handleDownload}
                    className="flex items-center gap-3 px-8 py-4 bg-emerald-600/10 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest transition-all active:scale-95 shadow-xl"
                  >
                    <Download size={16} /> Download Shard
                  </button>
                  <button className="flex items-center gap-3 px-8 py-4 bg-indigo-600/10 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest transition-all active:scale-95 shadow-xl">
                    <Share2 size={16} /> Broadcast to Mesh
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
