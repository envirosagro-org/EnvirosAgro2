
import { useState } from 'react';
import { 
  Users, 
  Leaf, 
  Shield, 
  FileText, 
  Scale, 
  Bot, 
  Heart, 
  Activity, 
  ChevronRight, 
  File, 
  BookOpen, 
  Gavel, 
  Sparkles, 
  Search, 
  Globe, 
  Microscope,
  TrendingUp,
  Award,
  BrainCircuit
} from 'lucide-react';
import { ViewState } from '../types';

interface Law {
  id: number;
  thrustId: string;
  thrust: string;
  title: string;
  anchor: string;
  principle: string;
  precedents: string[];
  statute: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

interface CodeOfLawsProps {
  onNavigate: (view: ViewState) => void;
}

const CodeOfLaws: React.FC<CodeOfLawsProps> = ({ onNavigate }) => {
  const [selectedLaw, setSelectedLaw] = useState<Law | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const LAWS: Law[] = [
    {
        id: 1,
        thrustId: 'I',
        thrust: 'SOCIETAL',
        title: 'THE GITHAKA-COMMONS MANDATE',
        anchor: '0X1A8',
        principle: 'Land ownership is not absolute dominion but a trusteeship for the community and future generations.',
        precedents: ['KENYA CONSTITUTION ART. 60', 'MAGNA CARTA', 'KIKUYU MBARI SYSTEM'],
        statute: "Every distinct land unit within the EnvirosAgro ecosystem shall be designated a 'Modern Githaka'. While title may be private, the usufruct (right to use) must serve the community. 'Fencing off' resources needed for survival (water, medicinal herbs) is prohibited.",
        icon: Users,
        color: 'text-rose-500',
        bg: 'bg-rose-500/10'
      },
      {
        id: 2,
        thrustId: 'I',
        thrust: 'SOCIETAL',
        title: 'THE WIDOW & ORPHAN CLAUSE',
        anchor: '0X2A8',
        principle: 'Vulnerable groups hold inalienable rights to harvest.',
        precedents: ['LEVITICUS 19:9', 'QURAN', 'KIKUYU MIGUNDA RIGHTS'],
        statute: "A portion of every harvest, designated as the 'Corner of the Field', is reserved for community members unable to work the land. This is not charity, but a right of social cohesion (S). Access is managed via the Community interface.",
        icon: Heart,
        color: 'text-rose-500',
        bg: 'bg-rose-500/10'
      },
      {
        id: 3,
        thrustId: 'II',
        thrust: 'ECOLOGICAL',
        title: 'THE SOIL-AS-KIN DECREE',
        anchor: '0X3A8',
        principle: 'The soil is not a resource to be exploited, but a living relative to be nurtured.',
        precedents: ['INDIGENOUS MICROBIOME SCIENCE', 'GAIA HYPOTHESIS'],
        statute: "Any action that results in a quantifiable decrease in topsoil depth, microbial diversity, or water retention is deemed a 'biological transgression'. Restitution must be made by funding soil regeneration projects via the Eco-Ledger.",
        icon: Leaf,
        color: 'text-green-500',
        bg: 'bg-green-500/10'
      },
      {
        id: 4,
        thrustId: 'II',
        thrust: 'ECOLOGICAL',
        title: 'THE SEED SOVEREIGNTY PACT',
        anchor: '0X4A8',
        principle: 'Heirloom genetics are the shared library of planetary resilience.',
        precedents: ['SVALBARD GLOBAL SEED VAULT', 'OPEN-SOURCE SOFTWARE MOVEMENT'],
        statute: "Patenting of naturally occurring heirloom seed genetics is prohibited. All discovered landrace strains must be logged in the 'Genetic Decoder' for open-access use by all stewards. Genetic modification is permitted only for climate adaptation purposes.",
        icon: Shield,
        color: 'text-green-500',
        bg: 'bg-green-500/10'
      },
      {
        id: 5,
        thrustId: 'III',
        thrust: 'INDUSTRIAL',
        title: 'THE VIBRATIONAL TEST',
        anchor: '0X5A8',
        principle: 'Food must not only be nutritious, but harmonic.',
        precedents: ['EMOTO WATER CRYSTALS', 'SONIC BLOOM RESEARCH'],
        statute: "All produce branding under juizzyCookiez must pass the 'Vibrational Test' via Agro Musika. Plants grown under high stress (S) generate 'dissonant' bio-signals and cannot be sold as premium grade. The food must 'sing' in harmony.",
        icon: Microscope,
        color: 'text-teal-500',
        bg: 'bg-teal-500/10'
      },
      {
        id: 6,
        thrustId: 'IV',
        thrust: 'TECHNOLOGICAL',
        title: 'THE PLOUGHSHARE MANDATE',
        anchor: '0X6A8',
        principle: 'Technology must serve life, not war or destruction.',
        precedents: ['ISAIAH 2:4', 'AGROBOTO SERVANT LOGIC'],
        statute: "The Agroboto division is prohibited from developing dual-use technologies that can be weaponized. Robotics must be 'servants of the Githaka', designed to reduce physical burden (S) on the human worker, not replace the connection to the land.",
        icon: Bot,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10'
      },
      {
        id: 7,
        thrustId: 'V',
        thrust: 'INFORMATIONAL',
        title: 'THE ABSOLUTE TRUTH ANCHOR',
        anchor: '0X7A8',
        principle: 'Every data point must be anchored in observable, biological reality.',
        precedents: ['PROOF-OF-WORK', 'MYCOLOGICAL NETWORKS'],
        statute: "The 'm-Constant' of the mesh network must be recalibrated daily against a baseline of living biological data streams (e.g., mycelial network fluctuations). Purely synthetic data cannot be the sole anchor for consensus truth.",
        icon: Globe,
        color: 'text-indigo-500',
        bg: 'bg-indigo-500/10'
      },
      {
        id: 8,
        thrustId: 'I',
        thrust: 'SOCIETAL',
        title: 'THE FINALITY YIELD MANDATE',
        anchor: '0X8A8',
        principle: 'Exceptional contribution to mesh stability deserves exceptional reward.',
        precedents: ['PROOF-OF-STAKE REWARDS', 'OLYMPIC BONUSES'],
        statute: "A daily 'Consensus Reward Pool' of 100,000 EAC is allocated to the top 10 stewards in the 'Finality Racing' leaderboard. This yield is distributed based on rank to incentivize the manual labor of mempool orchestration and network entropy reduction.",
        icon: TrendingUp,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10'
      },
      {
        id: 9,
        thrustId: 'V',
        thrust: 'INFORMATIONAL',
        title: 'THE EXPERT-STEWARD MANDATE',
        anchor: '0X9A8',
        principle: 'Knowledge is a yield-generating asset; expertise must be rewarded.',
        precedents: ['ACADEMIC ROYALTIES', 'OPEN-SOURCE CONTRIBUTOR MODELS'],
        statute: "Stewards who achieve 'Master' certification (Tier 3) unlock the Knowledge Forge. They can synthesize new learning modules from raw data shards. If the Oracle verifies the module's quality and it is used by other stewards for certification, the authoring steward earns a 15% royalty on all associated EAC exam fees.",
        icon: BrainCircuit,
        color: 'text-indigo-500',
        bg: 'bg-indigo-500/10'
      },
  ];

  const filteredLaws = LAWS.filter(law =>
    law.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    law.principle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    law.statute.toLowerCase().includes(searchTerm.toLowerCase()) ||
    law.thrust.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 md:p-12 font-sans flex flex-col items-center animate-in fade-in duration-1000">
      
      {/* Header */}
      <div className="w-full max-w-7xl mb-12 text-center space-y-6">
        <div className="inline-block p-6 bg-white/5 rounded-3xl border border-white/10 shadow-2xl">
           <Gavel size={48} className="text-indigo-400" />
        </div>
        <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter m-0">Code <span className="text-indigo-400">of Laws</span></h1>
        <p className="text-lg md:text-xl text-slate-400 font-medium max-w-3xl mx-auto italic">The immutable legal and ethical framework anchoring the EnvirosAgro ecosystem to its founding principles.</p>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-3xl mb-12 sticky top-4 z-10">
        <div className="relative">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-500 w-6 h-6" />
          <input 
            type="text"
            placeholder="Search by title, principle, or thrust..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-6 pl-20 pr-8 bg-black/80 backdrop-blur-md rounded-full border-2 border-white/10 text-lg font-mono outline-none focus:border-indigo-500/50 focus:ring-8 focus:ring-indigo-500/10 transition-all shadow-2xl"
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredLaws.map((law, index) => (
          <div 
            key={law.id}
            onClick={() => setSelectedLaw(law)}
            className={`p-10 rounded-[48px] border-2 flex flex-col justify-between cursor-pointer group hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 shadow-xl hover:shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-4 ${law.bg}`}
            style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
          >
            <div className={`absolute -top-12 -right-12 text-white/5 group-hover:text-white/10 group-hover:scale-110 transition-all duration-500`}><law.icon size={180} /></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <span className={`px-5 py-2 rounded-full border-2 ${law.color} ${law.bg.replace('10','20')} text-[10px] font-black uppercase tracking-[0.3em]`}>{law.thrust}</span>
                <span className={`${law.color} font-mono text-sm font-black`}>{law.anchor}</span>
              </div>
              <h2 className={`text-4xl font-black uppercase italic tracking-tighter leading-tight m-0 ${law.color}`}>{law.title}</h2>
            </div>
            <div className="relative z-10 mt-6">
              <p className="text-lg font-semibold italic text-white/80">{law.principle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedLaw && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-in fade-in duration-500"
          onClick={() => setSelectedLaw(null)}
        >
          <div 
            className="w-full max-w-4xl max-h-[90vh] bg-[#0A0A0A] rounded-[64px] border-2 border-white/10 shadow-4xl flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-12 md:p-16 border-b-2 border-white/10 ${selectedLaw.bg}`}>
              <div className="flex items-center justify-between mb-6">
                <span className={`px-6 py-2 rounded-full border-2 ${selectedLaw.color} ${selectedLaw.bg.replace('10','20')} text-xs font-black uppercase tracking-widest`}>{selectedLaw.thrust}</span>
                <span className={`font-mono text-lg font-black ${selectedLaw.color}`}>{selectedLaw.anchor}</span>
              </div>
              <h1 className={`text-5xl md:text-7xl font-black uppercase italic tracking-tighter m-0 ${selectedLaw.color}`}>{selectedLaw.title}</h1>
            </div>
            
            <div className="p-12 md:p-16 space-y-12 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3"><Sparkles size={16} /> Principle</h3>
                <p className="text-2xl font-medium italic text-slate-200 leading-relaxed">{selectedLaw.principle}</p>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3"><Gavel size={16} /> Statute</h3>
                <p className="text-lg font-light text-slate-300 leading-loose whitespace-pre-line">{selectedLaw.statute}</p>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3"><BookOpen size={16} /> Precedents</h3>
                <div className="flex flex-wrap gap-4">
                  {selectedLaw.precedents.map((p, i) => (
                    <span key={i} className="px-5 py-2 bg-slate-800 rounded-full text-sm font-mono font-semibold text-slate-300 border border-slate-700 shadow-inner">{p}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-8 mt-auto border-t-2 border-white/10 bg-black/50">
              <button onClick={() => setSelectedLaw(null)} className="w-full py-5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-lg font-bold transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Footer */}
      <footer className="w-full max-w-7xl mt-20 text-center text-slate-600">
        <p className="text-sm font-mono">EnvirosAgro-Core v6.5 // IMMUTABLE_LEDGER_ANCHOR: 0x0A1</p>
      </footer>

      <style>{`
        .shadow-4xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.98); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default CodeOfLaws;
