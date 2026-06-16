import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, BookOpen, Plus, Trash, CheckCircle2, 
  Send, Share2, FileText, Sparkles, Check, Loader2, 
  Calendar, Award, AlertCircle, RefreshCw, LogIn, LogOut,
  ChevronRight, ArrowRight, MessageSquare, PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

// Import Google Classroom API integration services
import { 
  listClassroomCourses, 
  listCourseWork, 
  listAnnouncements, 
  listCourseWorkMaterials,
  publishAnnouncement, 
  publishCourseMaterial, 
  createClassroomAssignment,
  ClassroomCourse,
  ClassroomCourseWork,
  ClassroomAnnouncement,
  ClassroomMaterial
} from '../services/googleClassroomService';

import { 
  initDriveAuth, 
  googleDriveSignIn, 
  googleDriveSignOut 
} from '../services/googleDriveService';

// Import Gemini-based educational tools
import { 
  generateAgroExam, 
  generateAgroDocument 
} from '../services/domain/agroLangService';

interface GoogleClassroomViewProps {
  user?: any;
  onNavigate?: any;
}

// Predefined platform materials that can be pushed to Google Classroom
const PREDEFINED_RESOURCES = [
  { 
    id: 'res-agro-101', 
    title: 'Regenerative Agriculture 101', 
    description: 'A comprehensive study of organic soil restoration, biodiversity orchestration, and multi-trophic cropping.',
    url: 'https://envirosagro.com/learn/regenerative-ag-101',
    category: 'sustainable_ag'
  },
  { 
    id: 'res-blockchain-102', 
    title: 'Blockchain Traceability for Supply Chains', 
    description: 'Cryptographic supply chains, dynamic ledger anchors, and immutable food safety tracking methods.',
    url: 'https://envirosagro.com/learn/blockchain-traceability',
    category: 'blockchain'
  },
  { 
    id: 'res-eac-103', 
    title: 'Environmental Asset Carbon Offsets (EAC)', 
    description: 'Detailed analysis of high-throughput MRV minting protocols, carbon sequestration, and bio-NFT validation.',
    url: 'https://envirosagro.com/learn/eac-protocols',
    category: 'platform_usage'
  }
];

