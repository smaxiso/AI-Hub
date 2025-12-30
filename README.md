# TheAIHubX Monorepo

**Discover, compare, and master AI tools - Your complete learning hub**

A full-stack web application featuring a modern React frontend, scalable Node.js backend, and Supabase database. Includes a comprehensive admin dashboard with role-based access control (RBAC), user management, and real-time features.

## 🌐 Live Deployment

- **🚀 Live App:** [https://aihubx.web.app](https://aihubx.web.app)
- **🔧 Backend API:** [https://ai-hub-mu-one.vercel.app](https://ai-hub-mu-one.vercel.app)
- **👤 Admin Dashboard:** [https://aihubx.web.app/admin/login](https://aihubx.web.app/admin/login)

## 🌟 Features

### Public Features
- 🎨 **Glassmorphism Design** - Beautiful frosted glass effect with backdrop blur
- 📱 **Fully Responsive & PWA** - Installable "App-like" experience on mobile
- 🎓 **Learning Hub** - Integrated courses and quizzes to master AI
- 🔍 **Advanced Search & Filtering** - Find tools by name, description, or category
- 🎯 **Category Organization** - Tools organized by Chat, Image, Video, Coding, Audio, Agent, and more
- ✨ **New Badge** - Automatic "NEW" badge for tools added within 7 days
- 🗣️ **Community Contributions** - Suggest tools and provide feedback

### Admin Features
- 🔐 **Role-Based Access Control** - Owner, Admin, and Pending user roles
- 👥 **User Management** - Approve/reject/revoke user access
- 📬 **Community Suggestions** - Review and manage user-submitted content
- 📊 **Real-time Badge Updates** - Live pending user count
- 🔄 **Session Invalidation** - Auto-logout for revoked admins
- 🛠️ **Tool CRUD Operations** - Create, edit, and delete AI tools
- 📤 **Image Upload** - Direct Supabase storage integration
- 🎨 **Production-grade UX** - Custom dialogs and snackbar notifications
- 🔒 **Profile & Security** - Avatar upload, username management, password reset

## 📁 Project Structure

```
.
├── frontend/       # React 18 + Vite + Material-UI (The UI)
├── backend/        # Node.js + Express + Supabase (The API)
├── .github/        # CI/CD Workflows
└── README.md       # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Supabase account (for database and auth)

### Environment Setup

1. **Frontend** (`frontend/.env`):
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3000/api
```

2. **Backend** (`backend/.env`):
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key
PORT=3000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to view the app.

### Backend Setup

```bash
cd backend
npm install

# Run database setup scripts (first time only)
node scripts/setup-profiles.js
node scripts/setup-storage.js
node scripts/setup-avatars-storage.js
node scripts/update-schema-phase-7.js

# Create initial owner account
node scripts/create-owner.js

# Start the server
npm start
```

Visit `http://localhost:3000/api/tools` to check the API.

## 🗄️ Database Setup

The application uses Supabase with the following tables:

- **tools** - AI tool listings with metadata
- **profiles** - User profiles with roles (owner/admin/pending)

Storage buckets:
- **tool-logos** - Tool icon/logo images
- **avatars** - User profile avatars

## 🎭 User Roles

- **Owner** - Full access to all features, can manage users and approve admins
- **Admin** - Can manage tools (CRUD operations)
- **Pending** - New signups waiting for owner approval, cannot access admin features

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Material-UI (MUI)
- Framer Motion
- Supabase Auth Client

### Backend
- Node.js
- Express
- Supabase (PostgreSQL + Auth + Storage)
- JWT Authentication

### Deployment
- Frontend: Firebase / Vercel
- Backend: Vercel
- Database: Supabase Cloud

## 📚 API Endpoints

### Public
- `GET /api/tools` - List all tools

### Admin (Authenticated)
- `POST /api/tools` - Create a new tool
- `PUT /api/tools/:id` - Update a tool
- `DELETE /api/tools/:id` - Delete a tool

### Owner Only
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user

### Auth
- `POST /api/auth/signup` - User registration
- `GET /api/auth/check-username` - Check username availability

## 🔧 Scripts

### Backend Scripts (`backend/scripts/`)
- `setup-profiles.js` - Create profiles table
- `setup-storage.js` - Create tool-logos bucket
- `setup-avatars-storage.js` - Create avatars bucket
- `update-schema-phase-7.js` - Add avatar_url and unique username
- `create-owner.js` - Seed initial owner account
- `migrate-data.js` - Migrate tools to Supabase

## 📖 Documentation

- [Frontend README](./frontend/README.md) - Detailed frontend setup and customization
- [Backend README](./backend/README.md) - API documentation and backend details

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT


