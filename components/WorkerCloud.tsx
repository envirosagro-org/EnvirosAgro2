
import React, { useState } from 'react';
import { Search, UserCheck, MapPin, Star, ShieldCheck, Mail, Trophy, Wrench, Navigation, Leaf, Truck, Microscope, CheckCircle, Zap, Cpu } from 'lucide-react';
import { User, WorkerProfile, WorkerRole } from '../types';

interface WorkerCloudProps {
  currentUser?: User;
}

const ROLE_METADATA: Record<WorkerRole, { label: string; icon: any; color: string }> = {
  FIELD_TECHNICIAN: { label: 'Field Technician', icon: Wrench, color: 'text-blue-400' },
  DRONE_OPERATOR: { label: 'Drone Operator', icon: Navigation, color: 'text-purple-400' },
  HARVEST_SPECIALIST: { label: 'Harvest Specialist', icon: Leaf, color: 'text-emerald-400' },
  LOGISTICS_COORDINATOR: { label: 'Logistics Coordinator', icon: Truck, color: 'text-amber-400' },
  BIOTECH_ANALYST: { label: 'Biotech Analyst', icon: Microscope, color: 'text-pink-400' },
  SUSTAINABILITY_AUDITOR: { label: 'Sustainability Auditor', icon: CheckCircle, color: 'text-cyan-400' },
  AGRO_ENGINEER: { label: 'Agro Engineer', icon: Zap, color: 'text-orange-400' },
  BOT_SYSTEM_OVERSEER: { label: 'Bot System Overseer', icon: Cpu, color: 'text-indigo-400' },
};

