import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(value: number, decimals: number = 2): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

export function calculatePremium(spotPrice: number, productPrice: number, weight: number): number {
  const metalValue = spotPrice * weight;
  return ((productPrice - metalValue) / metalValue) * 100;
}

export function getDealQuality(premiumPercent: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (premiumPercent < 3) return 'excellent';
  if (premiumPercent < 5) return 'good';
  if (premiumPercent < 8) return 'fair';
  return 'poor';
}

export function getColorForDealQuality(quality: string): string {
  switch (quality) {
    case 'excellent':
      return 'text-success';
    case 'good':
      return 'text-success-light';
    case 'fair':
      return 'text-yellow-500';
    case 'poor':
      return 'text-destructive';
    default:
      return 'text-muted-foreground';
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export async function chromeStorageGet<T>(key: string): Promise<T | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      resolve(result[key] || null);
    });
  });
}

export async function chromeStorageSet(key: string, value: any): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, () => {
      resolve();
    });
  });
}

export async function chromeStorageRemove(key: string): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.remove([key], () => {
      resolve();
    });
  });
}
