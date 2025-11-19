import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSpotPriceStore } from '@/store/useSpotPriceStore';
import { useWatchlistStore } from '@/store/useWatchlistStore';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { SpotPriceCard } from '@/components/SpotPriceCard';
import { WatchlistItem } from '@/components/WatchlistItem';
import { TrendingDeals } from '@/components/TrendingDeals';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Moon, Sun, Settings, RefreshCw, Star } from 'lucide-react';
import { Price } from '@/types';

const queryClient = new QueryClient();

function PopupContent() {
  const { spotPrices, isLoading: spotLoading } = useSpotPriceStore();
  const { items: watchlistItems, removeItem } = useWatchlistStore();
  const { theme, setTheme } = usePreferencesStore();
  const [trendingDeals, setTrendingDeals] = useState<Price[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Load initial data
    loadSpotPrices();
    loadWatchlist();
    loadTrendingDeals();
  }, []);

  useEffect(() => {
    // Apply theme
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  const loadSpotPrices = async () => {
    // Mock data for now - in production, fetch from Supabase
    const mockSpotPrices = [
      { metal: 'gold' as const, price: 2045.30, change: 15.50, change_percent: 0.76, timestamp: new Date().toISOString() },
      { metal: 'silver' as const, price: 24.15, change: -0.35, change_percent: -1.43, timestamp: new Date().toISOString() },
    ];
    useSpotPriceStore.getState().setSpotPrices(mockSpotPrices);
  };

  const loadWatchlist = async () => {
    // Mock data - in production, fetch from Supabase
    useWatchlistStore.getState().setItems([]);
  };

  const loadTrendingDeals = async () => {
    // Mock data - in production, fetch from Supabase
    setTrendingDeals([]);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      loadSpotPrices(),
      loadWatchlist(),
      loadTrendingDeals(),
    ]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="popup-container bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-gold to-gold-dark p-4 text-navy-dark">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl">💰</div>
            <div>
              <h1 className="font-bold text-lg">GoldStackr</h1>
              <p className="text-xs opacity-90">Price Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 w-8 hover:bg-gold-dark/20"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 hover:bg-gold-dark/20"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gold-dark/20"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(600px - 80px)' }}>
        {/* Spot Prices */}
        <div className="space-y-2">
          {spotLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading spot prices...</div>
          ) : spotPrices.length > 0 ? (
            spotPrices.map((spotPrice) => (
              <SpotPriceCard key={spotPrice.metal} spotPrice={spotPrice} />
            ))
          ) : (
            <Card>
              <CardContent className="p-4 text-center text-muted-foreground">
                <p>Unable to load spot prices</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Watchlist */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-5 w-5 text-gold" />
              Your Watchlist
              {watchlistItems.length > 0 && (
                <span className="text-xs font-normal text-muted-foreground">
                  ({watchlistItems.length})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {watchlistItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Your watchlist is empty. Browse dealer websites to add products!
              </p>
            ) : (
              <div className="space-y-2">
                {watchlistItems.map((item) => (
                  <WatchlistItem key={item.id} item={item} onRemove={removeItem} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trending Deals */}
        <TrendingDeals deals={trendingDeals} />
      </div>
    </div>
  );
}

export default function Popup() {
  return (
    <QueryClientProvider client={queryClient}>
      <PopupContent />
    </QueryClientProvider>
  );
}
