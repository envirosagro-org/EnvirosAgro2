import React, { useState, useEffect } from 'react';
import { BookOpen, Video, FileText, ChevronRight, PlayCircle, ExternalLink, GraduationCap, Link as LinkIcon, Calendar, Mic, MessageSquare, Award, CheckCircle2, Volume2, VolumeX, RefreshCw, Radio, ShieldCheck, Loader2 } from 'lucide-react';
import { User, ViewState } from '../types';
import { SectionTabs } from './SectionTabs';
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
  { id: 'sehti-primary', title: 'Agro Junior: SEHTI Primary', description: 'Social Agriculture & Community Governance (SEHTI Framework)' },
  { id: 'sehti-junior', title: 'Agro Junior: SEHTI Junior', description: 'Environmental & Human Agriculture (SEHTI Framework)' },
  { id: 'sehti-senior', title: 'Agro Junior: SEHTI Senior', description: 'Technical Agriculture & Digital MRV (SEHTI Framework)' },
  { id: 'sehti-pro', title: 'Agro Junior: SEHTI Pro', description: 'Industrial Agriculture & Global Mesh (SEHTI Framework)' }
];

const LEVEL_UNITS: Record<string, string[]> = {
  'sehti-primary': [
    'Community Foundations', 'Collective Governance', 'Resource Sharing Systems', 'Conflict Resolution',
    'Cooperative Management', 'Social Equity & Inclusion', 'Land Tenure & Rights', 'Cultural Heritage',
    'Urban Farming Collectives', 'Policy Advocacy', 'Peer-to-Peer Learning', 'Social Safety Nets',
    'Youth in Agriculture', 'Gender Equality', 'Rural Development', 'Basic Agricultural Math'
  ],
  'sehti-junior': [
    'Holistic Soil Health', 'Water Stewardship', 'Biodiversity Conservation', 'Human Nutrition',
    'Worker Safety', 'Labor Rights', 'Ecosystem Services', 'Climate Adaptation',
    'Regenerative Grazing', 'Permaculture Principles', 'Agro-ecology', 'Public Health Integration',
    'Crop Diversity', 'Natural Fertilization', 'Pest Management', 'Environmental Policy'
  ],
  'sehti-senior': [
    'IoT & Sensor Networks', 'Satellite & Drone Mapping', 'Digital MRV Protocols', 'Smart Contracts',
    'AI & Predictive Analytics', 'Autonomous Robotics', 'Precision Irrigation', 'Data Sovereignty',
    'GIS & Spatial Mapping', 'Variable Rate Tech', 'Renewable Energy', 'Controlled Environment Ag',
    'Advanced Genetics', 'Tokenomics & DeFi', 'Digital Twins', 'API & Mesh Networking'
  ],
  'sehti-pro': [
    'Circular Economy', 'Sustainable Supply Chains', 'Innovative Finance', 'Carbon Markets',
    'Global Market Analysis', 'Industrial Mesh', 'Synthetic Biology', 'Space Agriculture',
    'Logistics Optimization', 'EAC Minting Protocols', 'Impact Investing', 'Industrial Symbiosis',
    'Global Trade Policy', 'Agricultural Law', 'Risk Management', 'Corporate Sustainability'
  ]
};

