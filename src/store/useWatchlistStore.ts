import { create, StateCreator } from 'zustand';
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

const storeCreator: StateCreator<WatchlistState> = (set) => ({
  items: [],
  isLoading: false,
  error: null,

  addItem: (item: WatchlistItem) =>
    set((state: WatchlistState) => ({ items: [...state.items, item] })),

  removeItem: (id: string) =>
    set((state: WatchlistState) => ({
      items: state.items.filter((item: WatchlistItem) => item.id !== id),
    })),

  updateItem: (id: string, updates: Partial<WatchlistItem>) =>
    set((state: WatchlistState) => ({
      items: state.items.map((item: WatchlistItem) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),

  setItems: (items: WatchlistItem[]) => set({ items }),

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),
});

export const useWatchlistStore = create<WatchlistState>(storeCreator);
