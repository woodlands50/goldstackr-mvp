import { create, StateCreator } from 'zustand';
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

const storeCreator: StateCreator<SpotPriceState> = (set) => ({
  spotPrices: [],
  isLoading: false,
  error: null,
  lastUpdated: null,

  setSpotPrices: (prices: SpotPrice[]) => set({
    spotPrices: prices,
    lastUpdated: new Date().toISOString(),
  }),

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  updateSpotPrice: (metal: string, price: number, change: number) =>
    set((state: SpotPriceState) => {
      const existingIndex = state.spotPrices.findIndex((p: SpotPrice) => p.metal === metal);
      const newPrice: SpotPrice = {
        metal: metal as SpotPrice['metal'],
        price,
        change,
        change_percent: (change / (price - change)) * 100,
        timestamp: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        const updated = [...state.spotPrices];
        updated[existingIndex] = newPrice;
        return { spotPrices: updated, lastUpdated: new Date().toISOString() };
      }
      return {
        spotPrices: [...state.spotPrices, newPrice],
        lastUpdated: new Date().toISOString(),
      };
    }),
});

export const useSpotPriceStore = create<SpotPriceState>(storeCreator);
