import { WatchlistItem as WatchlistItemType } from '@/types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { formatCurrency, getDealQuality, getColorForDealQuality } from '@/lib/utils';
import { Trash2, TrendingDown, AlertCircle } from 'lucide-react';

interface WatchlistItemProps {
  item: WatchlistItemType;
  onRemove: (id: string) => void;
}

export function WatchlistItem({ item, onRemove }: WatchlistItemProps) {
  const bestPrice = item.current_prices?.[0];
  const dealQuality = bestPrice
    ? getDealQuality(bestPrice.premium_percent)
    : 'fair';

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">{item.product?.name || 'Unknown Product'}</h4>
            <div className="flex items-center gap-2 mt-2">
              {bestPrice ? (
                <>
                  <span className="text-lg font-bold">{formatCurrency(bestPrice.price)}</span>
                  <Badge variant={dealQuality === 'excellent' || dealQuality === 'good' ? 'success' : 'outline'}>
                    <span className={getColorForDealQuality(dealQuality)}>
                      {dealQuality.toUpperCase()}
                    </span>
                  </Badge>
                  {bestPrice.in_stock ? (
                    <Badge variant="outline">In Stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </>
              ) : (
                <span className="text-sm text-muted-foreground">Price unavailable</span>
              )}
            </div>
            {item.target_price && bestPrice && (
              <div className="mt-2 flex items-center gap-1 text-xs">
                {bestPrice.price <= item.target_price ? (
                  <>
                    <TrendingDown className="h-3 w-3 text-success" />
                    <span className="text-success">Target price reached!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Target: {formatCurrency(item.target_price)}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.id)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
