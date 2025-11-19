/// <reference types="chrome"/>

import { ProductDetection } from '@/types';

class BackgroundService {
  private readonly ALARM_INTERVAL = 15; // minutes

  constructor() {
    this.init();
  }

  private init() {
    // Set up alarms for periodic price checks
    chrome.alarms.create('checkPrices', {
      periodInMinutes: this.ALARM_INTERVAL,
    });

    // Listen for alarms
    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === 'checkPrices') {
        this.checkPricesAndNotify();
      }
    });

    // Listen for messages from content scripts and popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep channel open for async response
    });

    // Listen for extension installation
    chrome.runtime.onInstalled.addListener((details) => {
      if (details.reason === 'install') {
        this.onInstall();
      } else if (details.reason === 'update') {
        this.onUpdate();
      }
    });

    // Initial price fetch
    this.updateSpotPrices();
  }

  private async handleMessage(
    message: any,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) {
    switch (message.action) {
      case 'productDetected':
        await this.handleProductDetection(message.data);
        sendResponse({ success: true });
        break;

      case 'addToWatchlist':
        await this.addToWatchlist(message.data);
        sendResponse({ success: true });
        break;

      case 'getSpotPrices':
        const prices = await this.getSpotPrices();
        sendResponse({ prices });
        break;

      case 'refreshData':
        await this.updateSpotPrices();
        sendResponse({ success: true });
        break;

      default:
        sendResponse({ error: 'Unknown action' });
    }
  }

  private async handleProductDetection(detection: ProductDetection) {
    console.log('Product detected:', detection);

    // In production, query Supabase to match product and get comparisons
    // For now, just log it
    try {
      // Store recent detection in chrome.storage
      const { recentDetections = [] } = await chrome.storage.local.get('recentDetections');
      recentDetections.unshift({
        ...detection,
        timestamp: new Date().toISOString(),
      });

      // Keep only last 50 detections
      await chrome.storage.local.set({
        recentDetections: recentDetections.slice(0, 50),
      });
    } catch (error) {
      console.error('Error storing product detection:', error);
    }
  }

  private async addToWatchlist(data: any) {
    console.log('Adding to watchlist:', data);

    try {
      const { watchlist = [] } = await chrome.storage.local.get('watchlist');
      watchlist.push({
        ...data,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      });

      await chrome.storage.local.set({ watchlist });
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  }

  private async updateSpotPrices() {
    try {
      // In production, fetch from real API or Supabase
      // For now, use mock data
      const mockPrices = [
        {
          metal: 'gold',
          price: 2045.30 + Math.random() * 20 - 10,
          change: Math.random() * 30 - 15,
          change_percent: Math.random() * 2 - 1,
          timestamp: new Date().toISOString(),
        },
        {
          metal: 'silver',
          price: 24.15 + Math.random() * 2 - 1,
          change: Math.random() * 1 - 0.5,
          change_percent: Math.random() * 3 - 1.5,
          timestamp: new Date().toISOString(),
        },
      ];

      await chrome.storage.local.set({ spotPrices: mockPrices });

      // Broadcast update to open popups
      chrome.runtime.sendMessage({
        action: 'spotPricesUpdated',
        data: mockPrices,
      });
    } catch (error) {
      console.error('Error updating spot prices:', error);
    }
  }

  private async getSpotPrices() {
    try {
      const { spotPrices = [] } = await chrome.storage.local.get('spotPrices');
      return spotPrices;
    } catch (error) {
      console.error('Error getting spot prices:', error);
      return [];
    }
  }

  private async checkPricesAndNotify() {
    console.log('Checking prices for notifications...');

    try {
      // Get watchlist items
      const { watchlist = [] } = await chrome.storage.local.get('watchlist');
      const { preferences } = await chrome.storage.local.get('preferences');

      if (!preferences?.notify_watchlist_drops) {
        return;
      }

      // In production, check each watchlist item against current prices
      // and send notifications if price drops below threshold
      for (const item of watchlist) {
        // Mock: randomly trigger notification for demo
        if (Math.random() < 0.1) {
          this.sendNotification({
            title: 'Price Drop Alert!',
            message: `${item.product?.name || 'Watchlist item'} is now $${(item.target_price * 0.95).toFixed(2)}`,
            iconUrl: 'icons/icon128.png',
          });
        }
      }
    } catch (error) {
      console.error('Error checking prices:', error);
    }
  }

  private sendNotification(options: {
    title: string;
    message: string;
    iconUrl: string;
  }) {
    chrome.notifications.create({
      type: 'basic',
      title: options.title,
      message: options.message,
      iconUrl: options.iconUrl,
      priority: 2,
    });
  }

  private async onInstall() {
    console.log('Extension installed!');

    // Set default preferences
    await chrome.storage.local.set({
      preferences: {
        theme: 'system',
        notify_exceptional_deals: true,
        notify_watchlist_drops: true,
        notify_back_in_stock: true,
        notification_threshold_percent: 5,
        preferred_dealers: [],
        auto_detect_products: true,
      },
    });

    // Open welcome page
    chrome.tabs.create({
      url: 'https://github.com/your-repo/goldstackr-extension',
    });
  }

  private async onUpdate() {
    console.log('Extension updated!');
    // Perform any migration tasks if needed
  }
}

// Initialize background service
new BackgroundService();
