import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Types
export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  key: string;
  tags?: string[];
}

export interface CacheState {
  apiCache: Record<string, CacheEntry>;
  defaultTTL: number;
  maxCacheSize: number;
  currentCacheSize: number;
  hitCount: number;
  missCount: number;
  enabled: boolean;
  persistToDisk: boolean;
}

// Initial state
const initialState: CacheState = {
  apiCache: {},
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  maxCacheSize: 100,
  currentCacheSize: 0,
  hitCount: 0,
  missCount: 0,
  enabled: true,
  persistToDisk: false,
};

// Helper functions
const isExpired = (entry: CacheEntry): boolean => {
  return Date.now() - entry.timestamp > entry.ttl;
};

const evictOldestEntries = (cache: Record<string, CacheEntry>, maxSize: number) => {
  const entries = Object.values(cache);
  if (entries.length <= maxSize) return;
  
  // Sort by timestamp and remove oldest
  entries.sort((a, b) => a.timestamp - b.timestamp);
  const toRemove = entries.slice(0, entries.length - maxSize);
  
  toRemove.forEach(entry => {
    delete cache[entry.key];
  });
};

// Slice
export const cacheSlice = createSlice({
  name: 'cache',
  initialState,
  reducers: {
    setCacheData: (state, action: PayloadAction<{
      key: string;
      data: any;
      ttl?: number;
      tags?: string[];
    }>) => {
      const { key, data, ttl, tags } = action.payload;
      
      if (!state.enabled) return;
      
      const cacheEntry: CacheEntry = {
        key,
        data,
        timestamp: Date.now(),
        ttl: ttl || state.defaultTTL,
        tags,
      };
      
      // Remove existing entry if it exists
      if (state.apiCache[key]) {
        delete state.apiCache[key];
        state.currentCacheSize = Math.max(0, state.currentCacheSize - 1);
      }
      
      // Add new entry
      state.apiCache[key] = cacheEntry;
      state.currentCacheSize += 1;
      
      // Evict old entries if necessary
      if (state.currentCacheSize > state.maxCacheSize) {
        evictOldestEntries(state.apiCache, state.maxCacheSize);
        state.currentCacheSize = Object.keys(state.apiCache).length;
      }
    },
    
    getCacheData: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      const entry = state.apiCache[key];
      
      if (!entry) {
        state.missCount += 1;
        return;
      }
      
      if (isExpired(entry)) {
        delete state.apiCache[key];
        state.currentCacheSize = Math.max(0, state.currentCacheSize - 1);
        state.missCount += 1;
        return;
      }
      
      state.hitCount += 1;
    },
    
    removeCacheData: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      if (state.apiCache[key]) {
        delete state.apiCache[key];
        state.currentCacheSize = Math.max(0, state.currentCacheSize - 1);
      }
    },
    
    invalidateByTag: (state, action: PayloadAction<string>) => {
      const tag = action.payload;
      const keysToRemove: string[] = [];
      
      Object.values(state.apiCache).forEach(entry => {
        if (entry.tags?.includes(tag)) {
          keysToRemove.push(entry.key);
        }
      });
      
      keysToRemove.forEach(key => {
        delete state.apiCache[key];
      });
      
      state.currentCacheSize = Object.keys(state.apiCache).length;
    },
    
    invalidateByKeys: (state, action: PayloadAction<string[]>) => {
      const keys = action.payload;
      
      keys.forEach(key => {
        if (state.apiCache[key]) {
          delete state.apiCache[key];
        }
      });
      
      state.currentCacheSize = Object.keys(state.apiCache).length;
    },
    
    invalidateByPattern: (state, action: PayloadAction<string>) => {
      const pattern = action.payload;
      const regex = new RegExp(pattern);
      const keysToRemove: string[] = [];
      
      Object.keys(state.apiCache).forEach(key => {
        if (regex.test(key)) {
          keysToRemove.push(key);
        }
      });
      
      keysToRemove.forEach(key => {
        delete state.apiCache[key];
      });
      
      state.currentCacheSize = Object.keys(state.apiCache).length;
    },
    
    clearExpiredEntries: (state) => {
      const keysToRemove: string[] = [];
      
      Object.values(state.apiCache).forEach(entry => {
        if (isExpired(entry)) {
          keysToRemove.push(entry.key);
        }
      });
      
      keysToRemove.forEach(key => {
        delete state.apiCache[key];
      });
      
      state.currentCacheSize = Object.keys(state.apiCache).length;
    },
    
    clearAllCache: (state) => {
      state.apiCache = {};
      state.currentCacheSize = 0;
    },
    
    setDefaultTTL: (state, action: PayloadAction<number>) => {
      state.defaultTTL = Math.max(1000, action.payload);
    },
    
    setMaxCacheSize: (state, action: PayloadAction<number>) => {
      const newMaxSize = Math.max(1, action.payload);
      state.maxCacheSize = newMaxSize;
      
      if (state.currentCacheSize > newMaxSize) {
        evictOldestEntries(state.apiCache, newMaxSize);
        state.currentCacheSize = Object.keys(state.apiCache).length;
      }
    },
    
    setEnabled: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload;
      
      if (!state.enabled) {
        state.apiCache = {};
        state.currentCacheSize = 0;
      }
    },
    
    setPersistToDisk: (state, action: PayloadAction<boolean>) => {
      state.persistToDisk = action.payload;
    },
    
    resetStats: (state) => {
      state.hitCount = 0;
      state.missCount = 0;
    },
    
    // Bulk operations
    setCacheMultiple: (state, action: PayloadAction<Array<{
      key: string;
      data: any;
      ttl?: number;
      tags?: string[];
    }>>) => {
      if (!state.enabled) return;
      
      action.payload.forEach(({ key, data, ttl, tags }) => {
        const cacheEntry: CacheEntry = {
          key,
          data,
          timestamp: Date.now(),
          ttl: ttl || state.defaultTTL,
          tags,
        };
        
        if (state.apiCache[key]) {
          state.currentCacheSize = Math.max(0, state.currentCacheSize - 1);
        }
        
        state.apiCache[key] = cacheEntry;
        state.currentCacheSize += 1;
      });
      
      if (state.currentCacheSize > state.maxCacheSize) {
        evictOldestEntries(state.apiCache, state.maxCacheSize);
        state.currentCacheSize = Object.keys(state.apiCache).length;
      }
    },
    
    preloadCache: (state, action: PayloadAction<Record<string, any>>) => {
      const data = action.payload;
      
      Object.entries(data).forEach(([key, value]) => {
        const cacheEntry: CacheEntry = {
          key,
          data: value,
          timestamp: Date.now(),
          ttl: state.defaultTTL,
        };
        
        state.apiCache[key] = cacheEntry;
      });
      
      state.currentCacheSize = Object.keys(state.apiCache).length;
      
      if (state.currentCacheSize > state.maxCacheSize) {
        evictOldestEntries(state.apiCache, state.maxCacheSize);
        state.currentCacheSize = Object.keys(state.apiCache).length;
      }
    },
  },
});

// Actions
export const {
  setCacheData,
  getCacheData,
  removeCacheData,
  invalidateByTag,
  invalidateByKeys,
  invalidateByPattern,
  clearExpiredEntries,
  clearAllCache,
  setDefaultTTL,
  setMaxCacheSize,
  setEnabled,
  setPersistToDisk,
  resetStats,
  setCacheMultiple,
  preloadCache,
} = cacheSlice.actions;

// Selectors (commented out to avoid circular dependencies)
// export const selectCacheEntry = (key: string) => (state: RootState) => { ... }
// ... other selectors commented out

// Default export
export default cacheSlice.reducer;
