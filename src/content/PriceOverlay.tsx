import { useEffect, useState } from 'react';
import { Price } from '@/types';
import { formatCurrency, getDealQuality, getColorForDealQuality } from '@/lib/utils';
import { ExternalLink, X, TrendingDown, Star } from 'lucide-react';

interface PriceOverlayProps {
  detectedPrice: number;
  dealerName: string;
  onClose: () => void;
  position?: { top: number; left: number };
}

export function PriceOverlay({ detectedPrice, dealerName, onClose, position }: PriceOverlayProps) {
  const [comparisons, setComparisons] = useState<Price[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadComparisons();
  }, []);

  const loadComparisons = async () => {
    // Mock data for now - in production, query Supabase
    setTimeout(() => {
      const mockComparisons: Price[] = [
        {
          id: '1',
          product_id: 'prod-1',
          dealer_id: 'dealer-1',
          price: detectedPrice - 50,
          premium_percent: 3.2,
          in_stock: true,
          quantity_available: 10,
          shipping_cost: 0,
          total_cost: detectedPrice - 50,
          last_updated: new Date().toISOString(),
          dealer: {
            id: 'dealer-1',
            name: 'Competitor A',
            website: 'https://example.com',
            logo: '',
            rating: 4.5,
            review_count: 1250,
            shipping_policy: 'Free shipping over $199',
            payment_methods: ['Credit Card', 'Wire'],
            contact_email: 'info@example.com',
            contact_phone: '1-800-123-4567',
            trust_score: 95,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        },
        {
          id: '2',
          product_id: 'prod-1',
          dealer_id: 'dealer-2',
          price: detectedPrice + 25,
          premium_percent: 5.8,
          in_stock: true,
          quantity_available: 5,
          shipping_cost: 9.99,
          total_cost: detectedPrice + 34.99,
          last_updated: new Date().toISOString(),
          dealer: {
            id: 'dealer-2',
            name: 'Competitor B',
            website: 'https://example2.com',
            logo: '',
            rating: 4.2,
            review_count: 890,
            shipping_policy: 'Flat rate $9.99',
            payment_methods: ['Credit Card', 'PayPal'],
            contact_email: 'info@example2.com',
            contact_phone: '1-800-987-6543',
            trust_score: 88,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        },
      ];
      setComparisons(mockComparisons);
      setIsLoading(false);
    }, 500);
  };

  const bestPrice = comparisons.length > 0
    ? comparisons.reduce((best, current) => current.total_cost < best.total_cost ? current : best)
    : null;

  const savings = bestPrice ? detectedPrice - bestPrice.total_cost : 0;

  return (
    <div
      className="goldstackr-overlay animate-slide-in"
      style={position ? { top: position.top, left: position.left } : undefined}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">💰</span>
          <div>
            <h3 className="font-bold text-sm">GoldStackr Price Check</h3>
            <p className="text-xs text-muted-foreground">Current dealer: {dealerName}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-4 text-sm text-muted-foreground">
          Comparing prices...
        </div>
      ) : comparisons.length === 0 ? (
        <div className="text-center py-4 text-sm text-muted-foreground">
          No comparisons available for this product.
        </div>
      ) : (
        <>
          {savings > 0 && (
            <div className="bg-success/10 border border-success rounded p-3 mb-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-success" />
                <div>
                  <p className="font-semibold text-success">Save {formatCurrency(savings)}!</p>
                  <p className="text-xs text-success">Better deal available</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {comparisons.slice(0, isExpanded ? undefined : 2).map((price) => {
              const dealQuality = getDealQuality(price.premium_percent);
              const isBest = price.id === bestPrice?.id;

              return (
                <div
                  key={price.id}
                  className={`p-2 rounded border ${isBest ? 'border-success bg-success/5' : 'border-border'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{price.dealer?.name}</p>
                        {isBest && <span className="text-xs text-success">Best Deal</span>}
                      </div>
                      <p className="text-lg font-bold">{formatCurrency(price.price)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs ${getColorForDealQuality(dealQuality)}`}>
                          {price.premium_percent.toFixed(1)}% premium
                        </span>
                        {price.shipping_cost > 0 && (
                          <span className="text-xs text-muted-foreground">
                            +{formatCurrency(price.shipping_cost)} shipping
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => window.open(price.dealer?.website, '_blank')}
                      className="p-2 hover:bg-muted rounded transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {comparisons.length > 2 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full mt-2 text-sm text-primary hover:underline"
            >
              {isExpanded ? 'Show less' : `Show ${comparisons.length - 2} more options`}
            </button>
          )}

          <button
            className="w-full mt-3 bg-gold hover:bg-gold-dark text-navy-dark font-semibold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
          >
            <Star className="h-4 w-4" />
            Add to Watchlist
          </button>
        </>
      )}
    </div>
  );
}
