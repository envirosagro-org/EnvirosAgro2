import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Loader2, Sparkles } from 'lucide-react';

interface AIAssistantProps {
  userEsin: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ userEsin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are a helpful assistant for EnvirosAgro. The current steward ESIN is ${userEsin}. Answer farming and sustainability questions concisely. Context: ${input}` }] }]
        })
      });
      
      const data = await response.json();
      const assistantText = data.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { role: 'assistant', text: assistantText }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Error interacting with AI.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-[1000]">
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="p-4 bg-emerald-600 rounded-full shadow-2xl hover:scale-105 transition-transform">
          <Bot className="text-white" />
        </button>
      )}
      {isOpen && (
        <div className="w-80 h-96 bg-black/90 border border-emerald-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          <div className="p-4 bg-emerald-900/20 flex justify-between items-center border-b border-emerald-500/10">
            <h4 className="font-black text-emerald-400 text-xs tracking-widest uppercase flex items-center gap-2"><Sparkles size={14}/> AgroBot</h4>
            <X size={14} className="cursor-pointer text-emerald-500" onClick={() => setIsOpen(false)} />
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`text-[10px] p-3 rounded-2xl ${m.role === 'user' ? 'bg-indigo-900/50 text-white ml-8' : 'bg-slate-800 text-slate-300 mr-8'}`}>{m.text}</div>
            ))}
            {isLoading && <Loader2 className="animate-spin text-emerald-500" size={16} />}
            <div ref={chatEndRef} />
          </div>
          <div className="p-2 border-t border-white/5 flex gap-2">
            <input className="flex-1 bg-transparent border-0 text-[10px] text-white focus:ring-0" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Ask AI..." />
            <button onClick={sendMessage}><Send size={14} className="text-emerald-500" /></button>
          </div>
        </div>
      )}
    </div>
  );
};
