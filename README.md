# GoldStackr Chrome Extension

A sophisticated Chrome extension for precious metals investors and collectors that provides real-time price intelligence by overlaying live market data and dealer comparisons directly onto product pages across major precious metals retailers.

## Features

### 🥇 Live Price Overlays
- Automatic detection of gold and silver products on supported dealer websites
- Instant price comparison data overlaid on product pages
- Side-by-side dealer analysis with premium calculations

### 📊 Extension Popup Dashboard
- Current spot prices for gold, silver, platinum, and palladium
- Trending deals across multiple dealers
- Personalized watchlist items
- Quick access to price alerts and historical data

### 🔔 Smart Notifications
- Proactive alerts for price drops and inventory changes
- Exceptional deal notifications based on user preferences
- Watchlist target price alerts

### 💎 Price Intelligence
- Comprehensive dealer comparisons showing premiums, shipping costs, and total value
- Historical price tracking with visual charts
- Deal quality scoring (excellent, good, fair, poor)
- Real-time data from 15,000+ precious metals products

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Tailwind CSS + Shadcn UI
- **State Management**: Zustand + React Query
- **Backend**: Supabase (PostgreSQL)
- **Extension API**: Chrome Manifest V3

## Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Chrome browser (version 88+)
- Supabase account (for backend)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/goldstackr-mvp.git
   cd goldstackr-mvp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Set up Supabase database**

   In your Supabase project, run the SQL schema found in `src/lib/supabase.ts` to create the necessary tables:
   - products
   - dealers
   - prices
   - watchlist
   - price_alerts
   - price_history

5. **Generate extension icons**

   Follow instructions in `public/icons/README.md` to generate required icon files.

6. **Build the extension**
   ```bash
   npm run build
   ```

7. **Load extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder from this project

### Development Mode

Run the development server with hot reload:
```bash
npm run dev
```

After making changes, rebuild and reload the extension in Chrome.

## Project Structure

```
goldstackr-mvp/
├── src/
│   ├── popup/              # Extension popup interface
│   │   ├── Popup.tsx       # Main popup component
│   │   └── index.tsx       # Popup entry point
│   ├── content/            # Content scripts
│   │   ├── index.tsx       # Content script entry
│   │   ├── ProductDetector.ts  # Product detection logic
│   │   └── PriceOverlay.tsx    # Price overlay component
│   ├── background/         # Background service worker
│   │   └── index.ts        # Background script
│   ├── components/         # Shared React components
│   │   ├── ui/            # Shadcn UI components
│   │   ├── SpotPriceCard.tsx
│   │   ├── WatchlistItem.tsx
│   │   └── TrendingDeals.tsx
│   ├── lib/               # Utilities and helpers
│   │   ├── supabase.ts    # Supabase client
│   │   └── utils.ts       # Utility functions
│   ├── store/             # Zustand stores
│   │   ├── useSpotPriceStore.ts
│   │   ├── useWatchlistStore.ts
│   │   └── usePreferencesStore.ts
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   └── index.css          # Global styles
├── public/
│   ├── manifest.json      # Chrome extension manifest
│   └── icons/             # Extension icons
├── popup.html             # Popup HTML file
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json
```

## Supported Dealers

The extension currently supports product detection on:
- APMEX (apmex.com)
- JM Bullion (jmbullion.com)
- SD Bullion (sdbullion.com)
- Provident Metals (providentmetals.com)
- BGASC (bgasc.com)
- Monument Metals (monumentmetals.com)
- Golden Eagle Coins (goldeneaglecoin.com)

## Usage

### Browsing Products
1. Visit any supported dealer website
2. Navigate to a gold or silver product page
3. The extension will automatically detect the product and display a price comparison overlay
4. View competing prices from other dealers
5. Click "Add to Watchlist" to track the product

### Using the Dashboard
1. Click the GoldStackr extension icon in your browser toolbar
2. View current spot prices for precious metals
3. Check your watchlist for price updates
4. Browse trending deals across all dealers
5. Adjust settings and preferences

### Setting Price Alerts
1. Add products to your watchlist
2. Set a target price for notifications
3. Enable price drop alerts in settings
4. Receive browser notifications when prices drop

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Building for Production

```bash
npm run build
```

The built extension will be in the `dist/` folder, ready to be loaded into Chrome or packaged for distribution.

### Publishing to Chrome Web Store

1. Create a ZIP file of the `dist/` folder
2. Visit [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
3. Upload the ZIP file
4. Fill out the required store listing information
5. Submit for review

## Database Schema

### Products Table
- id (UUID, Primary Key)
- sku (Text, Unique)
- name (Text)
- weight (Decimal)
- purity (Decimal)
- category (gold | silver | platinum | palladium)
- type (coin | bar | round)
- images (Text Array)
- specifications (JSONB)
- created_at, updated_at (Timestamp)

### Dealers Table
- id (UUID, Primary Key)
- name (Text, Unique)
- website (Text)
- logo (Text)
- rating, review_count (Numeric)
- shipping_policy (Text)
- payment_methods (Text Array)
- contact_email, contact_phone (Text)
- trust_score (Decimal)
- created_at, updated_at (Timestamp)

### Prices Table
- id (UUID, Primary Key)
- product_id (UUID, Foreign Key)
- dealer_id (UUID, Foreign Key)
- price (Decimal)
- premium_percent (Decimal)
- in_stock (Boolean)
- quantity_available (Integer)
- shipping_cost (Decimal)
- total_cost (Decimal, Computed)
- last_updated (Timestamp)

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: support@goldstackr.com (placeholder)
- Documentation: [Link to docs]

## Roadmap

### Phase 1 (Current)
- [x] Basic extension structure
- [x] Product detection on major dealers
- [x] Price comparison overlay
- [x] Popup dashboard with spot prices
- [x] Watchlist functionality

### Phase 2 (Planned)
- [ ] Historical price charts
- [ ] Advanced filtering and sorting
- [ ] More dealer integrations
- [ ] User accounts and cloud sync
- [ ] Mobile companion app

### Phase 3 (Future)
- [ ] AI-powered deal recommendations
- [ ] Price prediction models
- [ ] Community features (reviews, ratings)
- [ ] API for third-party integrations

## Acknowledgments

- Built with [React](https://react.dev/)
- UI components from [Shadcn UI](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Backend powered by [Supabase](https://supabase.com/)

---

**Disclaimer**: This extension is for informational purposes only. Always verify prices and dealer information before making purchases. We are not responsible for pricing errors or transaction issues with third-party dealers.
