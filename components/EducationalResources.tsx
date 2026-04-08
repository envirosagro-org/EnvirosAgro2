import React, { useState, useEffect } from 'react';
import { BookOpen, Video, FileText, ChevronRight, PlayCircle, ExternalLink, GraduationCap, Link as LinkIcon, Calendar, Mic, MessageSquare, Award, CheckCircle2, Volume2, VolumeX } from 'lucide-react';
import { User, ViewState } from '../types';
import { ShareButton } from './ShareButton';
import { toast } from 'sonner';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'guide';
  category: 'sustainable_ag' | 'blockchain' | 'platform_usage';
  url?: string;
  duration?: string;
  readTime?: string;
}

const RESOURCES: Resource[] = [
  {
    id: 'res-1',
    title: 'Introduction to Regenerative Agriculture',
    description: 'Learn the core principles of regenerative agriculture and how it restores soil health.',
    type: 'article',
    category: 'sustainable_ag',
    readTime: '5 min read'
  },
  {
    id: 'res-2',
    title: 'Blockchain in Agriculture: A Primer',
    description: 'Understand how blockchain technology ensures transparency and traceability in the supply chain.',
    type: 'video',
    category: 'blockchain',
    duration: '12:30'
  },
  {
    id: 'res-3',
    title: 'Getting Started with EnvirosAgro',
    description: 'A comprehensive guide to navigating the platform, setting up your profile, and connecting your first node.',
    type: 'guide',
    category: 'platform_usage',
    readTime: '10 min read'
  },
  {
    id: 'res-4',
    title: 'Water Conservation Techniques',
    description: 'Advanced methods for optimizing water usage in arid environments.',
    type: 'article',
    category: 'sustainable_ag',
    readTime: '8 min read'
  },
  {
    id: 'res-5',
    title: 'Understanding Smart Contracts',
    description: 'How smart contracts automate agreements and payments on the EnvirosAgro network.',
    type: 'article',
    category: 'blockchain',
    readTime: '6 min read'
  },
  {
    id: 'res-6',
    title: 'Minting Your First Carbon Credit',
    description: 'Step-by-step video tutorial on the MRV process and minting carbon credits.',
    type: 'video',
    category: 'platform_usage',
    duration: '15:45'
  }
];

const LEVELS = [
  { id: 'sehti-primary', title: 'SEHTI Primary', description: 'Basic Agriculture & Soil 101' },
  { id: 'sehti-junior', title: 'SEHTI Junior', description: 'Crop Management & Water Systems' },
  { id: 'sehti-senior', title: 'SEHTI Senior', description: 'Precision Farming & Regenerative Ag' },
  { id: 'sehti-pro', title: 'SEHTI Pro', description: 'Blockchain in Ag & Advanced AI Swarms' }
];

const generateModules = (level: string, count: number) => {
  const modules = [];
  const topics = {
    'sehti-primary': ['Soil Health', 'Plant Biology', 'Water Basics', 'Basic Tools', 'Weather Patterns', 'Seed Germination', 'Composting Basics', 'Garden Insects'],
    'sehti-junior': ['Crop Rotation', 'Irrigation Systems', 'Pest Management', 'Harvesting Techniques', 'Greenhouse Basics', 'Soil Testing', 'Organic Fertilizers', 'Plant Diseases'],
    'sehti-senior': ['Precision Agriculture', 'Regenerative Practices', 'Agroforestry', 'Hydroponics', 'Farm Economics', 'Climate Resilience', 'Advanced Genetics', 'Supply Chain'],
    'sehti-pro': ['Blockchain Traceability', 'AI Swarm Robotics', 'Carbon Credits', 'IoT Sensor Networks', 'Global Market Analysis', 'Policy & Regulation', 'Synthetic Biology', 'Space Agriculture']
  };

  const levelTopics = topics[level as keyof typeof topics] || topics['sehti-primary'];

  for (let i = 1; i <= count; i++) {
    const topicIndex = (i - 1) % levelTopics.length;
    const baseTopic = levelTopics[topicIndex];
    
    modules.push({
      id: `${level}-m${i}`,
      title: `${baseTopic} - Part ${Math.ceil(i / levelTopics.length)}`,
      topic: baseTopic,
      notes: `Comprehensive study material for ${baseTopic}. This module covers advanced concepts, practical applications, and theoretical frameworks necessary for mastering ${level} level agriculture. Lesson ${i} focuses on specific methodologies and case studies relevant to modern farming practices.`,
      videoPrompt: `Educational visualization explaining ${baseTopic} concepts for ${level} level students.`,
      schedule: `Week ${Math.ceil(i / 5)}, Day ${(i - 1) % 5 + 1} 10:00 AM`,
      catQuestions: [
        {
          question: `What is the primary focus of ${baseTopic}?`,
          options: ['Water Management', 'Soil Health', 'Crop Yield', 'All of the above'],
          correctAnswer: 3
        },
        {
          question: `Which of the following is a key benefit of practicing ${baseTopic}?`,
          options: ['Increased costs', 'Sustainability', 'Soil degradation', 'Pest attraction'],
          correctAnswer: 1
        },
        {
          question: `How often should ${baseTopic} principles be applied?`,
          options: ['Never', 'Once a year', 'Continuously', 'Only in winter'],
          correctAnswer: 2
        }
      ],
      assignment: {
        title: `${baseTopic} Practical Assignment`,
        description: `Download the assignment template, complete the practical exercises related to ${baseTopic}, and upload your findings.`
      }
    });
  }
  return modules;
};

