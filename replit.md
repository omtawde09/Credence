# Credence - Intelligent Advisor-Investor Journey Management

## Overview
A minimal, Zerodha-inspired investment platform that facilitates intelligent advisor-investor journey management with transparent, explainable investment recommendations.

## Tech Stack
- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Icons**: Lucide React

## Design Philosophy
- Light, minimal, content-first UI
- White/off-white backgrounds
- Typography-led hierarchy
- Clean sans-serif fonts (Inter)
- Subtle animations (fade-in, slide-up)
- No heavy gradients or decorative elements

## Project Structure
```
src/
├── App.jsx                    # Main app with 4-route structure
├── main.jsx                   # Entry point
├── index.css                  # Global styles with Tailwind
├── components/
│   └── pages/
│       ├── LandingPage.jsx       # Homepage (/)
│       ├── OnboardingPage.jsx    # Investor onboarding (/onboarding)
│       ├── RecommendationPage.jsx # Investment recommendations (/recommendation)
│       └── AdvisorDashboard.jsx   # Advisor dashboard (/advisor)
└── lib/
    └── utils.ts               # Utility functions
```

## Routes
| Path | Component | Description |
|------|-----------|-------------|
| `/` | LandingPage | Platform introduction with trust signals |
| `/onboarding` | OnboardingPage | 4-step investor profiling flow |
| `/recommendation` | RecommendationPage | Personalized investment recommendations with explainability |
| `/advisor` | AdvisorDashboard | Advisor client management dashboard |

## Development
- **Dev Server**: `npm run dev` - Runs on port 5000
- **Build**: `npm run build` - Creates production build

## Recent Changes
- 2026-01-25: Complete redesign to Zerodha-inspired minimal UI
  - Removed sidebar-based navigation
  - Implemented 4-route structure
  - Created clean landing page with trust signals
  - Added step-by-step investor onboarding flow
  - Built recommendation page with explainability sections
  - Designed advisor dashboard with client table and alerts
