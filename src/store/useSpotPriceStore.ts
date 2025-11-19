import { create } from 'zustand';
import { SpotPrice } from '@/types';

interface SpotPriceState {
  spotPrices: SpotPrice[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  setSpotPrices: (prices: SpotPrice[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateSpotPrice: (metal: string, price: number, change: number) => void;
}

export const useSpotPriceStore = create<SpotPriceState>((set) => ({
  spotPrices: [],
  isLoading: false,
  error: null,
  lastUpdated: null,

  setSpotPrices: (prices) => set({
    spotPrices: prices,
    lastUpdated: new Date().toISOString()
  }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  updateSpotPrice: (metal, price, change) => set((state) => {
    const existingIndex = state.spotPrices.findIndex(p => p.metal === metal);
    const newPrice: SpotPrice = {
      metal: metal as any,
      price,
      change,
      change_percent: (change / (price - change)) * 100,
      timestamp: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      const updated = [...state.spotPrices];
      updated[existingIndex] = newPrice;
      return { spotPrices: updated, lastUpdated: new Date().toISOString() };
    } else {
      return {
        spotPrices: [...state.spotPrices, newPrice],
        lastUpdated: new Date().toISOString()
      };
    }
  }),
}));