const MODULES: Record<string, any[]> = {
  'sehti-primary': generateModules('sehti-primary', 800),
  'sehti-junior': generateModules('sehti-junior', 800),
  'sehti-senior': generateModules('sehti-senior', 800),
  'sehti-pro': generateModules('sehti-pro', 800)
};

interface EducationalResourcesProps {
  user?: User;
  onNavigate: (view: ViewState, section?: string | null, pushToHistory?: boolean, params?: any) => void;
  onUpdateUser?: (user: User) => void;
  onEmitSignal?: (signal: any) => void;
}

const EducationalResources: React.FC<EducationalResourcesProps> = ({ user, onNavigate, onUpdateUser, onEmitSignal }) => {
  const [activeTab, setActiveTab] = useState<'resources' | 'elearning'>('resources');
  const [activeCategory, setActiveCategory] = useState<'all' | 'sustainable_ag' | 'blockchain' | 'platform_usage'>('all');
  
  // E-Learning State
  const [isRegistered, setIsRegistered] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<any | null>(null);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [visibleModulesCount, setVisibleModulesCount] = useState(20);
  const [lessonProgress, setLessonProgress] = useState<Record<string, { catScore?: number, assignmentSubmitted?: boolean, catAnswers?: Record<number, number> }>>({});

  useEffect(() => {
    return () => {
      if (isPlayingVoice) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlayingVoice]);

  const filteredResources = activeCategory === 'all' 
    ? RESOURCES 
    : RESOURCES.filter(r => r.category === activeCategory);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'video': return <Video size={20} className="text-indigo-400" />;
      case 'guide': return <BookOpen size={20} className="text-emerald-400" />;
      default: return <FileText size={20} className="text-blue-400" />;
    }
  };

  const handleRegister = () => {
    setIsRegistered(true);
    toast.success("Successfully registered for E-Learning Portal!");
  };

  const handleTakeExam = (levelId: string) => {
    const levelModules = MODULES[levelId] || [];
    const completedInLevel = levelModules.filter(m => completedModules.includes(m.id)).length;
    
    if (completedInLevel < 800) {
      toast.error(`You must complete all 800 modules for this stage before taking the exam. (Completed: ${completedInLevel}/800)`);
      return;
    }
    
    const levelTitle = LEVELS.find(l => l.id === levelId)?.title || levelId;
    const achievement = `${levelTitle} Certification`;

    if (user && onUpdateUser) {
      const currentAchievements = user.achievements || [];
      if (!currentAchievements.includes(achievement)) {
        onUpdateUser({
          ...user,
          achievements: [...currentAchievements, achievement]
        });
      }
    }

    if (onEmitSignal && user) {
      onEmitSignal({
        type: 'certification',
        title: 'SEHTI Certification Earned',
        message: `Steward ${user.esin} has earned the ${achievement}.`
      });
    }

    toast.success(`Passed ${levelTitle.toUpperCase()} Exam! Certification minted to Knowledge Hub and added to your profile.`);
  };

  const handleCompleteLesson = (moduleId: string) => {
    const progress = lessonProgress[moduleId];
    if (!progress || progress.catScore === undefined || !progress.assignmentSubmitted) {
      toast.error("You must complete the CAT and submit the assignment before marking this lesson as complete.");
      return;
    }

    if (!completedModules.includes(moduleId)) {
      setCompletedModules(prev => [...prev, moduleId]);
      toast.success("Module completed!");
    }
  };

  const handleCatAnswer = (moduleId: string, questionIndex: number, answerIndex: number) => {
    setLessonProgress(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        catAnswers: {
          ...(prev[moduleId]?.catAnswers || {}),
          [questionIndex]: answerIndex
        }
      }
    }));
  };

  const handleSubmitCat = (moduleId: string, questions: any[]) => {
    const answers = lessonProgress[moduleId]?.catAnswers || {};
    if (Object.keys(answers).length < questions.length) {
      toast.error("Please answer all CAT questions.");
      return;
    }

    let score = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        score += 1;
      }
    });

    const percentage = (score / questions.length) * 100;

    setLessonProgress(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        catScore: percentage
      }
    }));

    toast.success(`CAT Submitted! You scored ${percentage}%.`);
  };

  const handleUploadAssignment = (moduleId: string) => {
    // Simulate upload and system marking
    toast.loading("Uploading and marking assignment...", { id: 'upload' });
    setTimeout(() => {
      toast.success("Assignment marked successfully! Grade: A", { id: 'upload' });
      setLessonProgress(prev => ({
        ...prev,
        [moduleId]: {
          ...prev[moduleId],
          assignmentSubmitted: true
        }
      }));
    }, 2000);
  };

  const toggleVoice = (text: string) => {
    if (isPlayingVoice) {
      window.speechSynthesis.cancel();
      setIsPlayingVoice(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsPlayingVoice(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingVoice(true);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
              <GraduationCap size={24} className="text-emerald-400" />
            </div>
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Educational <span className="text-emerald-400">Hub</span></h2>
          </div>
          <p className="text-sm text-slate-400 font-medium max-w-2xl">
            Master the tools, technologies, and practices driving the regenerative agriculture revolution.
          </p>
        </div>
        
        <div className="flex bg-black/40 p-1 rounded-full border border-white/10">
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'resources' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Resources
          </button>
          <button
            onClick={() => setActiveTab('elearning')}
            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'elearning' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            E-Learning Portal
          </button>
        </div>
      </div>

      {activeTab === 'resources' && (
        <div className="space-y-8 animate-in fade-in">
          <div className="flex flex-wrap gap-4">
            {[
              { id: 'all', label: 'All Resources' },
              { id: 'sustainable_ag', label: 'Sustainable Agriculture' },
              { id: 'blockchain', label: 'Blockchain Tech' },
              { id: 'platform_usage', label: 'Platform Guides' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <div key={resource.id} className="glass-card p-6 rounded-3xl border border-white/10 hover:border-emerald-500/30 transition-all group flex flex-col h-full bg-black/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
                  {getIconForType(resource.type)}
                </div>
                
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-colors">
                    {getIconForType(resource.type)}
                  </div>
                  <span className="px-3 py-1 bg-white/5 text-slate-400 text-[9px] font-black uppercase rounded-full border border-white/10 tracking-widest">
                    {resource.type}
                  </span>
                </div>
                
                <div className="flex-1 space-y-3 relative z-10">
                  <h3 className="text-xl font-bold text-white leading-tight group-hover:text-emerald-400 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {resource.description}
                  </p>
                </div>
                
                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                  <span className="text-xs font-mono text-slate-500">
                    {resource.type === 'video' ? resource.duration : resource.readTime}
                  </span>
                  <div className="flex items-center gap-4">
                    <ShareButton 
                      title={`EnvirosAgro Education: ${resource.title}`}
                      text={`Check out this educational resource: ${resource.title} on EnvirosAgro!`}
                      className="text-slate-500 hover:text-emerald-400 transition-colors"
                      iconSize={16}
                    />
                    <button 
                      onClick={() => onNavigate('multimedia_generator', null, true, { 
                        prompt: `Generate educational media for: ${resource.title}. Description: ${resource.description}`, 
                        type: resource.type === 'video' ? 'video' : 'document' 
                      })} 
                      className="flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider"
                    >
                       {resource.type === 'video' ? 'Watch Now' : 'Read More'}
                       <ChevronRight size={14} />
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'elearning' && (
        <div className="space-y-8 animate-in fade-in">
          {!isRegistered ? (
            <div className="glass-card p-12 rounded-[48px] border border-emerald-500/20 bg-emerald-900/10 text-center space-y-6">
              <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap size={48} className="text-emerald-400" />
              </div>
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Join the E-Learning Portal</h3>
              <p className="text-emerald-100/80 max-w-2xl mx-auto">
                Register as a learner to access structured agricultural programs from Primary to Pro levels. Earn certifications linked to the Knowledge Hub.
              </p>
              <button 
                onClick={handleRegister}
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
              >
                Register as Learner
              </button>
            </div>
          ) : activeLesson ? (
            <div className="space-y-6">
              <button 
                onClick={() => { setActiveLesson(null); setIsPlayingVoice(false); window.speechSynthesis.cancel(); }}
                className="text-emerald-400 hover:text-emerald-300 text-xs font-black uppercase tracking-widest flex items-center gap-2"
              >
                <ChevronRight size={16} className="rotate-180" /> Back to Modules
              </button>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="glass-card p-8 rounded-3xl border border-white/10 bg-black/40">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-black text-white">{activeLesson.title}</h3>
                        <p className="text-emerald-400 font-mono text-sm mt-1">Topic: {activeLesson.topic}</p>
                      </div>
                      <button 
                        onClick={() => toggleVoice(activeLesson.notes)}
                        className={`p-3 rounded-full transition-all ${isPlayingVoice ? 'bg-emerald-500 text-white animate-pulse' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                      >
                        {isPlayingVoice ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                    </div>
                    
                    <div className="prose prose-invert max-w-none">
                      <p className="text-slate-300 leading-relaxed text-lg">{activeLesson.notes}</p>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-white/10">
                      <h4 className="text-xl font-bold text-white mb-4">Continuous Assessment Test (CAT)</h4>
                      {lessonProgress[activeLesson.id]?.catScore !== undefined ? (
                        <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold">
                          CAT Completed! Score: {lessonProgress[activeLesson.id]?.catScore}%
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {activeLesson.catQuestions?.map((q: any, qIdx: number) => (
                            <div key={qIdx} className="space-y-3">
                              <p className="text-white font-medium">{qIdx + 1}. {q.question}</p>
                              <div className="space-y-2">
                                {q.options.map((opt: string, oIdx: number) => (
                                  <label key={oIdx} className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                                    <input 
                                      type="radio" 
                                      name={`cat-${activeLesson.id}-${qIdx}`} 
                                      checked={lessonProgress[activeLesson.id]?.catAnswers?.[qIdx] === oIdx}
                                      onChange={() => handleCatAnswer(activeLesson.id, qIdx, oIdx)}
                                      className="text-emerald-500 focus:ring-emerald-500 bg-black border-white/20"
                                    />
                                    <span className="text-slate-300 text-sm">{opt}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                          <button 
                            onClick={() => handleSubmitCat(activeLesson.id, activeLesson.catQuestions)}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all"
                          >
                            Submit CAT
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10">
                      <h4 className="text-xl font-bold text-white mb-2">Practical Assignment</h4>
                      <p className="text-slate-400 text-sm mb-4">{activeLesson.assignment?.description}</p>
                      {lessonProgress[activeLesson.id]?.assignmentSubmitted ? (
                        <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold">
                          Assignment Submitted & Marked! Grade: A
                        </div>
                      ) : (
                        <div className="flex gap-4">
                          <button className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all">
                            Download Template
                          </button>
                          <button 
                            onClick={() => handleUploadAssignment(activeLesson.id)}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all"
                          >
                            Upload & Mark
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                      <button 
                        onClick={() => handleCompleteLesson(activeLesson.id)}
                        disabled={completedModules.includes(activeLesson.id)}
                        className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${completedModules.includes(activeLesson.id) ? 'bg-emerald-500/20 text-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
                      >
                        {completedModules.includes(activeLesson.id) ? (
                          <><CheckCircle2 size={16} /> Completed</>
                        ) : (
                          'Mark as Complete'
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="glass-card p-8 rounded-3xl border border-indigo-500/20 bg-indigo-900/10 flex flex-col items-center justify-center text-center space-y-4 py-12">
                     <Video size={48} className="text-indigo-400 mb-2" />
                     <h4 className="text-xl font-bold text-white">Lesson Visualization</h4>
                     <p className="text-indigo-200/70 text-sm max-w-md">Generate a multimedia video for this schedule using Agro Multimedia.</p>
                     <button 
                       onClick={() => onNavigate('multimedia_generator', null, true, { prompt: activeLesson.videoPrompt, type: 'video' })}
                       className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-black uppercase tracking-widest transition-all mt-4"
                     >
                       Generate Video
                     </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="glass-card p-6 rounded-3xl border border-white/10 bg-black/40">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Calendar size={16} className="text-emerald-400" /> Schedule
                    </h4>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-sm text-slate-300">
                      {activeLesson.schedule}
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-3xl border border-white/10 bg-black/40">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                      <MessageSquare size={16} className="text-blue-400" /> Discussion Forum
                    </h4>
                    <p className="text-xs text-slate-400 mb-4">Linked with Community Steward Feed</p>
                    <button 
                      onClick={() => onNavigate('community')}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      Open Community Hub <ExternalLink size={14} />
                    </button>
                  </div>
                  <div className="glass-card p-6 rounded-3xl border border-white/10 bg-black/40">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                      <BookOpen size={16} className="text-purple-400" /> Supplementary
                    </h4>
                    <div className="space-y-2">
                      <button 
                        onClick={() => setActiveTab('resources')}
                        className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-between"
                      >
                        <span>Resources Library</span> <ChevronRight size={14} />
                      </button>
                      <button 
                        onClick={() => onNavigate('research')}
                        className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-between"
                      >
                        <span>Innovation Hub</span> <ChevronRight size={14} />
                      </button>
                      <button 
                        onClick={() => onNavigate('media')}
                        className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-between"
                      >
                        <span>Media Ledger</span> <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="glass-card p-6 rounded-3xl border border-emerald-500/20 bg-emerald-900/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="text-lg font-black text-white uppercase tracking-wider">Supplementary Learning</h4>
                  <p className="text-sm text-emerald-100/80 mt-1">Access additional educational resources, research papers, and media.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setActiveTab('resources')} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-xs font-bold transition-all flex items-center gap-2">
                    <BookOpen size={14} /> Resources Library
                  </button>
                  <button onClick={() => onNavigate('research')} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-xs font-bold transition-all flex items-center gap-2">
                    <ExternalLink size={14} /> Innovation Hub
                  </button>
                  <button onClick={() => onNavigate('media')} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-xs font-bold transition-all flex items-center gap-2">
                    <Video size={14} /> Media Ledger
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {LEVELS.map(level => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`p-6 rounded-3xl border text-left transition-all ${selectedLevel === level.id ? 'bg-emerald-600/20 border-emerald-500/50' : 'bg-black/40 border-white/10 hover:border-white/20'}`}
                  >
                    <h4 className={`text-lg font-black uppercase tracking-wider ${selectedLevel === level.id ? 'text-emerald-400' : 'text-white'}`}>{level.title}</h4>
                    <p className="text-xs text-slate-400 mt-2">{level.description}</p>
                  </button>
                ))}
              </div>

              {selectedLevel && (
                <div className="glass-card p-8 rounded-3xl border border-white/10 bg-black/40 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                        {LEVELS.find(l => l.id === selectedLevel)?.title} Modules
                      </h3>
                      <p className="text-sm text-slate-400 mt-1">
                        Completed: {MODULES[selectedLevel]?.filter((m: any) => completedModules.includes(m.id)).length || 0} / {MODULES[selectedLevel]?.length || 0}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleTakeExam(selectedLevel)}
                      className="px-6 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
                    >
                      <Award size={16} /> Take Exam
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {MODULES[selectedLevel]?.slice(0, visibleModulesCount).map((module: any) => {
                      const isCompleted = completedModules.includes(module.id);
                      return (
                        <div key={module.id} className={`p-6 rounded-2xl border transition-all group ${isCompleted ? 'bg-emerald-900/10 border-emerald-500/30' : 'bg-white/5 border-white/5 hover:border-emerald-500/30'}`}>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className={`text-lg font-bold transition-colors ${isCompleted ? 'text-emerald-400' : 'text-white group-hover:text-emerald-400'}`}>{module.title}</h4>
                              <span className="text-xs text-emerald-500 font-mono">{module.topic}</span>
                            </div>
                            <div className={`p-2 rounded-lg ${isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-black/40 text-slate-400'}`}>
                              {isCompleted ? <CheckCircle2 size={16} /> : <Calendar size={16} />}
                            </div>
                          </div>
                          <p className="text-sm text-slate-400 mb-6 line-clamp-2">{module.notes}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-slate-500">{module.schedule}</span>
                            <button 
                              onClick={() => setActiveLesson(module)}
                              className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${isCompleted ? 'text-emerald-500 hover:text-emerald-400' : 'text-emerald-400 hover:text-emerald-300'}`}
                            >
                              {isCompleted ? 'Review Lesson' : 'Start Lesson'} <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {MODULES[selectedLevel] && visibleModulesCount < MODULES[selectedLevel].length && (
                    <div className="mt-8 flex justify-center">
                      <button 
                        onClick={() => setVisibleModulesCount(prev => prev + 20)}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full text-xs font-black uppercase tracking-widest transition-all"
                      >
                        Load More Modules ({visibleModulesCount} / {MODULES[selectedLevel].length})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EducationalResources;
