
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  limit, 
  orderBy,
  doc,
  getDoc
} from "firebase/firestore";
import { 
  ref, 
  get, 
  query as rtdbQuery, 
  orderByChild, 
  equalTo,
  limitToLast
} from "firebase/database";
import { 
  ref as storageRef, 
  listAll, 
  getDownloadURL,
  getMetadata
} from "firebase/storage";
import { db, rtdb, storage } from "./firebaseService";
import { ViewState } from "../types";

export interface SearchResult {
  id: string;
  type: 'steward' | 'product' | 'book' | 'signal' | 'collective' | 'shard' | 'media' | 'pulse';
  title: string;
  description: string;
  url: string;
  metadata?: any;
}

export class QueryEngineService {
  /**
   * Generates a deep-link URL for a specific asset
   */
  static generateDeepLink(view: ViewState, id: string, params?: Record<string, string>): string {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.APP_URL || '');
    const searchParams = new URLSearchParams(params);
    searchParams.set('view', view);
    searchParams.set('id', id);
    return `${baseUrl}/?${searchParams.toString()}`;
  }

  /**
   * Global search across multiple Firestore collections, RTDB, and Storage
   */
  static async globalSearch(searchTerm: string, maxResults: number = 20): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    const term = searchTerm.toLowerCase();

    // 1. Search Firestore Collections
    const collections = [
      { name: 'stewards', type: 'steward', view: 'community', section: 'network' },
      { name: 'products', type: 'product', view: 'economy', section: 'catalogue' },
      { name: 'books', type: 'book', view: 'research', section: '' },
      { name: 'collectives', type: 'collective', view: 'community', section: 'shards' },
      { name: 'signals', type: 'signal', view: 'explorer', section: 'terminal' }
    ];

    for (const col of collections) {
      const q = query(collection(db, col.name), limit(maxResults));
      const snap = await getDocs(q);
      snap.docs.forEach(doc => {
        const data = doc.data();
        const searchableText = `${data.name || ''} ${data.title || ''} ${data.description || ''} ${data.esin || ''} ${data.message || ''}`.toLowerCase();
        if (searchableText.includes(term)) {
          results.push({
            id: doc.id,
            type: col.type as any,
            title: data.name || data.title || doc.id,
            description: data.description || data.message || `ESIN: ${data.esin || 'N/A'}`,
            url: this.generateDeepLink(col.view as ViewState, doc.id, col.section ? { section: col.section } : {}),
            metadata: data
          });
        }
      });
    }

    // 2. Search RTDB (Network Pulse)
    try {
      const pulseRef = rtdbQuery(ref(rtdb, 'network_pulse'), limitToLast(50));
      const pulseSnap = await get(pulseRef);
      if (pulseSnap.exists()) {
        const pulses = pulseSnap.val();
        Object.keys(pulses).forEach(key => {
          const pulse = pulses[key];
          if (pulse.message?.toLowerCase().includes(term)) {
            results.push({
              id: key,
              type: 'pulse',
              title: 'Network Pulse Signal',
              description: pulse.message,
              url: this.generateDeepLink('explorer', 'terminal'),
              metadata: pulse
            });
          }
        });
      }
    } catch (e) {
      console.warn("RTDB Search Error:", e);
    }

    // 3. Search Storage (Media/Files)
    try {
      const mediaFolders = ['media', 'shards', 'documents'];
      for (const folder of mediaFolders) {
        const listRef = storageRef(storage, folder);
        const listResult = await listAll(listRef);
        for (const item of listResult.items) {
          if (item.name.toLowerCase().includes(term)) {
            const metadata = await getMetadata(item);
            results.push({
              id: item.fullPath,
              type: 'media',
              title: item.name,
              description: `Storage Asset in /${folder} | Size: ${metadata.size} bytes`,
              url: this.generateDeepLink('media_ledger', item.name),
              metadata: { path: item.fullPath, ...metadata }
            });
          }
        }
      }
    } catch (e) {
      console.warn("Storage Search Error:", e);
    }

    return results.slice(0, maxResults);
  }

  /**
   * Fetches all searchable items for sitemap generation
   */
  static async getAllSearchableItems(): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    
    // Fetch a subset of all major collections for the sitemap
    const collections = [
      { name: 'stewards', type: 'steward', view: 'community' },
      { name: 'products', type: 'product', view: 'economy' },
      { name: 'books', type: 'book', view: 'research' },
      { name: 'collectives', type: 'collective', view: 'community' },
      { name: 'signals', type: 'signal', view: 'explorer' }
    ];
    
    for (const col of collections) {
      const q = query(collection(db, col.name), limit(100));
      const snap = await getDocs(q);
      snap.docs.forEach(doc => {
        const data = doc.data();
        results.push({
          id: doc.id,
          type: col.type as any,
          title: data.name || data.title || doc.id,
          description: data.description || data.message || '',
          url: this.generateDeepLink(col.view as ViewState, doc.id),
        });
      });
    }

    // Include some RTDB entries if relevant (e.g. major system nodes)
    // For now, we just stick to Firestore as it's the primary content store

    return results;
  }
}
