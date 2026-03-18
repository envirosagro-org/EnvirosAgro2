
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred in the EnvirosAgro Matrix.";
      let isPermissionError = false;

      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && (parsed.error.includes('permission-denied') || parsed.error.includes('Missing or insufficient permissions'))) {
            errorMessage = `Security Protocol Violation: Access to ${parsed.path || 'resource'} was denied. Please verify your credentials.`;
            isPermissionError = true;
          }
        }
      } catch (e) {
        // Not a JSON error message
      }

      return (
        <div className="min-h-screen bg-[#050706] flex items-center justify-center p-6 font-sans">
          <div className="max-w-2xl w-full glass-card p-10 md:p-16 rounded-[48px] border border-rose-500/20 bg-rose-500/5 shadow-3xl text-center space-y-8 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-rose-600/10 rounded-[32px] flex items-center justify-center mx-auto border border-rose-500/30 text-rose-500 animate-pulse">
              <ShieldAlert size={48} />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter leading-tight">
                {isPermissionError ? 'ACCESS_DENIED' : 'MATRIX_CRITICAL_FAULT'}
              </h1>
              <p className="text-slate-400 text-sm md:text-base italic leading-relaxed max-w-md mx-auto">
                {errorMessage}
              </p>
            </div>

            {this.state.error && (
              <div className="p-6 bg-black/40 rounded-3xl border border-white/5 text-left overflow-hidden">
                <p className="text-[10px] font-mono text-rose-400/60 uppercase tracking-widest mb-2">Error_Stack_Trace</p>
                <div className="text-[10px] font-mono text-slate-500 overflow-x-auto whitespace-pre-wrap max-h-32 custom-scrollbar">
                  {this.state.error.toString()}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button 
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-10 py-5 bg-rose-600 hover:bg-rose-500 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-full shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                <RefreshCw size={18} /> Re-Initialize
              </button>
              <button 
                onClick={this.handleReset}
                className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-full border border-white/10 flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                <Home size={18} /> Return to Root
              </button>
            </div>
            
            <p className="text-[8px] font-mono text-slate-700 uppercase tracking-[0.5em]">
              Node_ID: {Math.random().toString(36).substring(7).toUpperCase()} // Status: RECOVERY_MODE
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
