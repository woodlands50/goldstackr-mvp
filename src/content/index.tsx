import React from 'react';
import ReactDOM from 'react-dom/client';
import { ProductDetector } from './ProductDetector';
import { PriceOverlay } from './PriceOverlay';
import '../index.css';

class ContentScript {
  private detector: ProductDetector;
  private overlayRoot: HTMLDivElement | null = null;
  private reactRoot: ReactDOM.Root | null = null;

  constructor() {
    this.detector = new ProductDetector();
    this.init();
  }

  private init() {
    // Wait for page to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.checkPage());
    } else {
      this.checkPage();
    }

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.action === 'checkProduct') {
        this.checkPage();
        sendResponse({ success: true });
      }
      return true;
    });
  }

  private checkPage() {
    // Only run on product pages
    if (!this.detector.isProductPage()) {
      return;
    }

    // Detect product after a short delay to ensure page is fully rendered
    setTimeout(() => {
      const detection = this.detector.detectProduct();

      if (detection && detection.detected_price > 0) {
        this.showOverlay(detection.detected_price, detection.dealer_info.name);

        // Notify background script about product detection
        chrome.runtime.sendMessage({
          action: 'productDetected',
          data: detection,
        });
      }
    }, 1000);
  }

  private showOverlay(price: number, dealerName: string) {
    // Remove existing overlay if present
    this.hideOverlay();

    // Create overlay container
    this.overlayRoot = document.createElement('div');
    this.overlayRoot.id = 'goldstackr-overlay-root';
    this.overlayRoot.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      z-index: 999999;
    `;

    document.body.appendChild(this.overlayRoot);

    // Render React overlay
    this.reactRoot = ReactDOM.createRoot(this.overlayRoot);
    this.reactRoot.render(
      <React.StrictMode>
        <PriceOverlay
          detectedPrice={price}
          dealerName={dealerName}
          onClose={() => this.hideOverlay()}
        />
      </React.StrictMode>
    );
  }

  private hideOverlay() {
    if (this.reactRoot) {
      this.reactRoot.unmount();
      this.reactRoot = null;
    }

    if (this.overlayRoot) {
      this.overlayRoot.remove();
      this.overlayRoot = null;
    }
  }
}

// Initialize content script
new ContentScript();
