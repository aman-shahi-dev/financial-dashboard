# Zorvyn Finance Dashboard

A professional financial dashboard built as a frontend internship assignment for Zorvyn Fintech. The app allows users to track and understand their financial activity through an intuitive, responsive interface.

---

## Live Demo

> [LIVE LINK](https://financial-dashboard-one-opal.vercel.app/dashboard)
---

## Screenshots

| Dashboard | Transactions | Insights | Settings |
|-----------|-------------|----------|----------|
| Summary cards, charts, recent transactions | Search, filter, sort, export | Monthly comparison, category breakdown | Theme, role, data controls |

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI library |
| Vite | Build tool and dev server |
| Redux Toolkit | Global state management |
| React Router v6 | Client-side routing |
| Framer Motion | Animations and transitions |
| Recharts | Data visualizations |
| Lucide React | Icon library |
| CSS Variables | Theming system (light/dark) |

---

## Features

### Core
- **Dashboard Overview** — Summary cards (Total Balance, Income, Expenses) with trend indicators, area chart for monthly balance trend, donut chart for spending breakdown by category
- **Transactions Page** — Full transaction list with search, filter by type and category, sort by date and amount, clear filters, and a live summary strip showing filtered totals
- **Insights Page** — Savings rate, top spending category, average monthly spend, month-over-month comparison, grouped bar chart, animated category breakdown bars, and smart text observations
- **Settings Page** — Theme switcher, role switcher, CSV/JSON export, clear all data, and project info

### Optional Enhancements (all implemented)
- Dark / light mode toggle with inverted theme (black bg in light mode, white bg in dark mode)
- localStorage persistence — transactions survive page refresh
- CSV and JSON export of filtered or full transaction data
- Framer Motion animations throughout — page transitions, staggered card entries, modal entrance/exit, sidebar collapse
- Role-based UI — Admin can add, edit, delete; Viewer gets read-only access
- Empty state handling on all data-dependent views
- Fully responsive — mobile sidebar overlay with hamburger, desktop collapsible sidebar

---

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Layout.jsx          # App shell — sidebar + navbar + outlet
│   │   ├── Sidebar.jsx         # Collapsible nav with Framer Motion
│   │   └── Navbar.jsx          # Sticky header with role switcher and theme toggle
│   ├── ui/
│   │   ├── SummaryCard.jsx     # Animated metric card with trend badge
│   │   ├── RoleBadge.jsx       # Admin / Viewer indicator pill
│   │   ├── ThemeToggle.jsx     # Animated sun/moon toggle button
│   │   ├── EmptyState.jsx      # Zero data fallback component
│   │   ├── Modal.jsx           # Add / edit transaction modal with validation
│   │   └── TransactionRow.jsx  # Single transaction row with RBAC actions
│   └── charts/
│       ├── BalanceTrendChart.jsx   # Recharts area chart
│       └── SpendingChart.jsx       # Recharts donut chart
├── pages/
│   ├── Dashboard.jsx       # Overview page
│   ├── Transactions.jsx    # Full transaction list with filters
│   ├── Insights.jsx        # Analytics and observations
│   └── Settings.jsx        # App configuration
├── store/
│   ├── index.js                # Redux store configuration
│   ├── transactionsSlice.js    # Transaction list, filters, localStorage sync
│   ├── authSlice.js            # Active role (Admin / Viewer)
│   ├── uiSlice.js              # Theme, modal state, sidebar state
│   └── insightsSlice.js        # Memoized selectors via createSelector
├── utils/
│   ├── mockData.js         # Seed transactions + category color map
│   ├── formatters.js       # Currency (INR), date, month formatters
│   ├── rbac.js             # Permission map + can() helper
│   └── exportUtils.js      # CSV and JSON download utilities
├── hooks/
│   └── useAppSelector.js   # Typed Redux selector and dispatch hooks
├── App.jsx                 # Router setup + theme sync to <html>
├── main.jsx                # React root + Redux Provider
└── index.css               # CSS variables for light/dark theming + Inter font
```

---

## State Management

The app uses four Redux slices:

- **transactionsSlice** — stores the transaction list, search query, category filter, type filter, and sort order. Every mutation (add, edit, delete) syncs to localStorage immediately inside the reducer.
- **authSlice** — stores the active role (`admin` or `viewer`). Role switching dispatches `setRole` from the navbar dropdown.
- **uiSlice** — stores theme, sidebar open state, modal open state, and the transaction being edited.
- **insightsSlice** — contains no reducers. It exports memoized selectors built with `createSelector` that derive analytics from the transactions list — total income, total expenses, net balance, savings rate, spending by category, monthly data, month-over-month change, and average monthly spend. These only recompute when transactions change.

---

## RBAC System

Roles and permissions are defined in `src/utils/rbac.js` as a plain object map:

```js
// Admin can: add, edit, delete, export
// Viewer can: export only (read-only)

can('admin', 'canAddTransaction')    // true
can('viewer', 'canAddTransaction')   // false
```

Components call `can(role, permission)` inline to conditionally render action buttons. No library, no complexity — just a single object lookup.

---

## Setup Instructions

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/zorvyn-dashboard.git
cd zorvyn-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy: Y
# - Which scope: your account
# - Link to existing project: N
# - Project name: zorvyn-dashboard
# - Directory: ./
# - Override settings: N
```

Or connect your GitHub repo directly at [vercel.com](https://vercel.com) and it deploys automatically on every push to `main`.

---

## Commit Convention

This project follows conventional commits so the history reads as a clear development log:

```
chore:    project setup, config, tooling
feat:     new feature or component
feat(scope): scoped feature (store, ui, pages, charts, layout)
style:    CSS and visual changes
refactor: code restructure without behaviour change
docs:     documentation
fix:      bug fix
```

---

## Known Limitations

- Trend percentages on summary cards (+2.4%, +8%, -5%) are currently static. The selector infrastructure to compute them dynamically from `selectMonthlyData` is already in place and connecting them would be a small addition.
- Mock data covers three months (Jan–Mar 2025). A production app would paginate and lazy-load transaction history.
- On screens narrower than 320px, summary card values may truncate — addressable with `clamp()` font sizing.

---

## What I Would Add With More Time

- Unit tests for Redux selectors and the `can()` RBAC utility using Vitest
- Skeleton loading states instead of empty states
- Date range picker for filtering transactions by custom period
- Animated number counters on summary cards (counting up from 0 on mount)
- PWA support for offline mobile use
- Multi-currency support with live exchange rates

---

## Author

Built by Aman Shahi as a frontend internship assignment for Zorvyn Fintech.

---
