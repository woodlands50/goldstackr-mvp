import { Price } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { formatCurrency, getDealQuality, getColorForDealQuality } from '@/lib/utils';
import { ExternalLink, TrendingUp } from 'lucide-react';

interface TrendingDealsProps {
  deals: Price[];
}

export function TrendingDeals({ deals }: TrendingDealsProps) {
  if (deals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gold" />
            Trending Deals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No trending deals available at the moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-gold" />
          Trending Deals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {deals.slice(0, 5).map((deal) => {
          const dealQuality = getDealQuality(deal.premium_percent);

          return (
            <div key={deal.id} className="flex items-start justify-between gap-2 pb-3 border-b last:border-0 last:pb-0">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{deal.product?.name}</h4>
                <p className="text-xs text-muted-foreground truncate">{deal.dealer?.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold">{formatCurrency(deal.price)}</span>
                  <Badge variant={dealQuality === 'excellent' || dealQuality === 'good' ? 'success' : 'outline'} className="text-xs">
                    <span className={getColorForDealQuality(dealQuality)}>
                      {deal.premium_percent.toFixed(1)}% Premium
                    </span>
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => window.open(deal.dealer?.website, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
