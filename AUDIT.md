# UI & Responsiveness Audit — NextProperty

This document lists the concrete issues found page-by-page across the NextProperty application, detailing token misalignments, theme consistency issues, and responsiveness gaps.

---

## 1. Shared Public Layout & Components

### Global Header (`Header.jsx`, `Navbar.jsx`)
- **Theme Clash**: The shared Header is in a light theme (`bg-white/70` backdrop, dark text, light shadow) which is rendered on public pages, clashing with the dark, futuristic theme of the landing site.
- **Dynamic Routing Theme**: The header does not check whether it is rendering on a public marketing page versus an admin panel route.
- **Unread notification badges**: Notification badge animation and drop-down card styling uses light gray borders, which clash with public theme dark panels.

### Footer (`Footer.jsx`)
- **Responsive Layout**: Column alignments on mobile viewports (<640px) stack awkwardly with unequal padding.

---

## 2. Public / Marketing Pages (Dark, Futuristic Theme)

### Homepage Hero & Search Console (`DreamProp.jsx`, `NodesAnimation.jsx`)
- **Leftover debug text**: In `NodesAnimation.jsx`, the canvas context renders coordinate text prefixed with `SYS_NODE: [...]` under the user's cursor, which looks like leftover debug copy.
- **Interactive Focus States**: Form elements (location text input, dropdown wrappers) lack clear keyboard outline/focus rings.
- **Button Tokens**: The CTA button uses inline custom gradients rather than matching a site-wide primary button token.

### Explore specialized tools (`Explore.jsx`)
- **Grid Layout**: Grid columns do not scale gracefully below 1024px, causing cramped text cards.
- **Mixed Icons**: Mixes icons from both `lucide-react` and `@tabler/icons-react` libraries.
- **Card Anatomy**: Border radius is `rounded-2xl` on cards, but doesn't align with buttons elsewhere.

### Property Finder (`PostedProperty.jsx`, `PropertyCard.jsx`)
- **Theme Clash**: The property listings page body uses a light theme (`bg-slate-50`, white cards, grey borders), which contradicts the public dark marketing theme.
- **Card Anatomy**: The property cards look completely different from the search results page listings (different heights, details formatting, and lack of hover elevation continuity).
- **Placeholder fallbacks**: Missing property photos default to a generic text placeholder URL `https://via.placeholder.com/400`.

### Smart Build Calculator (`Smartbuild.jsx` & components)
- **Theme Clash**: Page base background is `bg-white` and text is `text-slate-900`, clashing with the dark marketing theme.
- **Arbitrary Spacing**: Uses arbitrary vertical spacing like `space-y-25` and `space-y-24` instead of standard 8px grid tokens.
- **Inconsistent Card layout**: Builder profiles and calculator layout cards use white backgrounds and hardcoded borders.

### Auction Bidding Console (`AuctionListingPage.jsx`, `AuctionDetail.jsx`)
- **Theme Clash**: Page matches light theme layouts (`bg-slate-50/50`) instead of public dark theme.
- **Status Pills**: Status colors for auction items (e.g., Ended, Ending Soon) use inline background overrides instead of site-wide badges.

### GIS Map & Plot Finder (`Map.jsx`, `PlotDetail.jsx`)
- **Map Tile Theme**: Map container renders CartoDB's Light Voyager tiles (`light_all`) instead of dark theme tiles (`dark_all`) which would match the futuristic design language.
- **Sidebar & Filters**: The sliding list panel uses bright white background styles.

---

## 3. Admin Panel (Light Theme)

### Sidebar Navigation (`AdminDashboard.jsx`)
- **Responsive Collapse**: Sidebar collapses to icons but remains visible on mobile viewports (<1024px), causing horizontal page overflow. It must convert to an off-canvas drawer with an overlay on tablet/mobile.

### Summary Panels & Tables
- **Responsive Columns**: Grid layout columns for summary cards do not scale to 1 column on mobile.
- **Data Table Layout**: Large tables containing 5+ columns (e.g. Users List, TrustDeeds) overflow screen bounds. Below md (768px), these must stack into card layouts.
- **Mismatched badges**: "Completed" status pills inside live operations and deed requests use varying tailwind border and text colors.

---

## 4. Consistent Token Proposals

### Dark Theme Tokens (Public Pages)
- **Background**: `bg-slate-950` / `bg-[#030712]`
- **Text**: `text-slate-100` (primary), `text-slate-400` (secondary), text gradient for headlines (`from-blue-400 to-indigo-400`).
- **Cards**: `bg-slate-900/60 border border-slate-800/80 backdrop-blur-md`
- **Border Radius**: `rounded-xl` (8px) for buttons/inputs, `rounded-2xl` (12px) or `rounded-3xl` (24px) for cards.

### Light Theme Tokens (Admin Panel)
- **Background**: `bg-slate-50`
- **Text**: `text-slate-900` (primary), `text-slate-500` (secondary)
- **Cards**: `bg-white border border-slate-150 shadow-sm`
- **Border Radius**: `rounded-xl` (8px) for buttons/inputs, `rounded-2xl` (12px) for cards.

### Shared Tokens
- **Font Scale**: `text-xs` (12px), `text-sm` (14px), `text-base` (16px), `text-lg` (18px), `text-xl` (20px), `text-2xl` (24px), `text-3xl` (30px), `text-4xl` (36px).
- **Spacing Grid**: Multiples of 8px (`p-2`, `p-4`, `p-6`, `p-8` / `gap-2`, `gap-4`, `gap-6`, `gap-8` / `space-y-4`, `space-y-8`, `space-y-12`).
- **Icon Set**: `lucide-react` (dominant, cleanest integration).
