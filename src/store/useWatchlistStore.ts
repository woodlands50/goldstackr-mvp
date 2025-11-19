import { create } from 'zustand';
import { WatchlistItem } from '@/types';

interface WatchlistState {
  items: WatchlistItem[];
  isLoading: boolean;
  error: string | null;
  addItem: (item: WatchlistItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<WatchlistItem>) => void;
  setItems: (items: WatchlistItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useWatchlistStore = create<WatchlistState>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  addItem: (item) => set((state) => ({
    items: [...state.items, item],
  })),

  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id),
  })),

  updateItem: (id, updates) => set((state) => ({
    items: state.items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ),
  })),

  setItems: (items) => set({ items }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),
}));