const BASE_TOPICS: Record<string, string[]> = {
  'sehti-primary': [
    'Soil Science', 'Plant Biology', 'Photosynthesis', 'Water Cycle', 'Seed Germination', 'Composting',
    'Garden Insects', 'Basic Tools', 'Weather Patterns', 'Pollination', 'Root Systems', 'Leaf Anatomy',
    'Stem Functions', 'Flower Structure', 'Fruit Development', 'Seed Dispersal', 'Soil Texture', 'Soil pH',
    'Organic Matter', 'Earthworm Ecology', 'Microbial Life', 'Nutrient Cycling', 'Nitrogen Fixation',
    'Carbon Sequestration', 'Urban Farming', 'School Gardens', 'Local Food Systems', 'Farmer Cooperatives',
    'Fair Trade', 'Agricultural History', 'Traditional Farming', 'Indigenous Knowledge', 'Social Safety',
    'Labor Rights', 'Gender Equality', 'Youth in Ag', 'Rural Development', 'Public Speaking',
    'Record Keeping', 'Basic Math', 'Budgeting', 'Crop Seasons', 'Harvesting Basics', 'Storage Basics',
    'Market Stalls', 'Community Kitchens', 'Food Waste', 'Nutrition Basics', 'Healthy Eating', 'Agri-Tourism'
  ],
  'sehti-junior': [
    'Soil Health', 'Water Stewardship', 'Biodiversity', 'Human Nutrition', 'Worker Safety', 'Labor Rights',
    'Ecosystem Services', 'Climate Adaptation', 'Regenerative Grazing', 'Permaculture', 'Agro-ecology',
    'Public Health', 'Crop Rotation', 'Intercropping', 'Cover Cropping', 'No-Till', 'Mulching',
    'Pest Management', 'Biological Controls', 'Natural Fertilizers', 'Green Manure', 'Irrigation Efficiency',
    'Drip Irrigation', 'Rainwater Harvesting', 'Aquifer Recharge', 'Wetland Conservation', 'Riparian Buffers',
    'Agroforestry', 'Silvopasture', 'Windbreaks', 'Pollinator Habitats', 'Wildlife Corridors',
    'Invasive Species', 'Genetic Diversity', 'Heirloom Seeds', 'Seed Saving', 'Food Security',
    'Dietary Diversity', 'Post-Harvest Handling', 'Food Preservation', 'Cold Chain', 'Market Access',
    'Value Addition', 'Farm Safety', 'Ergonomics', 'First Aid', 'Environmental Policy', 'Climate Science',
    'Carbon Footprint', 'Sustainable Living'
  ],
  'sehti-senior': [
    'IoT Sensors', 'Satellite Imagery', 'Drone Mapping', 'Digital MRV', 'Smart Contracts', 'AI Prediction',
    'Blockchain', 'Mesh Networking', 'Robotics', 'Precision Irrigation', 'Remote Sensing', 'Data Sovereignty',
    'GIS Mapping', 'Variable Rate', 'Auto-Steer', 'Telematics', 'Big Data', 'Machine Learning',
    'Computer Vision', 'Edge Computing', 'Renewable Energy', 'Solar Irrigation', 'Biogas', 'Wind Energy',
    'Hydroponics', 'Aquaponics', 'Aeroponics', 'Vertical Farming', 'CEA Systems', 'Advanced Genetics',
    'CRISPR', 'Bioinformatics', 'Synthetic Biology', 'Microbiome', 'EAC Protocols', 'Tokenomics',
    'DeFi', 'DAO Governance', 'Cybersecurity', 'Digital Twins', 'Cloud Computing', 'API Integration',
    'Mobile Apps', 'Sensor Calibration', 'Data Visualization', 'Network Security', 'Smart Grids',
    'Automation Logic', 'System Integration', 'Tech Ethics'
  ],
  'sehti-pro': [
    'Circular Economy', 'Supply Chains', 'Innovative Finance', 'Carbon Markets', 'Market Analysis',
    'Industrial Mesh', 'Synthetic Biology', 'Space Agriculture', 'Logistics', 'EAC Minting',
    'Impact Investing', 'Industrial Symbiosis', 'Trade Policy', 'Ag Law', 'Risk Management',
    'Sustainability', 'ReFi', 'Natural Capital', 'ESG Reporting', 'Corporate Strategy', 'Global Trade',
    'IP Rights', 'Biosecurity', 'Food Safety', 'HACCP', 'Traceability', 'Cold Chain Logistics',
    'Warehouse Management', 'Inventory Control', 'Procurement', 'Commodity Trading', 'Futures & Options',
    'Ag Insurance', 'Microfinance', 'Public-Private', 'Intl Development', 'UN SDGs', 'Climate Finance',
    'Carbon Farming', 'Methane Mitigation', 'Waste-to-Energy', 'Sustainable Packaging', 'Circular Design',
    'Supply Chain Ethics', 'Green Bonds', 'Carbon Offsetting', 'Regenerative Business', 'Global Logistics',
    'Ag-Tech Investment', 'Policy Advocacy'
  ]
};

