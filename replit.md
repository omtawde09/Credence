# Credence Wealth Management

## Overview
A React-based wealth management application built with Vite for the hackathon: "Intelligent Platform for Advisor & Investor Journey Management". Features intelligent financial dashboards, credit management, policy agents, taxation tools, and an Advisor Dashboard with AI-powered journey intelligence.

## Tech Stack
- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand
- **Authentication**: Google OAuth (Google Identity Services)
- **AI Integration**: Google Gemini AI

## Key Intelligent Features (Hackathon Demo)

### 1. Explainable Investment Recommendations
- Transparent suitability reasoning based on investor goals, time horizon, and risk tolerance
- Collapsible "What could go wrong?" section with best/worst case scenarios
- Professional regulatory tone

### 2. Advisor-Investor Compatibility Score
- Calculated match percentage based on risk philosophy, expertise alignment, and experience
- Contributing factors breakdown
- Non-gamified, calm presentation

### 3. Life-Event Triggered Re-Planning
- Detects life events: Marriage, Job Change, First Child, Home Purchase
- Shows impacted assumptions and recommended next steps
- Review acknowledgment workflow

### 4. Risk Mismatch Detection
- Compares stated vs actual portfolio risk scores
- Visual deviation indicator
- Suggested rebalancing actions

### 5. Transparency & Conflict Disclosure
- Advisor compensation model disclosure
- Fee impact explanations
- SEBI-compliant regulatory statements

### 6. Advisor Copilot Client Summary
- Auto-generated client briefing paragraphs
- Alert badges for risk mismatches and pending events
- Copy-to-clipboard functionality

## Project Structure
```
src/
├── App.jsx              # Main app with routing
├── Layout.tsx           # Layout wrapper with NavBar and AuthModal
├── main.jsx             # Entry point
├── index.css            # Global styles with Tailwind
├── components/          # React components
│   ├── ui/              # shadcn/ui components
│   ├── dashbord/        # Dashboard-specific components
│   ├── Dashboard.jsx    # Main dashboard
│   ├── CreditPage.jsx   # Credit management
│   ├── PolicyPage.jsx   # Policy agent with AI recommendations
│   ├── TaxationPage.jsx # Taxation tools with AI chatbot
│   ├── Agents.jsx       # AI agents interface
│   ├── AdvisorDashboard.jsx # Intelligent journey management
│   ├── InvestmentExplainer.jsx # Feature 1
│   ├── AdvisorCompatibility.jsx # Feature 2
│   ├── LifeEventAlert.jsx # Feature 3
│   ├── RiskMismatchAlert.jsx # Feature 4
│   ├── TransparencyDisclosure.jsx # Feature 5
│   ├── ClientSummary.jsx # Feature 6
│   └── ...
├── data/
│   └── investorProfile.js # Mock data and business logic
├── store/               # Zustand stores
│   ├── useAuthStore.js  # Authentication state (Google OAuth)
│   └── useSidebarStore.js
└── lib/
    └── utils.ts         # Utility functions
```

## Development
- **Dev Server**: `npm run dev` - Runs on port 5000
- **Build**: `npm run build` - Creates production build
- **Preview**: `npm run preview` - Preview production build

## Environment Variables
- `VITE_GEMINI_API_KEY` - Google Gemini AI API key
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret (stored securely)
- Google OAuth Client ID is configured in AuthModal.jsx

## Routes
### Core Hackathon Features
- `/` - Landing page explaining the platform for judges
- `/investor-onboarding` - Interactive 5-step investor journey (goals, priority, time horizon, risk scenarios, preferences)
- `/investor-recommendations` - Personalized investment recommendations with explainability
- `/advisor-dashboard` - Advisor portal with client management and intelligent alerts (all 6 features)
- `/dashboard` - Main financial dashboard

### Supporting Pages
- `/account` - User profile
- `/help` - Help center
- `/settings` - App settings

## Recent Changes
- 2026-01-25: Redesigned UI color scheme
  - Replaced green/orange palette with modern blue/indigo/teal
  - Primary buttons use blue-to-indigo gradient
  - Hero cards use slate-to-indigo gradient
  - Accents and highlights use teal
  - Charts use teal line color
- 2026-01-25: Removed subscription/cashback features
- 2026-01-25: Added 6 intelligent features for hackathon demo
  - Explainable Investment Recommendations
  - Advisor-Investor Compatibility Score
  - Life-Event Triggered Re-Planning
  - Risk Mismatch Detection
  - Transparency & Conflict Disclosure
  - Advisor Copilot Client Summary
- 2026-01-25: Created Advisor Dashboard page
- 2026-01-25: Added navigation pages (Account, Activity, Calendar, Manage, Help, Settings)
- 2026-01-25: Replaced Firebase auth with Google OAuth
- 2026-01-25: Fixed Vite configuration for Replit environment
