import { create } from 'zustand';
import { UserPreferences } from '@/types';
import { chromeStorageGet, chromeStorageSet } from '@/lib/utils';

interface PreferencesState extends UserPreferences {
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setPreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void;
  loadPreferences: () => Promise<void>;
  savePreferences: () => Promise<void>;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  notify_exceptional_deals: true,
  notify_watchlist_drops: true,
  notify_back_in_stock: true,
  notification_threshold_percent: 5,
  preferred_dealers: [],
  auto_detect_products: true,
};

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  ...DEFAULT_PREFERENCES,

  setTheme: (theme) => {
    set({ theme });
    get().savePreferences();
  },

  setPreference: (key, value) => {
    set({ [key]: value });
    get().savePreferences();
  },

  loadPreferences: async () => {
    const stored = await chromeStorageGet<UserPreferences>('preferences');
    if (stored) {
      set(stored);
    }
  },

  savePreferences: async () => {
    const state = get();
    const preferences: UserPreferences = {
      theme: state.theme,
      notify_exceptional_deals: state.notify_exceptional_deals,
      notify_watchlist_drops: state.notify_watchlist_drops,
      notify_back_in_stock: state.notify_back_in_stock,
      notification_threshold_percent: state.notification_threshold_percent,
      preferred_dealers: state.preferred_dealers,
      auto_detect_products: state.auto_detect_products,
    };
    await chromeStorageSet('preferences', preferences);
  },
}));
