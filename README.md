# Credence

> **AI-Assisted Wealth Management Platform for Investors and Financial Advisors**

Credence is a modern wealth management platform designed to bridge the gap between investors and financial advisors through transparency, explainable intelligence, and personalized financial planning.

Unlike conventional investment platforms that focus solely on portfolio management, Credence combines investor onboarding, advisor matching, portfolio analysis, financial planning, AI-assisted insights, and regulatory transparency into a single experience.

The platform emphasizes **human-centric financial decision making**, where deterministic business rules remain the source of truth while AI acts only as an explainable assistant.

---

# Project Overview

Credence provides separate experiences for **Investors** and **Financial Advisors**, enabling both sides to collaborate through a secure and transparent ecosystem.

The application helps users:

- Understand their financial goals
- Discover suitable financial advisors
- Monitor portfolio health
- Detect risk mismatches
- Simulate investment scenarios
- Track life events affecting investments
- Receive AI-assisted explanations without replacing human judgement

The application follows an explainable-AI approach where every recommendation remains transparent and auditable.

---

# Key Features

## Investor Experience

### Goal-Based Investor Onboarding

Interactive onboarding collects:

- Financial goals
- Investment horizon
- Risk tolerance
- Investment preferences
- Investor profile

---

### Personalized Investment Recommendations

Generate recommendations based on:

- Risk profile
- Investment objectives
- Portfolio allocation
- Financial preferences

Recommendations are designed to be explainable rather than opaque.

---

### Portfolio Management

Manage investment portfolios through:

- Portfolio overview
- Asset allocation
- Performance tracking
- Investment distribution
- Portfolio health analysis

---

### Portfolio Health Score

Evaluate portfolio quality using multiple factors including:

- Diversification
- Risk distribution
- Allocation balance
- Investment concentration

---

### Risk Radar

Continuously monitors portfolio risk by identifying:

- Risk mismatches
- Overexposure
- Portfolio imbalance
- Suggested review areas

---

### Risk Mismatch Detection

Detects situations where an investor's actual portfolio no longer aligns with their declared risk appetite.

---

### Spending Analysis

Analyze spending behaviour through:

- Spending categories
- Expense trends
- Historical patterns
- Financial behaviour insights

---

### What-If Simulator

Simulate investment scenarios before making decisions.

Examples include:

- Different allocation strategies
- Portfolio changes
- Goal impact analysis

---

### SIP Management

Manage systematic investment plans with dedicated tracking and planning tools.

---

### Life Event Alerts

Supports financial planning around major life events such as:

- Marriage
- Career changes
- Education
- Retirement planning

---

### Credit Dashboard

Dedicated financial overview related to credit information and financial status.

---

### Activity Tracking

Monitor user activity and investment history.

---

### Calendar

Financial planning calendar for upcoming investment-related events and reminders.

---

### Account & Settings

Users can manage:

- Personal profile
- Account settings
- Preferences
- Theme settings

---

# Financial Advisor Experience

Credence includes a dedicated advisor dashboard with tools for client engagement.

Features include:

- Advisor dashboard
- Client summaries
- Portfolio reviews
- Compatibility analysis
- Investor matching
- Attention-area highlights
- Advisor cards
- Client recommendations

---

# AI-Assisted Intelligence

One of the primary goals of Credence is responsible AI integration.

Instead of replacing financial advisors, AI acts as an intelligent assistant.

Current AI capabilities include:

### Spending Predictor Agent

Analyzes historical spending behaviour to identify:

- Spending trends
- Expense categories
- Behavioural changes
- Spending anomalies

---

### Advisor Dashboard Assistant

Assists advisors by generating:

- Client summaries
- Discussion points
- Priority areas
- Professional explanations

---

### AI Assistance Layer

The project contains a modular AI architecture including:

- AI Agent Manager
- AI Assistance Selector
- Hugging Face Integration
- Kiro Integration
- Web Scraping Agent
- Response Enhancer

The AI layer is intentionally isolated from deterministic business logic.

---

# Responsible AI Principles

Credence follows strict AI safety principles.

AI **does not**:

- Execute trades
- Make investment decisions
- Calculate risk scores
- Replace financial advisors
- Trigger financial actions
- Produce guaranteed financial advice

Instead, AI provides:

- Explanations
- Narrative summaries
- Educational assistance
- Professional insights

This ensures every important financial decision remains transparent and auditable.

---

# Transparency & Compliance

The platform emphasizes financial transparency through:

- Explainable recommendations
- Disclosure pages
- Policy guidance
- Regulatory information
- Conflict-of-interest awareness
- Investor education

---

# Authentication & Access Control

The application supports:

- Secure authentication
- Protected routes
- Role-based authorization

Supported roles include:

- Investor
- Financial Advisor

Each role receives a dedicated application experience.

---

# Application Modules

The project contains dedicated modules for:

- Investor Dashboard
- Advisor Dashboard
- Portfolio Manager
- Investment Recommendations
- Credit Dashboard
- Policy Assistant
- Taxation Assistant
- Help Center
- Account Management
- Calendar
- Settings
- Activity Tracking
- Advisor Marketplace

---

# Technology Stack

### Frontend

- React 18
- Vite
- React Router
- Zustand
- Tailwind CSS
- Lucide Icons
- Recharts
- React Big Calendar

### Backend Services

- Supabase Authentication
- Supabase Database

### AI Integration

- Google Generative AI
- Hugging Face Inference API
- Modular AI Agent Architecture

---

# State Management

Global application state is managed using Zustand stores including:

- Authentication
- Dashboard
- Portfolio
- Sidebar
- Theme

This provides lightweight and scalable state management across the application.

---

# Project Structure

```
src/
│
├── components/
│   ├── Investor Features
│   ├── Advisor Features
│   ├── Portfolio Components
│   ├── Risk Analysis
│   ├── Authentication
│   └── UI Components
│
├── store/
│   ├── Authentication Store
│   ├── Dashboard Store
│   ├── Portfolio Store
│   ├── Sidebar Store
│   └── Theme Store
│
├── utils/
│   ├── AI Agents
│   ├── AI Assistance Layer
│   ├── Spending Predictor
│   ├── Advisor Assistant
│   ├── Web Scraping
│   └── Database Seeder
│
├── lib/
│   └── Supabase Configuration
│
└── data/
    ├── Advisor Data
    └── Investor Profiles
```

---

# Design Highlights

- Modern glassmorphism-inspired interface
- Responsive layout
- Dark mode support
- Interactive dashboards
- Data visualization
- Explainable financial insights
- Modular architecture

---

# Future Scope

Potential enhancements include:

- Real-time portfolio synchronization
- Live market integration
- Automated portfolio rebalancing suggestions
- Goal tracking analytics
- Mobile application
- Notification system
- Advisor appointment scheduling
- Multi-language support
- Advanced financial forecasting

---

# Why Credence?

Credence is built around three core principles:

- **Trust** through transparency
- **Intelligence** through explainable AI
- **Collaboration** between investors and advisors

Rather than replacing financial expertise, the platform augments it with responsible AI assistance and modern financial tools.

---

# License

This project is intended for educational, research, and demonstration purposes unless otherwise specified by the repository owner.
