# Subscription Tracker

A personal subscription management tool that helps users understand recurring digital expenses and optimize financial planning with clear analytics and data visualization.

## Tech Stack

### Frontend

- Vite + React (TypeScript)
- Bun as the package manager and runtime

### Styling

- Vanilla CSS with CSS variables
- Design direction: Modern-Tech + Minimal-Pro
- Visual principles:
  - Avoid typical AI-style purple gradients
  - Use refined dark-gray tones, subtle borders, and soft shadows
  - Emphasize high-quality typography
- Framer Motion for subtle UI feedback animations

### Backend / Database

- Supabase for authentication and PostgreSQL data storage

### Charts

- Recharts for responsive, declarative visualizations

## Feature Specifications

### 1. Authentication

- Email-based sign up and sign in
- User isolation so each account can only access its own subscriptions

### 2. Subscription Management

- Full CRUD for subscription items
- Data model fields:
  - Name
  - Category
  - Price
  - Currency (multi-currency input)
  - Cycle (monthly, yearly)
  - Start Date
  - Next Billing Date (auto-calculated)
  - Status (active/inactive)
- Next Billing Date logic:
  - Calculated from Start Date and Cycle
  - When current date passes the billing date, the system rolls it forward automatically

### 3. Analytics & Visualization

- Real-time exchange rate conversion into a primary currency (e.g., TWD)
- Monthly spend by category (Pie/Donut)
- Monthly spend trend (Bar/Line)
- KPI cards:
  - Total subscriptions
  - Average monthly spend
  - Estimated yearly spend

## UI/UX Enhancements

### Phase 1 (P1)

- Renewal alerts for subscriptions due within 5 days
- Multi-currency input with automatic conversion
- Modern-tech UI:
  - Grid-based layout and responsive cards
  - Tech-oriented fonts (e.g., Inter, Roboto Mono)
  - Subtle motion for hover and entrance effects

### Phase 2 (P2)

- Light/Dark mode toggle (default to dark, tech style)
- Data export (CSV/JSON)

## Verification Plan

### Automated Testing

- Jest/Vitest for component and logic unit tests
- Playwright for end-to-end flows (auth, CRUD, charts)

### Manual Testing

- Responsive checks via Chrome DevTools for phone, tablet, and desktop
- Data accuracy checks across different billing cycles

## Development

- Install dependencies: `bun install`
- Start dev server: `bun dev`
- Build for production: `bun run build`
- Preview build: `bun run preview`