const generateModules = (level: string, count: number) => {
  const modules = [];
  const levelPrefix = level.split('-')[1].toUpperCase();
  const units = LEVEL_UNITS[level] || [];
  const baseTopics = BASE_TOPICS[level] || [];
  const topicsPerUnit = Math.ceil(count / units.length);
  
  for (let i = 1; i <= count; i++) {
    const unitIndex = Math.floor((i - 1) / topicsPerUnit);
    const unitName = units[unitIndex % units.length];
    const topicIndex = (i - 1) % baseTopics.length;
    const baseTopic = baseTopics[topicIndex];
    
    // Ensure unique topic by combining base topic with unit context and sequence
    const uniqueTopic = `${baseTopic} in ${unitName} (Lesson ${i})`;
    const unitNumber = unitIndex + 1;
    const sku = `EA-${levelPrefix}-${baseTopic.substring(0, 3).toUpperCase()}-${String(i).padStart(3, '0')}`;
    
    modules.push({
      id: `${level}-m${i}`,
      sku: sku,
      title: `[${sku}] ${uniqueTopic}`,
      topic: uniqueTopic,
      unit: unitName,
      pillar: LEVELS.find(l => l.id === level)?.title || 'General',
      notes: `
### Agro Junior SEHTI Unit: ${unitName}
**Lesson Topic:** ${uniqueTopic}
**Module SKU:** ${sku}

This lesson is part of the **Agro Junior** curriculum, framed within the **SEHTI model** to ensure academic qualification and industrial readiness. 

**Focus:** ${uniqueTopic} (Unit ${unitNumber})

In this unit, we explore the **art and science** of ${baseTopic} through the lens of ${unitName}. This module is synchronized with standard school agricultural topics but enhanced with the **EnvirosAgro** whole agricultural concept.

${baseTopic} combines traditional wisdom (the art) with modern methodologies verified through Digital MRV protocols (the science). By studying this module, you are participating in the knowledge sharding process, ensuring that critical agricultural intelligence is preserved and distributed across the mesh.

**Key Learning Objectives:**
1. Understand the role of ${baseTopic} within the ${unitName} unit.
2. Implement practical ${baseTopic} techniques in a simulated environment, balancing art and science.
3. Verify outcomes using the EAC minting logic and SEHTI standards.
4. Pass this knowledge to the next node in your collective as a Certified Steward.`,
      videoPrompt: `Educational visualization for ${sku}: Explaining ${uniqueTopic} within the Agro Junior ${LEVELS.find(l => l.id === level)?.title} framework.`,
      schedule: `Unit ${unitNumber}, Lesson ${((i - 1) % topicsPerUnit) + 1}`,
      relatedResources: [
        { title: `${baseTopic} Technical Specification`, url: '#' },
        { title: `Agro Junior: ${unitName} Case Study`, url: '#' }
      ],
      catQuestions: [
        {
          question: `Regarding ${sku}, how does ${baseTopic} integrate into the ${unitName} unit?`,
          options: [
            `By focusing on ${unitName} specific metrics`,
            'By ignoring traditional art',
            'By bypassing the SEHTI framework',
            'By avoiding scientific verification'
          ],
          correctAnswer: 0
        },
        {
          question: `How does this lesson (Unit ${unitNumber}) ensure uniqueness in the Agro Junior path?`,
          options: [
            'By repeating previous modules',
            `By addressing a specific shard of ${unitName} through ${baseTopic}`,
            'By using generic data',
            'By avoiding practical assignments'
          ],
          correctAnswer: 1
        },
        {
          question: `Which outcome is expected after completing the ${sku} lesson?`,
          options: [
            'Knowledge isolation',
            `Successful transfer of ${baseTopic} intelligence within the SEHTI framework`,
            'Increased waste',
            'Manual verification only'
          ],
          correctAnswer: 1
        }
      ],
      assignment: {
        title: `Agro Junior Practical: ${sku}`,
        description: `Design a unique implementation plan for ${uniqueTopic} that demonstrates both the art and science of agriculture. Ensure your plan aligns with the SEHTI ${LEVELS.find(l => l.id === level)?.title} standards, embodies the whole agricultural concept, and includes a strategy for passing this specific WHATisAG shard to a peer learner.`
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
  const [activeTab, setActiveTab] = useState<'resources' | 'elearning' | 'industrial' | 'tutor' | 'teacher' | 'tree'>('resources');
  const [activeCategory, setActiveCategory] = useState<'all' | 'sustainable_ag' | 'blockchain' | 'platform_usage'>('all');
  const [knowledgeProgress, setKnowledgeProgress] = useState(42); // Percentage for tree growth
  
  // E-Learning State
  const [isRegistered, setIsRegistered] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<any | null>(null);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [visibleModulesCount, setVisibleModulesCount] = useState(20);
  const [lessonProgress, setLessonProgress] = useState<Record<string, { catScore?: number, assignmentSubmitted?: boolean, catAnswers?: Record<number, number> }>>({});

  const [isAiringMission, setIsAiringMission] = useState(false);
  const [missionStep, setMissionStep] = useState(0);
  const [missionCompleted, setMissionCompleted] = useState(false);

  const handleAirMission = () => {
    setIsAiringMission(true);
    setMissionStep(1);
    toast.loading("Initializing Industrial Mesh Sync...", { id: 'mission' });
    
    // Step 1: Syncing
    setTimeout(() => {
      setMissionStep(2);
      toast.loading("Broadcasting Live Mission Signal...", { id: 'mission' });
      
      // Step 2: Broadcasting
      setTimeout(() => {
        setMissionStep(3);
        toast.loading("Verifying Industrial Professional Standards...", { id: 'mission' });
        
        // Step 3: Verifying
        setTimeout(() => {
          setIsAiringMission(false);
          setMissionStep(4);
          setMissionCompleted(true);
          toast.success("Industrial Professional Qualification Earned!", { id: 'mission' });
          
          if (user && onUpdateUser) {
            const currentAchievements = user.achievements || [];
            const newAchievement = "Industrial Professional Qualification";
            if (!currentAchievements.includes(newAchievement)) {
              onUpdateUser({
                ...user,
                achievements: [...currentAchievements, newAchievement],
                isReadyForHire: true
              });
            }
          }

          if (onEmitSignal && user) {
            onEmitSignal({
              type: 'industrial',
              title: 'New Industrial Professional',
              message: `Steward ${user.esin} has earned the Industrial Professional Qualification and joined the Worker Cloud.`
            });
          }
        }, 3000);
      }, 3000);
    }, 2000);
  };

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
            Agro Junior: Promoting agricultural education through SEHTI-framed e-learning and industrial-based learning.
          </p>
        </div>
        
        <SectionTabs 
          tabs={[
            { id: 'resources', label: 'Resources' },
            { id: 'elearning', label: 'E-Learning Portal' },
            { id: 'tutor', label: 'AI SEHTI Tutor' },
            { id: 'industrial', label: 'Industrial Learning' },
            { id: 'teacher', label: 'Teacher Dashboard' },
            { id: 'tree', label: 'Knowledge Tree' },
          ]}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as any)}
          variant="industrial"
        />
      </div>

      {/* --- VIEW: KNOWLEDGE TREE --- */}
      {activeTab === 'tree' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
          <div className="glass-card p-12 rounded-[64px] border border-emerald-500/20 bg-emerald-500/[0.02] relative overflow-hidden min-h-[600px] flex flex-col items-center justify-center">
            <div className="absolute top-12 left-12">
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Tree of <span className="text-emerald-400">Knowledge.</span></h3>
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.4em] mt-1">SEHTI_EDUCATIONAL_EVOLUTION</p>
            </div>

            <div className="relative w-full max-w-3xl aspect-square flex items-center justify-center">
              {/* Visual Tree Representation */}
              <div className="relative">
                {/* Trunk */}
                <div className="w-8 h-64 bg-emerald-900/40 border-x border-emerald-500/20 rounded-t-full relative z-10">
                  <div className="absolute inset-0 bg-emerald-500/10 animate-pulse"></div>
                </div>
                
                {/* Branches & Leaves (Growth based on progress) */}
                {[
                  { angle: -45, scale: 0.8, level: 'Primary', color: 'bg-emerald-500' },
                  { angle: 45, scale: 0.9, level: 'Junior', color: 'bg-emerald-400' },
                  { angle: -30, scale: 1.1, level: 'Senior', color: 'bg-teal-500' },
                  { angle: 30, scale: 1.2, level: 'Pro', color: 'bg-blue-500' }
                ].map((branch, i) => {
                  const isUnlocked = knowledgeProgress > (i * 25);
                  return (
                    <div 
                      key={i} 
                      className={`absolute top-1/4 left-1/2 origin-bottom transition-all duration-1000 ${isUnlocked ? 'opacity-100 scale-100' : 'opacity-20 scale-50'}`}
                      style={{ transform: `translateX(-50%) rotate(${branch.angle}deg) scale(${branch.scale})` }}
                    >
                      <div className={`w-2 h-32 ${branch.color}/20 border-x border-white/10 rounded-t-full`}></div>
                      <div className={`absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 ${branch.color} rounded-full blur-2xl opacity-20 animate-pulse`}></div>
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black/80 border border-white/10 px-3 py-1 rounded-full text-[8px] font-black text-white uppercase whitespace-nowrap">
                        {branch.level}
                      </div>
                    </div>
                  );
                })}

                {/* Root System */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
                  <div className="w-1 h-12 bg-emerald-900/40 rounded-full rotate-12"></div>
                  <div className="w-1 h-16 bg-emerald-900/40 rounded-full -rotate-6"></div>
                  <div className="w-1 h-10 bg-emerald-900/40 rounded-full rotate-45"></div>
                </div>
              </div>

              {/* Growth HUD */}
              <div className="absolute bottom-0 right-0 glass-card p-8 rounded-3xl border border-white/5 bg-black/60 space-y-4 shadow-2xl">
                <div className="flex justify-between items-center gap-10">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Evolution</p>
                  <p className="text-xl font-mono font-black text-emerald-400">{knowledgeProgress}%</p>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${knowledgeProgress}%` }}></div>
                </div>
                <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">342 / 800 Modules Mastered</p>
              </div>
            </div>

            <div className="absolute bottom-12 left-12 flex gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-[8px] text-slate-500 uppercase font-black">Current Rank</p>
                  <p className="text-xs font-bold text-white uppercase italic">Senior Steward</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <RefreshCw size={20} />
                </div>
                <div>
                  <p className="text-[8px] text-slate-500 uppercase font-black">Next Milestone</p>
                  <p className="text-xs font-bold text-white uppercase italic">Industrial Pro</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Join the Agro Junior E-Learning Portal</h3>
              <p className="text-emerald-100/80 max-w-2xl mx-auto">
                Register as a learner to access structured SEHTI-framed agricultural programs from Primary to Pro levels. Earn qualifications recognized by the Industrial Mesh.
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
                      <div className="space-y-1">
                        <span className="text-xs font-mono text-indigo-400 font-bold tracking-[0.2em]">{activeLesson.sku}</span>
                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{activeLesson.title}</h3>
                        <p className="text-emerald-400 font-mono text-sm">Unit: {activeLesson.unit} | Pillar: {activeLesson.pillar}</p>
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

                  {activeLesson.relatedResources && (
                    <div className="glass-card p-6 rounded-3xl border border-white/10 bg-black/40">
                      <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                        <FileText size={16} className="text-blue-400" /> Related Resources
                      </h4>
                      <div className="space-y-2">
                        {activeLesson.relatedResources.map((res: any, idx: number) => (
                          <a 
                            key={idx}
                            href={res.url}
                            className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-between"
                          >
                            <span className="truncate">{res.title}</span> <ExternalLink size={14} className="flex-shrink-0 ml-2" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
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
                <>
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
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono text-indigo-400 font-bold tracking-widest">{module.sku}</span>
                                <h4 className={`text-lg font-bold transition-colors ${isCompleted ? 'text-emerald-400' : 'text-white group-hover:text-emerald-400'}`}>{module.title}</h4>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{module.unit} • {module.pillar}</p>
                              </div>
                              <div className={`p-2 rounded-lg ${isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-black/40 text-slate-400'}`}>
                                {isCompleted ? <CheckCircle2 size={16} /> : <Calendar size={16} />}
                              </div>
                            </div>
                            <p className="text-sm text-slate-400 mb-6 line-clamp-2">{module.notes.replace(/###.*|Module SKU:.*|\*\*Focus:\*\*.*/g, '').trim()}</p>
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
                </>
              )}
            </div>
          )}
        </div>
      )}
      {activeTab === 'tutor' && (
        <div className="space-y-8 animate-in fade-in">
          <div className="glass-card p-8 rounded-[40px] border border-indigo-500/20 bg-indigo-900/10 min-h-[600px] flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center">
                <Mic size={24} className="text-indigo-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white uppercase italic">AI SEHTI Tutor</h3>
                <p className="text-indigo-200/60 text-sm">Expert guidance across 3,200 SEHTI shards.</p>
              </div>
            </div>
            
            <div className="flex-1 bg-black/40 rounded-3xl p-6 border border-white/5 mb-6 overflow-y-auto space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-black text-white">AI</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/10 max-w-[80%]">
                  <p className="text-sm text-slate-200">
                    Greetings, Steward. I am your SEHTI AI Tutor. I have deep knowledge of all 3,200 agricultural shards across the Primary, Junior, Senior, and Pro stages. 
                    How can I assist your agricultural journey today?
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <input 
                type="text"
                placeholder="Ask about a specific shard, unit, or SEHTI concept..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all pr-16"
              />
              <button className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'teacher' && (
        <div className="space-y-8 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-3xl border border-rose-500/20 bg-rose-900/10">
              <h4 className="text-rose-400 font-black uppercase text-xs tracking-widest mb-1">Total Students</h4>
              <p className="text-3xl font-black text-white">1,284</p>
            </div>
            <div className="glass-card p-6 rounded-3xl border border-emerald-500/20 bg-emerald-900/10">
              <h4 className="text-emerald-400 font-black uppercase text-xs tracking-widest mb-1">Avg. Completion</h4>
              <p className="text-3xl font-black text-white">68%</p>
            </div>
            <div className="glass-card p-6 rounded-3xl border border-indigo-500/20 bg-indigo-900/10">
              <h4 className="text-indigo-400 font-black uppercase text-xs tracking-widest mb-1">SEHTI Resonance</h4>
              <p className="text-3xl font-black text-white">0.92</p>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[40px] border border-white/10 bg-black/40">
            <h3 className="text-2xl font-black text-white uppercase italic mb-6">School Collective Management</h3>
            <div className="space-y-4">
              {[
                { name: "Green Valley High", level: "Junior", students: 42, progress: 85 },
                { name: "Rural Tech Academy", level: "Senior", students: 120, progress: 42 },
                { name: "Eco-Primary Collective", level: "Primary", students: 85, progress: 91 }
              ].map((school, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold">{school.name}</h4>
                    <p className="text-xs text-slate-400">Level: {school.level} • {school.students} Students</p>
                  </div>
                  <div className="text-right">
                    <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden mb-1">
                      <div className="h-full bg-emerald-500" style={{ width: `${school.progress}%` }} />
                    </div>
                    <p className="text-[10px] font-mono text-emerald-400">{school.progress}% Certified</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'industrial' && (
        <div className="space-y-8 animate-in fade-in">
          <div className="glass-card p-12 rounded-[48px] border border-amber-500/20 bg-amber-900/10 text-center space-y-8">
            <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award size={48} className="text-amber-400" />
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Industrial Professional Qualification</h3>
              <p className="text-amber-100/80 max-w-2xl mx-auto text-lg">
                The Industrial Professional Qualification (IPQ) is the gold standard for workers in the EnvirosAgro ecosystem. 
                Earn your IPQ by completing a live mission broadcast to the Industrial Mesh.
              </p>
            </div>
            
            {user?.achievements?.includes("Industrial Professional Qualification") || missionCompleted ? (
              <div className="p-10 bg-emerald-900/20 border border-emerald-500/30 rounded-[40px] max-w-xl mx-auto space-y-6">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={40} className="text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-black text-white uppercase italic">Qualification Verified</h4>
                  <p className="text-emerald-200/80">You are officially recognized as an Industrial Professional.</p>
                </div>
                <div className="pt-4">
                  <button 
                    onClick={() => onNavigate('community')}
                    className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl"
                  >
                    Enter Worker Cloud
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {[
                    { step: 1, label: "Mesh Sync", icon: RefreshCw, active: missionStep >= 1 },
                    { step: 2, label: "Live Broadcast", icon: Radio, active: missionStep >= 2 },
                    { step: 3, label: "IPQ Verification", icon: ShieldCheck, active: missionStep >= 3 }
                  ].map((s) => (
                    <div key={s.step} className={`p-6 rounded-3xl border-2 transition-all ${s.active ? 'bg-amber-500/10 border-amber-500 text-white' : 'bg-black/40 border-white/5 text-slate-600'}`}>
                      <s.icon size={24} className={`mx-auto mb-3 ${s.active ? 'text-amber-400' : 'text-slate-800'}`} />
                      <p className="text-[10px] font-black uppercase tracking-widest">{s.label}</p>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleAirMission}
                  disabled={isAiringMission}
                  className={`px-12 py-6 rounded-full font-black uppercase tracking-[0.3em] transition-all shadow-2xl flex items-center justify-center gap-4 mx-auto border-4 border-white/10 ${isAiringMission ? 'bg-amber-600/50 text-white cursor-wait' : 'bg-amber-600 hover:bg-amber-500 text-white hover:scale-105 active:scale-95'}`}
                >
                  {isAiringMission ? (
                    <><Loader2 className="animate-spin w-6 h-6" /> Processing IPQ...</>
                  ) : (
                    <><Video size={24} /> Commence Live Mission</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationalResources;
