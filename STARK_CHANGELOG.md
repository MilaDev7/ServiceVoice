# STARK Changelog — ServiceVoice (Frontend)

**Project:** Voice-First Government Service Navigator
**Team Role:** P1 — Frontend & Tech Lead
**Branch:** `frontend`
**Repo:** https://github.com/MilaDev7/ServiceVoice/


Frontend Scaffold

**Built:**
- Vite + React 19 project (`woreda/`)
- Tailwind CSS v3 configured
- React Router v7
- Folder structure: feature-based (chat, services, history, settings, dashboard, profile)
- Added: axios, lucide-react, clsx, tailwind-merge

**Commits:**
- `chore: initial frontend setup with Vite, React, Tailwind, Router`
- `chore: establish modular feature-based folder structure`

**Blockers:** Vite 8 is newer than expected — adjusted Tailwind config.

---

###  Routing + Design Tokens

**Built:**
- Router setup with 6 routes (`/`, `/chat/:id`, `/services`, `/dashboard`, `/profile`, `*`)
- Placeholder pages for each feature
- Tailwind custom tokens:
  - `primary` (green #16A34A) + dark/light variants
  - Semantic colors: `surface`, `page-bg`, `text-primary`, `text-secondary`, `border`
  - Chat bubbles: `user-bubble`, `bot-bubble`
  - Custom radii (card/pill/btn) + shadows
- Fonts: Inter + Noto Sans Ethiopic (Amharic)


###  Layout Shell

**Built:**
- `MainLayout` (Sidebar + Header + Main)
- Responsive sidebar with mobile drawer
- Header with language toggle, woreda selector, notifications, profile
- Hooks: `useMediaQuery`, `useLocalStorage`
- Route constants in `constants/routes.js`


### Chat Message Bubbles

**Built:**
- `UserMessage` (right, green bubble with checkmark)
- `BotMessage` (left, white card with shield icon)
- `ChatMessageList` (scrollable, auto-scrolls to bottom)
- Mock messages for testing


### Document Card

**Built:**
- `DocumentItem` (icon + title + description tile)
- `DocumentCard` (2-column grid of required documents)
- `REQUIRED DOCUMENTS` header (green, uppercase, tracked)
- CTA row: "See full process, fees & office locations"

###  Dependency Card ⭐ (Killer Feature)

**Built:**
- `DependencyTile` with 3 status states: Have / Need / Unsure
- Status colors: green / red / gray
- `DependencyCard` with voice prompt + CTA
- "You need these first" — shows prerequisites for a service



###  Quick Actions + Input Bar

**Built:**
- `QuickActions` (pills: Where to apply, Next steps, Fees)
- `ChatInput` with attachment, textarea, mic, send button
- Enter to send, Shift+Enter for newline
- Auto-resize textarea
- Focus ring, disabled state, placeholder


###  SMS Button + Feedback Modal

**Built:**
- SMS button on DocumentCard ("Send checklist via SMS")
- Reusable `Modal` component
- `FeedbackPrompt` modal with **voice AND text modes**
  - Accessibility: users with disabilities can choose their input method
  - ARIA roles: `tablist`, `tab`, `aria-selected`
  - Character counter (500 char limit)
- Anonymous by default


### Voice UI (Voxide Placeholder) ⭐

**Built:**
- `useVoiceRecorder` hook (mock — Voxide later)
- `VoiceFab` — floating mic button (bottom-right, big tap target)
- `VoiceOverlay` — full-screen voice recording UI
  - Animated waveform (custom Tailwind keyframe)
  - Live timer (0:00 → counting up)
  - Pulsing ring while recording
  - Live transcript appears after 1.5s
  - Big red stop button
  - Escape to cancel, ✕ to close
- Auto-inserts transcript into chat as user message


###  Public Dashboard

**Built:**
- `mockDashboard` data
- `StatCard` (KPI cards: Reports, Avg time, Extra fee, Extra doc)
- `BarRow` (reusable horizontal bar — no chart lib)
- `StatSection` (card wrapper)
- Full dashboard page with:
  - 4 KPI cards
  - Reports by Service (6 bars)
  - Reports by Woreda (3 bars)
  - Feedback Types (4 colored bars)
  - Privacy footer

### Day 11 — Profile + App-Wide Preferences

**Built:**
- `AppProvider` (Context) with language, woreda, theme, notifications
- `usePreferences` hook
- `ProfileSection`, `PreferenceRow` components
- Profile page with:
  - Anonymous user identity
  - Language toggle (አማ | OM | EN)
  - Woreda selector
  - Theme toggle (Light/Dark)
  - Notification preferences (voice, SMS, push)
  - Clear local data
- Wired Header language toggle to real state
- localStorage persistence


###  Dark Mode + Bug Fixes

**Built:**
- `darkMode: 'class'` in Tailwind
- CSS variables for all semantic tokens (`:root` + `.dark`)
- Dark variants for: Sidebar, Modal, FeedbackPrompt, ProfilePage,
  VoiceOverlay, StatCard, DependencyTile, DashboardPage
- Fixed: sidebar hover invisibility in dark mode

