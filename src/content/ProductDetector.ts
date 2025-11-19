import { ProductDetection } from '@/types';

export class ProductDetector {
  private readonly dealerPatterns = {
    'apmex.com': {
      nameSelector: 'h1.product-title, h1[itemprop="name"]',
      priceSelector: '.product-price, [itemprop="price"]',
      skuSelector: '[itemprop="sku"], .product-sku',
      imageSelector: '.product-image img, [itemprop="image"]',
    },
    'jmbullion.com': {
      nameSelector: 'h1.product-name, .product-title',
      priceSelector: '.price, .product-price',
      skuSelector: '.sku, .product-sku',
      imageSelector: '.product-image img',
    },
    'sdbullion.com': {
      nameSelector: 'h1.product-name',
      priceSelector: '.price-box .price',
      skuSelector: '.product-sku',
      imageSelector: '.product-image-container img',
    },
    // Add more dealer patterns as needed
  };

  detectProduct(): ProductDetection | null {
    const hostname = window.location.hostname;
    const dealer = this.identifyDealer(hostname);

    if (!dealer) {
      return null;
    }

    try {
      const productName = this.extractProductName(dealer);
      const price = this.extractPrice(dealer);

      if (!productName || !price) {
        return null;
      }

      // Determine if this is a precious metals product
      const isPreciousMetal = this.isPreciousMetalProduct(productName);
      if (!isPreciousMetal) {
        return null;
      }

      return {
        product: null, // Will be matched against database
        confidence: 0.8,
        detected_price: price,
        dealer_info: {
          name: dealer,
          url: window.location.href,
        },
      };
    } catch (error) {
      console.error('Error detecting product:', error);
      return null;
    }
  }

  private identifyDealer(hostname: string): string | null {
    for (const dealer of Object.keys(this.dealerPatterns)) {
      if (hostname.includes(dealer)) {
        return dealer;
      }
    }
    return null;
  }

  private extractProductName(dealer: string): string | null {
    const pattern = this.dealerPatterns[dealer as keyof typeof this.dealerPatterns];
    if (!pattern) return null;

    const element = document.querySelector(pattern.nameSelector);
    return element?.textContent?.trim() || null;
  }

  private extractPrice(dealer: string): number | null {
    const pattern = this.dealerPatterns[dealer as keyof typeof this.dealerPatterns];
    if (!pattern) return null;

    const element = document.querySelector(pattern.priceSelector);
    const priceText = element?.textContent?.trim() || '';

    // Extract number from price string (e.g., "$1,234.56" -> 1234.56)
    const match = priceText.match(/[\d,]+\.?\d*/);
    if (!match) return null;

    const price = parseFloat(match[0].replace(/,/g, ''));
    return isNaN(price) ? null : price;
  }

  // Reserved for future use - SKU extraction
  // private extractSKU(dealer: string): string | null {
  //   const pattern = this.dealerPatterns[dealer as keyof typeof this.dealerPatterns];
  //   if (!pattern) return null;
  //   const element = document.querySelector(pattern.skuSelector);
  //   return element?.textContent?.trim() || null;
  // }

  private isPreciousMetalProduct(productName: string): boolean {
    const keywords = [
      'gold', 'silver', 'platinum', 'palladium',
      'coin', 'bar', 'round', 'bullion',
      'oz', 'ounce', 'gram', 'kilo',
      'eagle', 'maple', 'krugerrand', 'buffalo', 'britannia',
    ];

    const lowerName = productName.toLowerCase();
    return keywords.some(keyword => lowerName.includes(keyword));
  }

  isProductPage(): boolean {
    // Check if current page is likely a product page
    const url = window.location.pathname;
    const hasProductIndicator = /\/(product|item|p|buy)\//.test(url);

    // Also check for common product page elements
    const hasProductElements = !!(
      document.querySelector('h1.product-title, h1[itemprop="name"], .product-name') &&
      document.querySelector('.product-price, [itemprop="price"], .price')
    );

    return hasProductIndicator || hasProductElements;
  }
}
