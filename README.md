# TheAIHubX Monorepo

**Discover, compare, and master AI tools - Your complete learning hub**

This repository contains the full source code for TheAIHubX, featuring a modern React frontend, a scalable Node.js backend, and a Supabase database.

## Project Structure

```
.
├── frontend/       # React 18 + Vite Application (The UI)
├── backend/        # Node.js + Express Application (The API)
└── .github/        # CI/CD Workflows
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Frontend Setup

The frontend is a Glassmorphism-styled React app.

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to view the app.

### Backend Setup

The backend connects to Supabase to serve dynamic tool data.

```bash
cd backend
npm install
npm run dev
```

Visit `http://localhost:3000/api/tools` to check the API.

## Tech Stack

- **Frontend**: React, Vite, MUI, Framer Motion
- **Backend**: Express, Node.js
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Firebase (Frontend), Render (Backend)

## License
MIT
