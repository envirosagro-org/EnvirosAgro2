import React, { useState, useEffect, useRef } from 'react';
import { 
  Cloud, Folder, FileText, Search, Loader2, Trash2, Plus, 
  ArrowLeft, Upload, ExternalLink, Download, LayoutGrid, List,
  Clock, HardDrive, Info, CheckCircle, File, Eye, ChevronRight, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { User } from '../types';
import { 
  googleDriveSignIn, 
  googleDriveSignOut, 
  getDriveAccessToken, 
  listDriveFiles, 
  createDriveFolder, 
  trashDriveFile, 
  uploadFileToDrive, 
  DriveFile,
  initDriveAuth
} from '../services/googleDriveService';

interface GoogleDriveViewProps {
  user: User;
}

interface Breadcrumb {
  id: string;
  name: string;
}

export const GoogleDriveView: React.FC<GoogleDriveViewProps> = ({ user }) => {
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  
  // Files explorer state
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([{ id: 'root', name: 'My Drive' }]);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Folder Creation state
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creatingFolder, setCreatingFolder] = useState(false);

  // File Upload state
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Delete state
  const [fileToDelete, setFileToDelete] = useState<DriveFile | null>(null);
  const [deletingFile, setDeletingFile] = useState(false);

  // Check auth on load
  useEffect(() => {
    const checkToken = async () => {
      const activeToken = await getDriveAccessToken();
      if (activeToken) {
        setToken(activeToken);
        setNeedsAuth(false);
        fetchFiles('root');
      } else {
        // Setup listener
        const unsubscribe = initDriveAuth(
          (userResult, tokenResult) => {
            setToken(tokenResult);
            setNeedsAuth(false);
            fetchFiles('root');
          },
          () => {
            setToken(null);
            setNeedsAuth(true);
          }
        );
        return () => unsubscribe();
      }
    };
    checkToken();
  }, []);

  // Fetch files inside active folder
  const fetchFiles = async (folderId: string, search: string = '') => {
    setLoading(true);
    setSelectedFile(null);
    try {
      const fetched = await listDriveFiles(folderId, search);
      setFiles(fetched);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to retrieve files from Google Drive.');
      if (err.message?.includes('expired') || err.message?.includes('authorization')) {
        setToken(null);
        setNeedsAuth(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Trigger search on query change
  useEffect(() => {
    if (!needsAuth && token) {
      const delayDebounceFn = setTimeout(() => {
        fetchFiles(currentFolderId, searchQuery);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery, currentFolderId, needsAuth, token]);

  const handleLogin = async () => {
    setIsSigningIn(true);
    try {
      const result = await googleDriveSignIn();
      if (result) {
        setToken(result.accessToken);
        setNeedsAuth(false);
        toast.success(`Google Drive connected successfully for ${result.user.displayName || user.name}!`);
        fetchFiles('root');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to login with Google Drive scope.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await googleDriveSignOut();
      setToken(null);
      setNeedsAuth(true);
      setFiles([]);
      setSelectedFile(null);
      setBreadcrumbs([{ id: 'root', name: 'My Drive' }]);
      setCurrentFolderId('root');
      toast.success('Successfully signed out from Google Drive session.');
    } catch (err: any) {
      console.error(err);
    }
  };

  // Navigating inside folders
  const handleFolderClick = (folder: DriveFile) => {
    const nextBreadcrumb = [...breadcrumbs, { id: folder.id, name: folder.name }];
    setBreadcrumbs(nextBreadcrumb);
    setCurrentFolderId(folder.id);
  };

  // Navigate back to a breadcrumb index
  const handleBreadcrumbClick = (index: number) => {
    const target = breadcrumbs[index];
    const nextBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(nextBreadcrumbs);
    setCurrentFolderId(target.id);
  };

  // Create Folder
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    setCreatingFolder(true);
    try {
      await createDriveFolder(newFolderName, currentFolderId);
      toast.success(`Folder "${newFolderName}" created successfully!`);
      setNewFolderName('');
      setShowNewFolderModal(false);
      fetchFiles(currentFolderId, searchQuery);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create new folder.');
    } finally {
      setCreatingFolder(false);
    }
  };

  // Trash Operations (requires confirmation)
  const confirmTrashFile = (file: DriveFile) => {
    // Stage file for deletion modal
    setFileToDelete(file);
  };

  const handleTrashFile = async () => {
    if (!fileToDelete) return;
    setDeletingFile(true);
    try {
      await trashDriveFile(fileToDelete.id);
      toast.success(`Successfully trashed "${fileToDelete.name}".`);
      setFileToDelete(null);
      // Deselect if active is deleted
      if (selectedFile?.id === fileToDelete.id) {
        setSelectedFile(null);
      }
      fetchFiles(currentFolderId, searchQuery);
    } catch (err: any) {
      toast.error(err.message || 'Failed to trash selected file.');
    } finally {
      setDeletingFile(false);
    }
  };

  // File drag-and-drop interactions
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (rawFile: File) => {
    setUploading(true);
    setUploadProgress(10);
    try {
      // Simulate progress tick
      const prInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(prInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 150);

      const uploaded = await uploadFileToDrive(rawFile, currentFolderId);
      clearInterval(prInterval);
      setUploadProgress(100);
      toast.success(`File "${uploaded.name}" uploaded successfully!`);
      fetchFiles(currentFolderId, searchQuery);
    } catch (err: any) {
      toast.error(err.message || 'Failed to complete file upload.');
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 800);
    }
  };

  // Format file size utilities
  const formatBytes = (bytesStr?: string, decimals = 2) => {
    if (!bytesStr) return '—';
    const bytes = parseInt(bytesStr, 10);
    if (isNaN(bytes) || bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const isFolder = (file: DriveFile) => {
    return file.mimeType === 'application/vnd.google-apps.folder';
  };

  return (
    <div id="google-drive-shard-container" className="min-h-screen bg-[#050606] text-white p-4 md:p-10 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Header Section */}
        <div id="drive-header-layout" className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
                <Cloud size={24} className="animate-pulse" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500">DECENTRALIZED RESOURCE SHARD</p>
            </div>
            <h1 className="text-4xl font-extrabold italic tracking-tight text-white uppercase">Google Drive Portal</h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide max-w-xl">
              Connect to your customized Google Workspace drive container with secure tokens to interface reports, telemetry blueprints, and ledger assets.
            </p>
          </div>
          
          {!needsAuth && (
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-[9px] font-black text-slate-500 tracking-widest uppercase">ACTIVE SESSION</span>
                <span className="text-xs font-semibold text-emerald-400 italic">{user.email}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="px-6 py-3 bg-white/5 hover:bg-red-500/20 hover:text-red-300 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer active:scale-95"
              >
                Disconnect Shard
              </button>
            </div>
          )}
        </div>

        {/* Content Wrapper */}
        <AnimatePresence mode="wait">
          {needsAuth ? (
            /* AUTHENTICATION PROMPT */
            <motion.div 
              key="auth-banner"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col items-center justify-center p-12 md:p-24 glass-card border border-white/10 rounded-[48px] bg-black/40 text-center space-y-8 max-w-2xl mx-auto shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
              <div className="w-24 h-24 bg-gradient-to-b from-emerald-500/10 to-indigo-500/5 rounded-[40px] border border-white/10 flex items-center justify-center relative animate-float shadow-inner">
                <Cloud size={44} className="text-emerald-400" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-black animate-pulse"></div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-black uppercase tracking-tight italic">Authentication Required</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-semibold">
                  This secure node requires Google Drive scope connection. Review the authorization card below to integrate document ledgers and file vaults from your connected workspace account.
                </p>
              </div>

              {/* Login Button with specified Google Material branding style exactly */}
              <div className="flex flex-col items-center gap-6 w-full">
                <button 
                  onClick={handleLogin}
                  disabled={isSigningIn}
                  className="gsi-material-button w-full sm:w-auto px-10 py-5 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-45"
                >
                  {isSigningIn ? (
                    <>
                      <Loader2 className="animate-spin text-white w-4 h-4" />
                      <span>Configuring Keys...</span>
                    </>
                  ) : (
                    <>
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block', width: '20px', height: '20px' }}>
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      </svg>
                      <span>Connect Google Drive</span>
                    </>
                  )}
                </button>

                {/* Secure iframe and popup guidance */}
                <div className="w-full max-w-lg mt-6 p-6 border border-amber-500/20 bg-amber-500/5 rounded-3xl text-left space-y-4 shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-3 text-amber-400">
                    <Info size={16} />
                    <span className="text-[10px] font-mono font-black uppercase tracking-widest">Connection Guidance (Iframe Sandbox)</span>
                  </div>
                  <ul className="text-[11px] text-slate-400 space-y-2.5 font-medium leading-relaxed list-disc list-inside">
                    <li>
                      <strong className="text-amber-200">Allow Popups:</strong> If clicking does not trigger a Google OAuth login screen, verify that your browser isn't actively blocking popup windows for this URL in your address bar.
                    </li>
                    <li>
                      <strong className="text-amber-200">Cookies & Incognito:</strong> Ensure third-party cookies or "cross-website tracking" is permitted in your browser settings when running within live sandboxed environments.
                    </li>
                    <li>
                      <strong className="text-amber-200">Closed Popups:</strong> If you accidentally dismissed the login window prior to granting permissions, click <span className="text-white underline">Connect Google Drive</span> above once more.
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ACTIVE EXPLORER VIEW */
            <motion.div 
              key="drive-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-8"
            >
              {/* Left Explorer Console */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Search & Actions Bar */}
                <div id="drive-actions-console" className="flex flex-col md:flex-row gap-4 items-center justify-between p-5 glass-card bg-black/30 border border-white/5 rounded-3xl">
                  {/* Search input bar */}
                  <div className="w-full md:w-80 relative flex items-center border border-white/10 bg-white/5 px-4 py-3 rounded-2xl group focus-within:border-emerald-500/50 transition-all">
                    <Search className="w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 mr-2 transition-colors" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search files and nodes..."
                      className="w-full bg-transparent border-none outline-none font-semibold text-xs text-white placeholder-slate-500"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="text-xs font-bold text-slate-500 hover:text-white"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Actions (Create Folder, Toggle layout) */}
                  <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-3 shrink-0">
                    <div id="layout-toggle-container" className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                      <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-emerald-600 border border-emerald-500/30 text-white' : 'text-slate-500 hover:text-white'}`}
                        title="Grid Layout"
                      >
                        <LayoutGrid size={16} />
                      </button>
                      <button 
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewMode === 'list' ? 'bg-emerald-600 border border-emerald-500/30 text-white' : 'text-slate-500 hover:text-white'}`}
                        title="List Layout"
                      >
                        <List size={16} />
                      </button>
                    </div>

                    <button 
                      onClick={() => setShowNewFolderModal(true)}
                      className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-600/10 hover:text-emerald-400 rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
                    >
                      <Plus size={16} />
                      <span>New Folder</span>
                    </button>
                  </div>
                </div>

                {/* Directory Navigation History / Breadcrumbs */}
                <div id="drive-breadcrumbs-bar" className="flex items-center gap-2 py-2 px-3 overflow-x-auto text-[10px] font-black uppercase tracking-widest text-slate-500 border-l border-emerald-500">
                  {breadcrumbs.map((crumb, idx) => (
                    <React.Fragment key={crumb.id}>
                      {idx > 0 && <ChevronRight size={12} className="text-slate-700 shrink-0" />}
                      <button 
                        onClick={() => handleBreadcrumbClick(idx)}
                        className={`hover:text-emerald-400 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${idx === breadcrumbs.length - 1 ? 'text-emerald-400 font-extrabold font-mono' : ''}`}
                      >
                        {crumb.name}
                      </button>
                    </React.Fragment>
                  ))}
                </div>

                {/* File Grid / Lists block */}
                <div id="files-grid-stage" className="min-h-[400px] relative">
                  
                  {loading ? (
                    /* LOADING SPINNER HALER */
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-20 space-y-6">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-emerald-500/20 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="text-emerald-500 animate-spin" size={24} />
                        </div>
                      </div>
                      <span className="text-[9px] font-black tracking-[0.3em] text-emerald-500 uppercase animate-pulse">Querying_Drive_Registry...</span>
                    </div>
                  ) : files.length === 0 ? (
                    /* EMPTY VIEW STATE */
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-[40px] text-center p-12 bg-black/10">
                      <HardDrive size={48} className="text-slate-700 mb-4 animate-pulse" />
                      <h4 className="text-base font-black uppercase tracking-wider text-slate-400">Folder Empty</h4>
                      <p className="text-xs text-slate-600 max-w-sm mx-auto mt-2 font-medium">
                        Drag and drop items directly onto the file explorer, or click upload to push assets.
                      </p>
                    </div>
                  ) : viewMode === 'grid' ? (
                    /* GRID INTERFACE */
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                      {files.map(file => {
                        const isFolderType = isFolder(file);
                        const isSelected = selectedFile?.id === file.id;

                        return (
                          <div 
                            key={file.id}
                            onClick={() => setSelectedFile(file)}
                            onDoubleClick={() => isFolderType ? handleFolderClick(file) : setSelectedFile(file)}
                            className={`glass-card p-5 rounded-3xl border transition-all text-left group flex flex-col justify-between h-48 cursor-pointer relative overflow-hidden select-none ${
                              isSelected 
                                ? 'bg-emerald-600/10 border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.1)]' 
                                : 'bg-black/30 border-white/5 hover:border-emerald-500/20 hover:bg-black/40'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className={`p-3 rounded-2xl border transition-colors ${
                                isFolderType 
                                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 group-hover:bg-amber-500/20' 
                                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20'
                              }`}>
                                {isFolderType ? <Folder size={20} /> : <FileText size={20} />}
                              </div>
                              
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  confirmTrashFile(file);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                title="Move to Trash"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            <div className="space-y-1">
                              <h5 className="font-extrabold italic uppercase tracking-tight text-white text-xs truncate max-w-full m-0" title={file.name}>
                                {file.name}
                              </h5>
                              <p className="text-[8px] font-semibold font-mono uppercase tracking-widest text-slate-600">
                                {isFolderType ? 'Directory' : formatBytes(file.size)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* LIST INTERFACE */
                    <div className="glass-card rounded-[32px] border border-white/5 overflow-hidden">
                      <div className="table-fixed w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-white/5 bg-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500">
                            <th className="p-4 w-1/2">Asset Name</th>
                            <th className="p-4 w-1/4">Disk Size</th>
                            <th className="p-4 w-1/4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {files.map(file => {
                            const isFolderType = isFolder(file);
                            const isSelected = selectedFile?.id === file.id;

                            return (
                              <tr 
                                key={file.id}
                                onClick={() => setSelectedFile(file)}
                                onDoubleClick={() => isFolderType ? handleFolderClick(file) : setSelectedFile(file)}
                                className={`group cursor-pointer select-none transition-colors ${
                                  isSelected ? 'bg-emerald-500/5' : 'hover:bg-white/5'
                                }`}
                              >
                                <td className="p-4 flex items-center gap-3">
                                  <div className={`p-2 rounded-xl border shrink-0 ${
                                    isFolderType 
                                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
                                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                  }`}>
                                    {isFolderType ? <Folder size={14} /> : <FileText size={14} />}
                                  </div>
                                  <span className="font-bold text-slate-200 truncate group-hover:text-white uppercase italic tracking-tight text-xs">{file.name}</span>
                                </td>
                                <td className="p-4 text-slate-500 font-mono text-[10px] font-semibold">{isFolderType ? 'Folder' : formatBytes(file.size)}</td>
                                <td className="p-4 text-right">
                                  <div className="flex justify-end gap-3">
                                    {isFolderType && (
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); handleFolderClick(file); }}
                                        className="p-1 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white"
                                      >
                                        Browse
                                      </button>
                                    )}
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); confirmTrashFile(file); }}
                                      className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                      title="Trash Item"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </div>
                    </div>
                  )}
                </div>

                {/* Interactive Drag & Drop File Upload Panel */}
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-[32px] p-8 text-center transition-all flex flex-col items-center justify-center space-y-4 cursor-pointer relative overflow-hidden ${
                    dragActive 
                      ? 'border-emerald-500 bg-emerald-500/5' 
                      : 'border-white/10 bg-black/10 hover:bg-black/20 hover:border-white/20'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {uploading ? (
                    <div className="space-y-4 w-full max-w-xs mx-auto">
                      <div className="flex items-center justify-center">
                        <Loader2 size={32} className="text-emerald-500 animate-spin" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Pushing Shard Assets...</p>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="bg-emerald-500 h-full transition-all duration-300 rounded-full" 
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <span className="text-[8px] font-mono text-slate-500 font-bold tracking-widest uppercase">{uploadProgress}% COMPLETE</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 bg-white/5 border border-white/5 rounded-full text-slate-500">
                        <Upload size={22} className={dragActive ? "animate-bounce text-emerald-400" : ""} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-extrabold uppercase tracking-widest text-slate-200">
                          {dragActive ? "Drop files to ingest" : "Drag and drop file here"}
                        </p>
                        <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">
                          Or click here to browse storage
                        </p>
                      </div>
                    </>
                  )}
                </div>

              </div>

              {/* Right Side File Metadata Panel */}
              <div className="lg:col-span-1 space-y-6">
                
                <AnimatePresence mode="wait">
                  {selectedFile ? (
                    /* FILE SELECTED PANEL */
                    <motion.div 
                      key={selectedFile.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="glass-card p-6 border border-white/5 rounded-[40px] bg-black/40 space-y-6 flex flex-col h-full sticky top-6"
                    >
                      <div className="flex items-start justify-between border-b border-white/5 pb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${isFolder(selectedFile) ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-400'}`}>
                            {isFolder(selectedFile) ? <Folder size={16} /> : <FileText size={16} />}
                          </div>
                          <div>
                            <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">METADATA ENGINE</span>
                            <p className="text-[10px] font-mono font-black uppercase text-slate-400">ID: {selectedFile.id.substring(0, 10)}...</p>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => setSelectedFile(null)}
                          className="p-1 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white"
                        >
                          <ArrowLeft size={16} />
                        </button>
                      </div>

                      {/* File Icon Display and Preview Info */}
                      <div className="text-center space-y-3">
                        <div className="mx-auto w-16 h-16 bg-white/5 border border-white/10 rounded-[24px] flex items-center justify-center overflow-hidden shadow-xl relative group">
                          {selectedFile.thumbnailLink ? (
                            <img src={selectedFile.thumbnailLink} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                          ) : isFolder(selectedFile) ? (
                            <Folder size={28} className="text-amber-500" />
                          ) : (
                            <FileText size={28} className="text-emerald-400" />
                          )}
                        </div>
                        
                        <h4 className="text-base font-extrabold italic uppercase tracking-tight text-white leading-tight break-all px-2">
                          {selectedFile.name}
                        </h4>
                      </div>

                      {/* Properties Listing */}
                      <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          
                          <div>
                            <span className="text-[8px] font-black text-slate-600 block tracking-widest">DATA FORMAT</span>
                            <span className="text-slate-200 block truncate" title={selectedFile.mimeType}>
                              {selectedFile.mimeType.split('/').pop() || 'Unknown'}
                            </span>
                          </div>

                          <div>
                            <span className="text-[8px] font-black text-slate-600 block tracking-widest">DISK WEIGHT</span>
                            <span className="text-slate-200 block">
                              {isFolder(selectedFile) ? 'Folder' : formatBytes(selectedFile.size)}
                            </span>
                          </div>

                          <div className="col-span-2">
                            <span className="text-[8px] font-black text-slate-600 block tracking-widest">MINT TIME</span>
                            <span className="text-slate-200 block flex items-center gap-1.5 font-mono text-[9px]">
                              <Clock size={12} className="text-slate-500" />
                              {selectedFile.createdTime ? new Date(selectedFile.createdTime).toLocaleString() : 'Not available'}
                            </span>
                          </div>

                          {selectedFile.owners && selectedFile.owners[0] && (
                            <div className="col-span-2 border-t border-white/5 pt-3 mt-1">
                              <span className="text-[8px] font-black text-slate-600 block tracking-widest mb-1.5">OWNERSHIP SHARD</span>
                              <div className="flex items-center gap-3">
                                {selectedFile.owners[0].photoLink ? (
                                  <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 shrink-0">
                                    <img src={selectedFile.owners[0].photoLink} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs text-slate-400 font-bold italic border border-white/10 shrink-0">
                                    {selectedFile.owners[0].displayName[0]}
                                  </div>
                                )}
                                <div className="leading-tight overflow-hidden">
                                  <p className="text-slate-200 font-bold text-[10px] truncate m-0">{selectedFile.owners[0].displayName}</p>
                                  <p className="text-slate-600 font-medium text-[8px] truncate m-0">{selectedFile.owners[0].emailAddress}</p>
                                </div>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>

                      {/* Control buttons */}
                      <div className="space-y-3 pt-6 mt-auto border-t border-white/5">
                        {selectedFile.webViewLink && (
                          <a 
                            href={selectedFile.webViewLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full py-4.5 bg-emerald-600 hover:bg-emerald-500 rounded-full font-black text-[10px] uppercase text-center tracking-[0.2em] text-white flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95"
                          >
                            <span>Open In Drive</span>
                            <ExternalLink size={14} />
                          </a>
                        )}

                        {selectedFile.webContentLink && !isFolder(selectedFile) && (
                          <a 
                            href={selectedFile.webContentLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full py-4.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-black text-[10px] uppercase text-center tracking-[0.2em] text-slate-400 hover:text-white flex items-center justify-center gap-2 transition-all active:scale-95"
                          >
                            <span>Download File</span>
                            <Download size={14} />
                          </a>
                        )}

                        <button 
                          onClick={() => confirmTrashFile(selectedFile)}
                          className="w-full py-4.5 bg-red-950/20 hover:bg-red-900/30 text-red-400 rounded-full font-black text-[10px] uppercase text-center tracking-[0.2em] border border-red-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                        >
                          <Trash2 size={14} />
                          <span>Trash Shard Item</span>
                        </button>
                      </div>

                    </motion.div>
                  ) : (
                    /* DEFAULT BLANK PANEL */
                    <div className="glass-card p-6 border border-white/5 rounded-[40px] bg-black/40 space-y-4 flex flex-col justify-center text-center h-[320px] lg:h-[450px]">
                      <Info size={32} className="text-slate-700 mx-auto animate-pulse" />
                      <h5 className="font-extrabold uppercase tracking-wider text-slate-400 text-xs">No Node Selected</h5>
                      <p className="text-[10px] text-slate-600 max-w-[200px] mx-auto leading-relaxed">
                        Select any file or folder shard directory from the grid matrix to review its metadata payloads.
                      </p>
                    </div>
                  )}
                </AnimatePresence>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CREATE FOLDER MODAL CONTAINER */}
        <AnimatePresence>
          {showNewFolderModal && (
            <div className="fixed inset-0 z-[3000] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md glass-card rounded-[40px] border border-white/10 overflow-hidden shadow-2xl bg-black"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <h4 className="text-sm font-black uppercase tracking-widest text-emerald-400">Create Folder Node</h4>
                  <button onClick={() => setShowNewFolderModal(false)} className="text-slate-500 hover:text-white">
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleCreateFolder} className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">Directory Name</label>
                    <input 
                      type="text" 
                      value={newFolderName}
                      onChange={e => setNewFolderName(e.target.value)}
                      placeholder="e.g. soil_analysis_reports"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4.5 text-xs text-white outline-none focus:border-emerald-500/50"
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button" 
                      onClick={() => setShowNewFolderModal(false)}
                      className="py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={creatingFolder || !newFolderName.trim()}
                      className="py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-40"
                    >
                      {creatingFolder ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                      <span>Provise</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MUTATION / DELETE EXPLICIT CONFIRMATION MODAL - MANDATORY AS PER GOALS AND SKILL */}
        <AnimatePresence>
          {fileToDelete && (
            <div className="fixed inset-0 z-[3000] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md glass-card rounded-[40px] border border-red-500/20 overflow-hidden shadow-2xl bg-[#090505]"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-widest text-red-500">Explicit Authorization Required</h4>
                </div>

                <div className="p-8 space-y-6 text-center">
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full w-14 h-14 flex items-center justify-center mx-auto animate-float">
                    <Trash2 size={24} />
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-base font-extrabold italic uppercase text-white leading-tight">
                      Trash Shard Item?
                    </h5>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-sm mx-auto">
                      Are you sure you want to move the file <span className="text-red-400 font-extrabold">"{fileToDelete.name}"</span> to Google Drive trash? You can recover this object from your Drive console.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button" 
                      onClick={() => setFileToDelete(null)}
                      disabled={deletingFile}
                      className="py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      onClick={handleTrashFile}
                      disabled={deletingFile}
                      className="py-4 bg-red-600 hover:bg-red-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      {deletingFile ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      <span>Confirm Trash</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

// Standard X icon helper if not imported
const X: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export default GoogleDriveView;
