
import React, { useState, useMemo } from 'react';
import { 
  BarChart4, 
  Activity, 
  Zap, 
  Target, 
  RefreshCcw, 
  Settings, 
  Sparkles, 
  Bot, 
  Loader2, 
  Search, 
  Scale, 
  Binary, 
  LineChart,
  ChevronRight,
  ClipboardList,
  Gauge,
  Layers,
  History,
  AlertCircle,
  TrendingUp,
  Trello,
  Plus
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  AreaChart,
  Area
} from 'recharts';
import { chatWithAgroExpert } from '../services/geminiService';

const CONTROL_CHART_DATA = [
  { batch: 'B1', val: 62 }, { batch: 'B2', val: 65 }, { batch: 'B3', val: 61 },
  { batch: 'B4', val: 78 }, { batch: 'B5', val: 63 }, { batch: 'B6', val: 60 },
  { batch: 'B7', val: 58 }, { batch: 'B8', val: 85 }, { batch: 'B9', val: 64 },
  { batch: 'B10', val: 61 }, { batch: 'B11', val: 62 }, { batch: 'B12', val: 63 },
];

const ToolsSection: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'sigma' | 'kpis' | 'kanban'>('kanban');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [sigmaInput, setSigmaInput] = useState('');
  const [sigmaAdvice, setSigmaAdvice] = useState<string | null>(null);
  
  const [defects, setDefects] = useState(3);
  const [opportunities, setOpportunities] = useState(1000);
  
  const sigmaLevel = useMemo(() => {
    const dpmo = (defects / opportunities) * 1000000;
    if (dpmo <= 3.4) return 6.0;
    if (dpmo <= 233) return 5.0;
    if (dpmo <= 6210) return 4.0;
    if (dpmo <= 66807) return 3.0;
    return 1.0;
  }, [defects, opportunities]);

  const handleSigmaAudit = async () => {
    if (!sigmaInput.trim()) return;
    setIsOptimizing(true);
    const prompt = `Six Sigma Strategy for: ${sigmaInput}`;
    const response = await chatWithAgroExpert(prompt, []);
    setSigmaAdvice(response.text);
    setIsOptimizing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex gap-4 p-1 glass-card rounded-2xl w-fit">
        {['kanban', 'sigma', 'kpis'].map(t => (
          <button key={t} onClick={() => setActiveTool(t as any)} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTool === t ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      {activeTool === 'sigma' && (
        <div className="lg:col-span-2 glass-card p-12 rounded-[48px] border-white/5 relative overflow-hidden bg-black/40">
           <div className="h-80 w-full min-h-0 min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <RechartsLineChart data={CONTROL_CHART_DATA}>
                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                   <XAxis dataKey="batch" stroke="rgba(255,255,255,0.2)" fontSize={10} />
                   <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} domain={[40, 100]} />
                   <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)' }} />
                   <Line type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={4} />
                </RechartsLineChart>
              </ResponsiveContainer>
           </div>
        </div>
      )}

      {activeTool === 'kpis' && (
        <div className="lg:col-span-2 glass-card p-12 rounded-[48px] border-white/5 relative overflow-hidden bg-black/40">
           <div className="h-64 flex items-end justify-between gap-3 px-4">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={[35, 65, 45, 85, 55, 95, 75, 60, 80, 90, 100, 85].map((v, i) => ({i, v}))}>
                  <Area dataKey="v" stroke="#10b981" fill="#10b98122" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>
      )}
    </div>
  );
};

export default ToolsSection;
