import React, { useState, useMemo } from 'react';
import { useKey } from 'react-use';
import { Command, Search, LayoutDashboard, Database, Droplets, Zap } from 'lucide-react';
import { ViewState } from '../types';
import { useAppNavigation } from '../hooks/useAppNavigation';

interface CommandItem {
  id: ViewState;
  label: string;
  icon: React.ReactNode;
}

const COMMANDS: CommandItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { id: 'intelligence', label: 'Forge DNA Shard', icon: <Database size={16} /> },
  { id: 'soil_portal', label: 'Check Soil Moisture', icon: <Droplets size={16} /> },
  { id: 'marketplace', label: 'Marketplace', icon: <Zap size={16} /> },
];

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { navigate } = useAppNavigation();
  
  useKey('k', (event) => {
    if ((event.metaKey || event.ctrlKey)) {
      setIsOpen(prev => !prev);
    }
  }, { event: 'keydown' }, [isOpen]);

  const filteredCommands = useMemo(() => 
    COMMANDS.filter(c => c.label.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div className="w-full max-w-lg glass-card rounded-3xl border border-white/10 p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
          <Search className="text-slate-500" />
          <input 
            autoFocus
            className="w-full bg-transparent text-white placeholder:text-slate-600 outline-none"
            placeholder="Search AgroHub modules..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="mt-4 space-y-2 text-sm text-slate-400">
          {filteredCommands.map(cmd => (
            <div key={cmd.id} className="flex items-center gap-3 px-2 py-2 hover:bg-white/5 rounded-lg cursor-pointer text-white" onClick={() => { navigate(cmd.id, null, false); setIsOpen(false); }}>
              {cmd.icon}
              {cmd.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