const WorkerCloud: React.FC<WorkerCloudProps> = ({ currentUser }) => {
  const [selectedRole, setSelectedRole] = useState<WorkerRole | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const defaultWorkers: WorkerProfile[] = [
    { 
      id: '1', name: 'Dr. Sarah Chen', esin: 'EA-WORK-1101', role: 'BIOTECH_ANALYST', 
      skills: ['Genetic Sequencing', 'Seed Quality'], sustainabilityRating: 98, verifiedHours: 2400, 
      isOpenToWork: true, lifetimeEAC: 12000, efficiency: 95, avatar: 'SC', 
      location: 'California, USA', availability: 'AVAILABLE' 
    },
    { 
      id: '2', name: 'Marcus T.', esin: 'EA-WORK-1102', role: 'DRONE_OPERATOR', 
      skills: ['Fleet Sync', 'Lidar Mapping'], sustainabilityRating: 85, verifiedHours: 820, 
      isOpenToWork: true, lifetimeEAC: 4500, efficiency: 88, avatar: 'MT', 
      location: 'Nairobi, Kenya', availability: 'OCCUPIED' 
    },
    { 
      id: '3', name: 'Elena Rodriguez', esin: 'EA-WORK-1103', role: 'HARVEST_SPECIALIST', 
      skills: ['Precision Picking', 'Post-Harvest'], sustainabilityRating: 92, verifiedHours: 1560, 
      isOpenToWork: true, lifetimeEAC: 8900, efficiency: 91, avatar: 'ER', 
      location: 'Valencia, Spain', availability: 'AVAILABLE' 
    },
    { 
      id: '4', name: 'Kofi Mensah', esin: 'EA-WORK-1104', role: 'FIELD_TECHNICIAN', 
      skills: ['IoT Maintenance', 'Irrigation'], sustainabilityRating: 94, verifiedHours: 3100, 
      isOpenToWork: true, lifetimeEAC: 15600, efficiency: 97, avatar: 'KM', 
      location: 'Accra, Ghana', availability: 'AVAILABLE' 
    },
    { 
      id: '5', name: 'Yuki Tanaka', esin: 'EA-WORK-1105', role: 'LOGISTICS_COORDINATOR', 
      skills: ['Supply Chain', 'Warehousing'], sustainabilityRating: 89, verifiedHours: 1200, 
      isOpenToWork: true, lifetimeEAC: 6700, efficiency: 85, avatar: 'YT', 
      location: 'Osaka, Japan', availability: 'OFFLINE' 
    },
  ];

  const workers = [...defaultWorkers];

  if (currentUser && (currentUser.isReadyForHire || currentUser.achievements?.includes("Industrial Professional Qualification"))) {
    const userRole: WorkerRole = currentUser.role.includes('Tech') ? 'FIELD_TECHNICIAN' : 'AGRO_ENGINEER';
    
    workers.unshift({
      id: currentUser.uid || 'current-user',
      name: currentUser.name,
      esin: currentUser.esin,
      role: userRole,
      skills: Object.keys(currentUser.skills || {}),
      sustainabilityRating: currentUser.metrics?.sustainabilityScore || 100,
      verifiedHours: currentUser.completedActions?.length ? currentUser.completedActions.length * 10 : 10,
      isOpenToWork: currentUser.isReadyForHire,
      lifetimeEAC: currentUser.wallet?.lifetimeEarned || 0,
      efficiency: 99,
      avatar: currentUser.name.split(' ').map(n => n[0]).join(''),
      location: currentUser.location || 'Global',
      availability: 'AVAILABLE'
    });
  }

  const filteredWorkers = workers.filter(w => {
    const matchesRole = selectedRole === 'ALL' || w.role === selectedRole;
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         w.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white uppercase italic tracking-wider flex items-center gap-3">
            <Zap className="text-emerald-400" />
            Worker Cloud Shard
          </h2>
          <p className="text-slate-500 font-medium">Decentralized talent pool for industrial agro-operations</p>
        </div>
        
        <div className="relative group w-full lg:w-96">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search workers by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border-2 border-white/5 focus:border-emerald-500/50 rounded-[32px] py-4 pl-14 pr-6 text-white text-sm outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button 
          onClick={() => setSelectedRole('ALL')}
          className={`px-6 py-2.5 rounded-full text-xs font-black uppercase italic transition-all border-2 ${selectedRole === 'ALL' ? 'bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/20' : 'bg-black/40 border-white/5 text-slate-500 hover:border-white/20'}`}
        >
          All Shards
        </button>
        {Object.entries(ROLE_METADATA).map(([role, meta]) => {
          const Icon = meta.icon;
          return (
            <button 
              key={role}
              onClick={() => setSelectedRole(role as WorkerRole)}
              className={`px-6 py-2.5 rounded-full text-xs font-black uppercase italic transition-all flex items-center gap-2 border-2 ${selectedRole === role ? 'bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/20' : 'bg-black/40 border-white/5 text-slate-500 hover:border-white/20'}`}
            >
              <Icon size={14} />
              {meta.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-4">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
              {filteredWorkers.length} Active Nodes Found
            </p>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase text-slate-500">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Available</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Occupied</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-700"></div> Offline</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredWorkers.map((worker) => {
              const meta = ROLE_METADATA[worker.role];
              const Icon = meta.icon;
              return (
                <div key={worker.id} className="group relative">
                  <div className="absolute inset-0 bg-emerald-500/5 blur-2xl rounded-[48px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative glass-card rounded-[48px] p-8 border border-white/5 hover:border-emerald-500/30 transition-all shadow-xl hover:translate-y-[-4px]">
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex gap-5">
                        <div className="w-16 h-16 rounded-[24px] bg-black border-2 border-white/10 flex items-center justify-center relative shadow-inner">
                          <span className="text-xl font-black text-white italic">{worker.avatar}</span>
                          <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-[3px] border-black ${worker.availability === 'AVAILABLE' ? 'bg-emerald-500' : worker.availability === 'OCCUPIED' ? 'bg-amber-500' : 'bg-slate-700'}`}></div>
                        </div>
                        <div>
                          <h4 className="font-black text-white text-lg italic tracking-tight">{worker.name}</h4>
                          <div className={`flex items-center gap-1.5 mt-1 ${meta.color}`}>
                            <Icon size={12} className="opacity-80" />
                            <p className="text-[10px] font-black uppercase tracking-widest">{meta.label}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1 text-amber-400">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-sm font-black italic">{worker.sustainabilityRating}</span>
                        </div>
                        <p className="text-[8px] text-slate-500 uppercase font-black tracking-tighter">Resonance Score</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 bg-white/5 rounded-3xl border border-white/5">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                          <MapPin size={12} />
                          <span className="text-[9px] font-black uppercase">Locale</span>
                        </div>
                        <p className="text-xs font-bold text-white truncate">{worker.location}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-3xl border border-white/5">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                          <ShieldCheck size={12} />
                          <span className="text-[9px] font-black uppercase">History</span>
                        </div>
                        <p className="text-xs font-bold text-white">{worker.verifiedHours}h Ledgered</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-[28px] text-[10px] font-black text-slate-400 uppercase italic tracking-widest transition-all border border-white/5">
                        Dossier
                      </button>
                      <button className="flex-1 py-4 agro-gradient rounded-[28px] text-[10px] font-black text-white uppercase italic tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                        <Mail className="w-3 h-3" /> Connect
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[48px] border-2 border-emerald-500/20 bg-emerald-950/10 shadow-2xl overflow-hidden relative group">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full"></div>
            
            <h3 className="text-xl font-black text-white uppercase italic mb-8 flex items-center gap-3 relative">
              <Trophy className="text-amber-400" size={24} />
              Elite Shard List
            </h3>
            
            <div className="space-y-4 relative">
              {workers.sort((a, b) => b.sustainabilityRating - a.sustainabilityRating).slice(0, 5).map((leader, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-black/60 rounded-[32px] border border-white/5 hover:border-emerald-500/30 transition-all group/item">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-2xl text-xs font-black italic ${i === 0 ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/40' : 'bg-white/5 text-slate-500'}`}>
                      {i + 1}
                    </div>
                    <div>
                      <span className="text-sm font-black text-white italic group-hover/item:text-emerald-400 transition-colors">{leader.name}</span>
                      <p className="text-[8px] text-slate-500 uppercase font-black">{ROLE_METADATA[leader.role].label}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-black text-emerald-400">{leader.sustainabilityRating}</p>
                    <p className="text-[7px] text-slate-600 uppercase font-black">Efficiency</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-8 py-5 rounded-[32px] bg-white/5 hover:bg-white/10 text-xs font-black text-slate-400 uppercase italic tracking-widest transition-all border border-white/5">
              View Detailed Metrics
            </button>
          </div>

          <div className="glass-card p-8 rounded-[48px] border border-white/5 bg-white/[0.02]">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Regional Sharding</h4>
            <div className="p-6 bg-black rounded-[32px] border border-white/5 relative aspect-square flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent"></div>
              <div className="text-center space-y-2 relative">
                <MapPin className="mx-auto text-emerald-400 opacity-60" size={32} />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Geo-Sync Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerCloud;
