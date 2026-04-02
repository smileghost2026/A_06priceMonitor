# ⚡ PriceMonitor - 경쟁사 가격 모니터링 대시보드

Real-time competitor & product price tracking dashboard for Korean e-commerce.

## Features

- **Dashboard** — Overview with price change summary, alerts count, tracked products
- **Product List** — Tracked products with current price, sparkline, % change, badges
- **Add Product Modal** — Add products with name, URL, competitor, target price, category
- **Price History Chart** — Line charts showing price trends over 30 days (Chart.js)
- **Price Alerts** — Visual alerts for price drops, increases, and target price hits
- **Competitor Comparison** — Side-by-side price comparison with "Best Price" highlight
- **Categories** — Electronics, Fashion, Food, Cosmetics, Home & Living, Sports, Books

## Sample Data

15 pre-loaded products across Korean e-commerce platforms:
- **Coupang**, **Naver Shopping**, **11번가**, **Musinsa**, **Zigzag**, **Lotte ON**, **Himart**, **Olive Young**, **Market Kurly**

Products include iPhone 15 Pro, Samsung QLED TV, Nike Air Max 90, Dyson V15, Sulwhasoo serum, and more.

## Tech Stack

- Vanilla HTML / CSS / JavaScript
- Chart.js (CDN)
- localStorage persistence
- Dark SaaS theme (DataDog/Grafana inspired)
- Responsive design

## Usage

Open `index.html` in a browser. No build step required.

## Files

| File | Description |
|------|-------------|
| `index.html` | Main HTML structure with sidebar, views, modals |
| `style.css` | Dark theme styles, responsive layout |
| `app.js` | Application logic, sample data, Chart.js integration |
