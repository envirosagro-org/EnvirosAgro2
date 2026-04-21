import { create } from 'zustand';
import { ViewState, RegistryGroup, RegistryItem } from '../types';
import { REGISTRY_NODES } from '../constants/registry';
import { useDataStore } from './dataStore';

const findMatrixIndex = (v: ViewState, section: string | null): string | undefined => {
  let index: string | undefined;
  REGISTRY_NODES.forEach((group: RegistryGroup, dIdx: number) => {
    group.items.forEach((item: RegistryItem, eIdx: number) => {
      if (item.id === v) {
        if (!section) {
          index = `[${dIdx + 1}.${eIdx + 1}]`;
        } else {
          const sIdx = item.sections?.findIndex((s: {id: string}) => s.id === section);
          if (sIdx !== undefined && sIdx !== -1) {
            index = `[${dIdx + 1}.${eIdx + 1}.${sIdx + 1}]`;
          }
        }
      }
    });
  });
  return index;
};

interface UiStore {
  view: ViewState;
  setView: (view: ViewState) => void;
  viewSection: string | null;
  setViewSection: (section: string | null) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (isOpen: boolean) => void;
  isInboxOpen: boolean;
  setIsInboxOpen: (isOpen: boolean) => void;
  multimediaParams: { prompt?: string; type?: string; autoGenerate?: boolean } | null;
  setMultimediaParams: (params: { prompt?: string; type?: string; autoGenerate?: boolean } | null) => void;
  selectedPlot: any | null;
  setSelectedPlot: (plot: any | null) => void;
  generateShareUrl: (v?: ViewState, section?: string | null, id?: string | null) => string;
  navigate: (v: ViewState, section?: string | null, pushToHistory?: boolean, params?: any) => void;
  goBack: () => void;
  goForward: () => void;
}

export const useUiStore = create<UiStore>((set, get) => ({
  view: 'dashboard',
  setView: (view) => set({ view }),
  viewSection: null,
  setViewSection: (viewSection) => set({ viewSection }),
  isSidebarOpen: true,
  setIsSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
  isGlobalSearchOpen: false,
  setIsGlobalSearchOpen: (isGlobalSearchOpen) => set({ isGlobalSearchOpen }),
  isInboxOpen: false,
  setIsInboxOpen: (isInboxOpen) => set({ isInboxOpen }),
  multimediaParams: null,
  setMultimediaParams: (multimediaParams) => set({ multimediaParams }),
  selectedPlot: null,
  setSelectedPlot: (selectedPlot) => set({ selectedPlot }),
  generateShareUrl: (v, section, id) => {
    const state = get();
    const view = v || state.view;
    const sec = section !== undefined ? section : state.viewSection;
    
    const url = new URL(window.location.origin);
    url.searchParams.set('view', view);
    if (sec) url.searchParams.set('section', sec);
    if (id) url.searchParams.set('id', id);
    
    return url.toString();
  },
  navigate: (v, section, pushToHistory = true, params = null) => {
    const state = get();
    const index = findMatrixIndex(v, section || null);
    
    if (pushToHistory) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('view', v);
      if (section) {
        newUrl.searchParams.set('section', section);
      } else {
        newUrl.searchParams.delete('section');
      }
      if (params?.id) {
        newUrl.searchParams.set('id', params.id);
      } else {
        newUrl.searchParams.delete('id');
      }
      window.history.pushState({ view: v, section, params }, '', newUrl.toString());
    } else {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('view', v);
      if (section) {
        newUrl.searchParams.set('section', section);
      } else {
        newUrl.searchParams.delete('section');
      }
      if (params?.id) {
        newUrl.searchParams.set('id', params.id);
      } else {
        newUrl.searchParams.delete('id');
      }
      window.history.replaceState({ view: v, section, params }, '', newUrl.toString());
    }
    
    set({
      view: v,
      viewSection: section || null,
      multimediaParams: v === 'multimedia_generator' ? params : state.multimediaParams,
      isMobileMenuOpen: false,
      isInboxOpen: false,
      isGlobalSearchOpen: false
    });

    if (window.innerWidth < 1024) {
      set({ isSidebarOpen: false });
    }
    
    useDataStore.getState().dispatchSignal({
      title: 'VECTOR_SHIFT',
      message: `Resolved route to ${index || v.toUpperCase()}.`,
      priority: 'low',
      type: 'system',
      origin: 'ORACLE',
      actionIcon: 'ChevronRight',
      dispatchLayers: [{ channel: 'POPUP', status: 'PENDING' }]
    });
  },
  goBack: () => {
    window.history.back();
  },
  goForward: () => {
    window.history.forward();
  },
}));