export const GoogleClassroomView: React.FC<GoogleClassroomViewProps> = ({ user: platformUser, onNavigate }) => {
  // Authentication & Session States
  const [needsAuth, setNeedsAuth] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [isLikingSession, setIsLikingSession] = useState(false);

  // Classroom API States
  const [courses, setCourses] = useState<ClassroomCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<ClassroomCourse | null>(null);
  const [courseWork, setCourseWork] = useState<ClassroomCourseWork[]>([]);
  const [announcements, setAnnouncements] = useState<ClassroomAnnouncement[]>([]);
  const [materials, setMaterials] = useState<ClassroomMaterial[]>([]);
  
  // Loading & View States
  const [isLoading, setIsLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'stream' | 'classwork' | 'push_resources' | 'ai_lesson'>('stream');
  
  // Forms & Inputs
  const [announcementText, setAnnouncementText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDesc, setAssignmentDesc] = useState('');
  const [assignmentPoints, setAssignmentPoints] = useState(100);

  // AI-Assisted Lesson States
  const [aiPrompt, setAiPrompt] = useState('Polyculture companion planting with Bantu ancestral seeds');
  const [aiType, setAiType] = useState<'lesson' | 'quiz'>('lesson');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiGeneratedContent, setAiGeneratedContent] = useState<any>(null);

  // Confirmation Modal / Prompts required for writing workspace data
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);

  // Synchronize Google Auth listener
  useEffect(() => {
    const unsubscribe = initDriveAuth(
      (currentUser, token) => {
        setGoogleUser(currentUser);
        setAccessToken(token);
        setNeedsAuth(false);
      },
      () => {
        setGoogleUser(null);
        setAccessToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch Courses once Auth completes
  useEffect(() => {
    if (!needsAuth && accessToken) {
      loadCourses();
    }
  }, [needsAuth, accessToken]);

  // Load Courses of selected Google User
  const loadCourses = async () => {
    setIsLoading(true);
    try {
      const activeCourses = await listClassroomCourses();
      setCourses(activeCourses);
      if (activeCourses.length > 0 && !selectedCourse) {
        setSelectedCourse(activeCourses[0]);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to retrieve active courses');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch details when Course selection shifts
  useEffect(() => {
    if (selectedCourse) {
      loadCourseDetails(selectedCourse.id);
    }
  }, [selectedCourse]);

  const loadCourseDetails = async (courseId: string) => {
    setIsLoading(true);
    try {
      const [workItems, listNotes, docs] = await Promise.all([
        listCourseWork(courseId).catch(() => []),
        listAnnouncements(courseId).catch(() => []),
        listCourseWorkMaterials(courseId).catch(() => [])
      ]);
      setCourseWork(workItems);
      setAnnouncements(listNotes);
      setMaterials(docs);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load course feed');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign In Flow
  const handleSignIn = async () => {
    setIsLikingSession(true);
    try {
      const res = await googleDriveSignIn();
      if (res) {
        setGoogleUser(res.user);
        setAccessToken(res.accessToken);
        setNeedsAuth(false);
        toast.success(`Welcome to Google Classroom integration! Session active.`);
      }
    } catch (err: any) {
      toast.error(err.message || 'OAuth pairing failed.');
    } finally {
      setIsLikingSession(false);
    }
  };

  // Sign Out Flow
  const handleSignOut = async () => {
    try {
      await googleDriveSignOut();
      setGoogleUser(null);
      setAccessToken(null);
      setNeedsAuth(true);
      setCourses([]);
      setSelectedCourse(null);
      toast.success('Google Classroom session ended successfully.');
    } catch (err: any) {
      toast.error('Sign-out failed');
    }
  };

  // Secure user confirmation prompt for writing Workspace items
  const openConfirmDialog = (title: string, description: string, action: () => void) => {
    setConfirmConfig({
      title,
      description,
      onConfirm: () => {
        action();
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  };

  // Publish Stream Announcement
  const handlePostAnnouncement = async () => {
    if (!selectedCourse || !announcementText.trim()) return;

    openConfirmDialog(
      'Publish Stream Announcement',
      `This will publish a stream announcement to the class: "${selectedCourse.name}". Instructors and students will receive updates immediately.`,
      async () => {
        setIsPosting(true);
        try {
          await publishAnnouncement(selectedCourse.id, announcementText);
          setAnnouncementText('');
          toast.success('Successfully published announcement to Google stream!');
          loadCourseDetails(selectedCourse.id);
        } catch (err: any) {
          toast.error(err.message || 'Failed to share announcement');
        } finally {
          setIsPosting(false);
        }
      }
    );
  };

  // Publish Predefined Educational Resource to Google Classroom as Material
  const handlePushResource = async (resource: typeof PREDEFINED_RESOURCES[0]) => {
    if (!selectedCourse) {
      toast.error('Choose a learning course first.');
      return;
    }

    openConfirmDialog(
      'Push Material Resource',
      `Are you sure you want to push "${resource.title}" as a Coursework Material to "${selectedCourse.name}"? This adds custom academic links for the students.`,
      async () => {
        setIsLoading(true);
        try {
          await publishCourseMaterial(
            selectedCourse.id,
            resource.title,
            resource.description,
            resource.url
          );
          toast.success(`Published resource "${resource.title}" onto your Classroom!`);
          loadCourseDetails(selectedCourse.id);
        } catch (err: any) {
          toast.error(err.message || 'Publishing failed.');
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  // AI-Assisted Generation & Assignment
  const handleGenerateAILesson = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Enter an agro educational concept topic first.');
      return;
    }

    setIsGeneratingAI(true);
    setAiGeneratedContent(null);
    try {
      if (aiType === 'quiz') {
        const examData = await generateAgroExam(aiPrompt);
        setAiGeneratedContent({
          type: 'quiz',
          topic: aiPrompt,
          questions: examData
        });
        toast.success('AI Agri-Quiz generated successfully! Review below.');
      } else {
        const docResult = await generateAgroDocument('Agro-Curriculum Lesson', aiPrompt);
        setAiGeneratedContent({
          type: 'lesson',
          topic: aiPrompt,
          content: docResult.text
        });
        toast.success('AI Agro-Curriculum Lesson plan generated! Review below.');
      }
    } catch (err: any) {
      toast.error('Gemini failed to forge curriculum: ' + (err.message || ''));
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Push AI Lesson Plan to Google Course
  const handlePushAILesson = async () => {
    if (!selectedCourse || !aiGeneratedContent) return;

    const summaryTitle = `AI Lesson: ${aiGeneratedContent.topic}`;
    const descContents = aiGeneratedContent.type === 'lesson' 
      ? aiGeneratedContent.content 
      : `Complete the review quiz regarding: ${aiGeneratedContent.topic}.\n\nQuestions:\n` + 
        aiGeneratedContent.questions.map((q: any, i: number) => `${i+1}. ${q.question}\nOptions: ${q.options.join(', ')}`).join('\n\n');

    openConfirmDialog(
      'Push AI Lesson/Quiz',
      `Create this AI-generated ${aiGeneratedContent.type} directly as a Coursework Assignment/Material on Classroom?`,
      async () => {
        setIsLoading(true);
        try {
          if (aiGeneratedContent.type === 'quiz') {
            await createClassroomAssignment(
              selectedCourse.id, 
              summaryTitle, 
              descContents, 
              100
            );
            toast.success('AI Quiz has been appended as an Assignment!');
          } else {
            await publishCourseMaterial(
              selectedCourse.id,
              summaryTitle,
              descContents,
              'https://envirosagro.com/learn/ai-orchestrated'
            );
            toast.success('AI Lesson summary published as Course Material!');
          }
          setAiGeneratedContent(null);
          loadCourseDetails(selectedCourse.id);
        } catch (err: any) {
          toast.error('Failed to upload lesson: ' + (err.message || ''));
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  // Create standard Custom Assignment
  const handleCreateAssignment = async () => {
    if (!selectedCourse || !assignmentTitle.trim()) return;

    openConfirmDialog(
      'Create New Course Assignment',
      `Publish the assignment: "${assignmentTitle}" on "${selectedCourse.name}"? This initiates student alerts and grade metrics.`,
      async () => {
        setIsLoading(true);
        try {
          await createClassroomAssignment(
            selectedCourse.id,
            assignmentTitle,
            assignmentDesc,
            assignmentPoints
          );
          setAssignmentTitle('');
          setAssignmentDesc('');
          setAssignmentPoints(100);
          toast.success('New Assignment added successfully to Classroom!');
          loadCourseDetails(selectedCourse.id);
        } catch (err: any) {
          toast.error(err.message || 'Failed to record assignment');
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  // Auth Card Renderer
  if (needsAuth) {
    return (
      <div className="glass-card p-12 rounded-[48px] border border-white/5 bg-black/60 relative overflow-hidden min-h-[450px] flex flex-col items-center justify-center text-center shadow-3xl">
        <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
          <GraduationCap size={300} className="text-white" />
        </div>

        <div className="max-w-md space-y-8 relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto shadow-2xl">
            <GraduationCap size={42} className="text-indigo-400" />
          </div>

          <div className="space-y-3">
            <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">Activate Google Classroom</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Sync EnvirosAgro's advanced learning and sustainable agriculture materials directly to Google Classroom. Perfect for teachers, supervisors, and student clusters.
            </p>
          </div>

          <button 
            onClick={handleSignIn}
            disabled={isLikingSession}
            id="btn-classroom-signin"
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/40 rounded-2xl text-white font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 border border-indigo-500/20"
          >
            {isLikingSession ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Connecting Auth Grid...
              </>
            ) : (
              <>
                <LogIn size={16} />
                Connect Google Account
              </>
            )}
          </button>
          
          <div className="flex items-center justify-center gap-2 text-[9px] text-slate-500 font-mono uppercase tracking-widest">
            <CheckCircle2 size={10} className="text-emerald-500" /> OAuth Scope Authorized By Platform settings
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HUD Bar */}
      <div className="glass-card p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <GraduationCap size={24} className="text-emerald-400" />
          </div>
          <div className="text-left">
            <p className="text-[9px] text-slate-500 font-black uppercase">Authorized Google Instructor</p>
            <p className="text-sm font-black text-white">{googleUser?.email || 'classroom_liaison@gmail.com'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          <button 
            onClick={loadCourses}
            title="Refresh Courses"
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white border border-white/5 transition-all active:scale-95"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </button>

          <button 
            onClick={handleSignOut}
            id="btn-classroom-signout"
            className="px-6 py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl text-rose-400 font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 active:scale-95"
          >
            <LogOut size={12} /> Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Course Directory Rail */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Your Classroom Courses</h4>
            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-md text-[9px] font-mono font-black">{courses.length} ACTIVE</span>
          </div>

          <div className="space-y-2 pointer overflow-y-auto max-h-[500px]" id="course-list-panel">
            {courses.length === 0 ? (
              <div className="glass-card p-8 rounded-2xl text-center border border-white/5 bg-white/5">
                <AlertCircle size={20} className="text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-black text-slate-400 uppercase">No active courses found</p>
                <p className="text-[10px] text-slate-500 mt-1">Enroll or create a Course inside Google Classroom first.</p>
              </div>
            ) : (
              courses.map(course => (
                <div 
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className={`p-4 rounded-2xl border transition-all duration-300 text-left cursor-pointer group relative ${
                    selectedCourse?.id === course.id 
                      ? 'bg-indigo-500/10 border-indigo-500/40 shadow-lg' 
                      : 'bg-white/5 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="relative z-10 flex items-center justify-between gap-3">
                    <div className="truncate">
                      <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">{course.name}</p>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5 truncate">{course.section || 'General'}</p>
                    </div>
                    <ChevronRight size={14} className={`text-slate-500 group-hover:text-white transition-all ${selectedCourse?.id === course.id ? 'translate-x-1' : ''}`} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Course Workspace Area */}
        <div className="lg:col-span-8 flex flex-col">
          {selectedCourse ? (
            <div className="flex-1 space-y-6">
              {/* Course Header Hero Banner */}
              <div className="glass-card p-8 rounded-[36px] bg-gradient-to-br from-indigo-500/10 via-black/40 to-black/60 border border-indigo-500/10 relative overflow-hidden text-left shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-400 pointer-events-none">
                  <GraduationCap size={150} />
                </div>

                <div className="relative z-10 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-mono font-bold uppercase rounded border border-emerald-500/20">Active Class</span>
                    {selectedCourse.alternateLink && (
                      <a 
                        href={selectedCourse.alternateLink} 
                        target="_blank" 
                        rel="referrer" 
                        className="text-[9px] text-indigo-400 font-mono hover:underline flex items-center gap-1"
                      >
                        Google Link <Share2 size={10} />
                      </a>
                    )}
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-widest">{selectedCourse.name}</h3>
                  <p className="text-[10px] text-slate-400 max-w-xl leading-relaxed italic">{selectedCourse.descriptionHeading || 'No synopsis specified.'}</p>
                </div>
              </div>

              {/* Sub-tabs inside Course Details */}
              <div className="flex flex-wrap gap-2 border-b border-white/5 pb-3">
                {[
                  { id: 'stream', label: 'Stream Stream', icon: MessageSquare },
                  { id: 'classwork', label: 'Class Tasks', icon: FileText },
                  { id: 'push_resources', label: 'Curated Assets', icon: Share2 },
                  { id: 'ai_lesson', label: 'Gemini AI Labs', icon: Sparkles }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSubTab(tab.id as any)}
                    className={`px-4 py-2 rounded-xl border font-mono text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                      activeSubTab === tab.id
                        ? 'bg-white/10 text-white border-white/20'
                        : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <tab.icon size={12} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Displaying loading indicator inside current tab */}
              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
                  <Loader2 size={36} className="text-indigo-400 animate-spin" />
                  <p className="text-xs text-slate-500 font-mono uppercase tracking-[0.2em]">Synchronous classroom exchange in progress...</p>
                </div>
              ) : (
                <div className="transition-all duration-300">
                  {/* STREAM / ANNOUNCEMENTS TAB */}
                  {activeSubTab === 'stream' && (
                    <div className="space-y-6 text-left">
                      {/* Post Stream update */}
                      <div className="glass-card p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                        <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">Share Something with your Class</h4>
                        <div className="relative">
                          <textarea
                            value={announcementText}
                            onChange={(e) => setAnnouncementText(e.target.value)}
                            placeholder="Announce study updates, companion guides, active MRV field trials..."
                            className="w-full h-24 bg-black/40 border border-white/5 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/30 transition-all font-mono resize-none"
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={handlePostAnnouncement}
                            disabled={isPosting || !announcementText.trim()}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/40 rounded-xl text-white font-mono font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 active:scale-95"
                          >
                            {isPosting ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                            Post Announcement
                          </button>
                        </div>
                      </div>

                      {/* Display announcements and stream timeline */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Stream Ledger Feed</h4>
                        {announcements.length === 0 ? (
                          <div className="p-10 text-center glass-card border border-white/5 bg-white/5 rounded-3xl">
                            <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Feed empty</p>
                          </div>
                        ) : (
                          announcements.map(ann => (
                            <div key={ann.id} className="p-5 bg-white/5 rounded-2xl border border-white/5 text-left space-y-3">
                              <p className="text-xs text-white leading-relaxed font-mono whitespace-pre-wrap">{ann.text}</p>
                              <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                                <span className="uppercase text-emerald-400 font-black">● Live Announcement</span>
                                <span>{ann.creationTime ? new Date(ann.creationTime).toLocaleString() : ''}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* CLASSWORK / TASKS TAB */}
                  {activeSubTab === 'classwork' && (
                    <div className="space-y-6 text-left">
                      {/* Create custom Assignment Form */}
                      <div className="glass-card p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                        <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">Initialize New Graded Assignment</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-400 uppercase font-mono">Assignment Title</label>
                            <input
                              type="text"
                              value={assignmentTitle}
                              onChange={(e) => setAssignmentTitle(e.target.value)}
                              placeholder="e.g., Soil Sample pH Audit Protocol"
                              className="w-full bg-black/45 border border-white/5 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/30 font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-400 uppercase font-mono">Max Points</label>
                            <input
                              type="number"
                              value={assignmentPoints}
                              onChange={(e) => setAssignmentPoints(Number(e.target.value))}
                              placeholder="100"
                              className="w-full bg-black/45 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500/30 font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 uppercase font-mono">Instructions Summary</label>
                          <textarea
                            value={assignmentDesc}
                            onChange={(e) => setAssignmentDesc(e.target.value)}
                            placeholder="Provide guidelines, grading rubrics, and deadlines..."
                            className="w-full h-20 bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/30 transition-all font-mono resize-none"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={handleCreateAssignment}
                            disabled={!assignmentTitle.trim()}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/40 rounded-xl text-white font-mono font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 active:scale-95"
                          >
                            <PlusCircle size={12} />
                            Publish Assignment
                          </button>
                        </div>
                      </div>

                      {/* Display CourseWork Items */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Active assignments</h4>
                        {courseWork.length === 0 ? (
                          <div className="p-10 text-center glass-card border border-white/5 bg-white/5 rounded-3xl">
                            <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">No tasks assigned yet</p>
                          </div>
                        ) : (
                          courseWork.map(work => (
                            <div key={work.id} className="p-5 bg-white/5 rounded-2xl border border-white/5 text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <FileText size={14} className="text-indigo-400" />
                                  <p className="text-xs font-black text-white">{work.title}</p>
                                </div>
                                <p className="text-[11px] text-slate-400 font-mono line-clamp-2">{work.description || 'No instruction body.'}</p>
                              </div>

                              <div className="flex items-center gap-3 self-end md:self-auto font-mono text-[9px]">
                                {work.maxPoints && (
                                  <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-bold uppercase">{work.maxPoints} pts</span>
                                )}
                                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold uppercase">{work.workType === 'ASSIGNMENT' ? 'Assignment' : work.workType}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* CURATED ASSETS PUSH TAB */}
                  {activeSubTab === 'push_resources' && (
                    <div className="space-y-6 text-left">
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-white uppercase italic tracking-wider">Share EnvirosAgro Core Resources</h4>
                        <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Teachers or course monitors can directly materialize any of EnvirosAgro's curated knowledge guides into active Google Classrooms.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {PREDEFINED_RESOURCES.map(res => (
                          <div key={res.id} className="glass-card p-5 bg-white/5 border border-white/5 rounded-2xl flex flex-col justify-between hover:border-indigo-500/20 transition-all text-left">
                            <div className="space-y-2">
                              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded text-[8px] font-mono font-bold uppercase">{res.category.replace('_', ' ')}</span>
                              <h5 className="text-xs font-black text-white leading-snug">{res.title}</h5>
                              <p className="text-[10px] text-slate-400 font-mono">{res.description}</p>
                            </div>

                            <button
                              onClick={() => handlePushResource(res)}
                              className="mt-4 w-full py-2.5 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 rounded-xl text-white font-mono text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                            >
                              <Share2 size={10} /> Push to Classroom
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI LAB / GEMINI GENERATOR TAB */}
                  {activeSubTab === 'ai_lesson' && (
                    <div className="space-y-6 text-left">
                      <div className="glass-card p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                            <Sparkles size={16} className="text-indigo-400" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-white uppercase italic tracking-wider">Gemini™ Educational Lab for Teachers</h4>
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Use Gemini to automatically forge complete lesson plans and review quizzes.</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-400 uppercase font-mono">Instruction Concept Topic</label>
                            <input
                              type="text"
                              value={aiPrompt}
                              onChange={(e) => setAiPrompt(e.target.value)}
                              placeholder="e.g. regenerative forestry..."
                              className="w-full bg-black/45 border border-white/5 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/30 font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-400 uppercase font-mono">Material Output Type</label>
                            <div className="grid grid-cols-2 gap-2 h-11">
                              <button
                                onClick={() => setAiType('lesson')}
                                className={`px-4 rounded-xl border font-mono text-[9px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                                  aiType === 'lesson' 
                                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' 
                                    : 'bg-black/40 text-slate-400 border-white/5 hover:bg-white/5'
                                }`}
                              >
                                <FileText size={12} /> Curriculum Lesson
                              </button>
                              <button
                                onClick={() => setAiType('quiz')}
                                className={`px-4 rounded-xl border font-mono text-[9px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                                  aiType === 'quiz' 
                                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' 
                                    : 'bg-black/40 text-slate-400 border-white/5 hover:bg-white/5'
                                }`}
                              >
                                <Award size={12} /> Graded Review Quiz
                              </button>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleGenerateAILesson}
                          disabled={isGeneratingAI}
                          className="w-full mt-2 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:from-indigo-600/40 disabled:to-indigo-600/40 rounded-xl text-white font-mono text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-indigo-500/10 transition-all flex items-center justify-center gap-2 active:scale-95 border border-indigo-500/20"
                        >
                          {isGeneratingAI ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              Forging Custom Academic Material with Gemini...
                            </>
                          ) : (
                            <>
                              <Sparkles size={12} />
                              Generate Educational material
                            </>
                          )}
                        </button>
                      </div>

                      {/* Display Generated Content Review & Publish Option */}
                      {aiGeneratedContent && (
                        <div className="glass-card p-6 rounded-3xl bg-white/5 border border-emerald-500/20 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-mono uppercase font-black tracking-widest rounded flex items-center gap-1">
                              <CheckCircle2 size={10} /> AI Masterpiece Created Successfully
                            </span>
                            
                            <button
                              onClick={handlePushAILesson}
                              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-mono text-[9px] uppercase tracking-widest transition-all flex items-center gap-2 active:scale-95"
                            >
                              <Share2 size={10} /> Push direct to classroom Course
                            </button>
                          </div>

                          <div className="border border-white/5 bg-black/40 rounded-2xl p-5 overflow-y-auto max-h-[300px] font-mono text-left space-y-4">
                            <h5 className="font-black text-white text-xs uppercase underline tracking-wider">Concept: {aiGeneratedContent.topic}</h5>
                            
                            {aiGeneratedContent.type === 'lesson' ? (
                              <p className="text-[10px] text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">{aiGeneratedContent.content}</p>
                            ) : (
                              <div className="space-y-4">
                                {aiGeneratedContent.questions.map((q: any, i: number) => (
                                  <div key={i} className="space-y-2 text-[10px] text-slate-300 font-mono border-b border-white/5 pb-2">
                                    <p className="font-bold text-white max-w-xl leading-relaxed">{i + 1}. {q.question}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md my-1">
                                      {q.options.map((option: string, opIndex: number) => (
                                        <div 
                                          key={opIndex} 
                                          className={`p-2 rounded-lg border text-[9px] ${
                                            opIndex === q.correct 
                                              ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400' 
                                              : 'border-white/5 bg-white/5 text-slate-400'
                                          }`}
                                        >
                                          {option} {opIndex === q.correct ? '✔' : ''}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-20 rounded-[48px] border border-white/5 bg-black/60 relative overflow-hidden flex flex-col items-center justify-center text-center shadow-3xl flex-1">
              <GraduationCap size={44} className="text-slate-500 mb-4 animate-pulse" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Select an active course on the left panel</p>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-mono">To sync e-learning modules and manage assignments</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Secure Modal */}
      {showConfirmModal && confirmConfig && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-card p-8 rounded-[40px] border border-white/10 bg-black/90 max-w-md w-full text-center space-y-6 shadow-3xl">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
              <AlertCircle size={24} />
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-black text-white uppercase tracking-wider italic">{confirmConfig.title}</h4>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">{confirmConfig.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmConfig(null);
                }}
                className="py-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 font-mono text-[10px] uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmConfig.onConfirm}
                className="py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-mono text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-indigo-500/20"
              >
                Confirm Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
