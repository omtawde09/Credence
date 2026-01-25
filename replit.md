# Credence Wealth Management

## Overview
A React-based wealth management application built with Vite. It includes features for financial dashboards, credit management, policy agents, and taxation tools. The application uses Firebase for authentication and backend services, and Gemini AI for intelligent features.

## Tech Stack
- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand
- **3D Rendering**: Three.js with React Three Fiber
- **Backend Services**: Firebase (Auth, Firestore)
- **AI Integration**: Google Gemini AI

## Project Structure
```
src/
├── App.jsx              # Main app with routing
├── Layout.tsx           # Layout wrapper with NavBar and AuthModal
├── main.jsx             # Entry point
├── index.css            # Global styles with Tailwind
├── firebase.js          # Firebase configuration
├── components/          # React components
│   ├── ui/              # shadcn/ui components (card, chart)
│   ├── dashbord/        # Dashboard-specific components
│   ├── Dashboard.jsx    # Main dashboard
│   ├── CreditPage.jsx   # Credit management
│   ├── PolicyPage.jsx   # Policy agent
│   ├── TaxationPage.jsx # Taxation tools
│   ├── Agents.jsx       # AI agents interface
│   └── ...
├── store/               # Zustand stores
│   ├── useAuthStore.js  # Authentication state
│   └── useSidebarStore.js
└── lib/
    └── utils.ts         # Utility functions (cn helper)
```

## Development
- **Dev Server**: `npm run dev` - Runs on port 5000
- **Build**: `npm run build` - Creates production build
- **Preview**: `npm run preview` - Preview production build

## Environment Variables
The application uses the following environment variables (configured in `.env`):
- `VITE_FIREBASE_*` - Firebase configuration
- `VITE_GEMINI_API_KEY` - Google Gemini AI API key

## Recent Changes
- 2026-01-25: Initial Replit environment setup
  - Fixed case sensitivity issue with Components folder (renamed to lowercase)
  - Configured Vite to use port 5000 and allow all hosts for Replit proxy
  - Updated tsconfig.json with proper JSX and module settings
