import { SpotPrice } from '@/types';
import { Card, CardContent } from './ui/card';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface SpotPriceCardProps {
  spotPrice: SpotPrice;
}

const METAL_ICONS: Record<string, string> = {
  gold: '🥇',
  silver: '🥈',
  platinum: '⚪',
  palladium: '⚫',
};

export function SpotPriceCard({ spotPrice }: SpotPriceCardProps) {
  const isPositive = spotPrice.change >= 0;
  const metalName = spotPrice.metal.charAt(0).toUpperCase() + spotPrice.metal.slice(1);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{METAL_ICONS[spotPrice.metal]}</span>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{metalName}</p>
              <p className="text-2xl font-bold">{formatCurrency(spotPrice.price)}</p>
            </div>
          </div>
          <div className={`flex items-center gap-1 ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <div className="text-right">
              <p className="text-sm font-semibold">{formatPercent(spotPrice.change_percent, 2)}</p>
              <p className="text-xs">{formatCurrency(Math.abs(spotPrice.change))}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
