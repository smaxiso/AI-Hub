# TheAIHubX Frontend

**Discover, compare, and master AI tools - Your complete learning hub**

A modern, feature-rich React application with glassmorphism design, 3D effects, and comprehensive admin dashboard with role-based access control.

## ✨ Features

### Public Features
- 🎨 **Glassmorphism Design** - Beautiful frosted glass effect with backdrop blur
- 🌈 **Soothing Color Palette** - Aesthetic pastel colors with smooth gradients
- 📱 **PWA & Mobile-First** - Installable application with offline capabilities
- 🎓 **Learning Hub** - Structured learning paths and interactive quizzes
- 🏆 **Gamification** - Earn badges and maintain streaks
- ✨ **3D Effects** - Subtle transforms and hover animations
- 🔍 **Advanced Search** - Real-time search across tool names and descriptions
- 🎯 **Smart Filtering** - Filter by categories with visual chips
- 📊 **Flexible Sorting** - Sort alphabetically or by newest first
- 🆕 **New Badge** - Auto-highlight tools added in the last 7 days
- 🗣️ **Community** - Suggest tools and submit feedback
- 🎭 **Smooth Animations** - Framer Motion powered transitions

### Admin Dashboard
- 🔐 **Authentication** - Secure login with Supabase Auth
- 👥 **User Management** (Owner Only)
  - Approve/reject new signups
  - Revoke admin access
  - Real-time pending user badge
  - Session invalidation for revoked users
- 📬 **Community Moderation**
  - Review suggestions (Tools, Feedback)
  - Approve or Reject/Dismiss items
  - Context-aware actions
- 🛠️ **Tool Management**
  - Create, edit, and delete tools
  - Image upload to Supabase Storage
  - Rich form validation
- 🔒 **Profile & Security**
  - Avatar upload and management
  - Username customization (with uniqueness check)
  - Password reset flow
- 🎨 **Production UX**
  - Custom Material-UI dialogs for confirmations
  - Snackbar notifications for feedback
  - Mobile-responsive tables and cards
  - Password visibility toggles

## 🛠️ Tech Stack

- **React 18** - UI library with hooks
- **Vite** - Lightning-fast build tool
- **Material-UI (MUI)** - Comprehensive component library
- **Framer Motion** - Advanced animation library
- **React Router** - Client-side routing
- **Supabase Client** - Authentication and storage
- **Emotion** - CSS-in-JS styling

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Supabase project credentials

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**

Create a `.env` file in the frontend directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3000/api
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open browser:**
Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Built files will be in the `dist` directory.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ToolCard.jsx          # Glassmorphism tool card
│   │   ├── SearchBar.jsx         # Search input
│   │   ├── CategoryFilter.jsx    # Category chips
│   │   └── ProtectedRoute.jsx    # Auth route guard
│   ├── context/
│   │   └── AuthContext.jsx       # Global auth state
│   ├── pages/
│   │   ├── Home.jsx              # Public homepage
│   │   └── admin/
│   │       ├── Login.jsx         # Admin login
│   │       ├── Signup.jsx        # User registration
│   │       ├── Dashboard.jsx     # Admin dashboard
│   │       ├── ToolForm.jsx      # Create/edit tools
│   │       ├── ManageUsers.jsx   # User management (owner)
│   │       ├── Profile.jsx       # User profile settings
│   │       ├── ForgotPassword.jsx
│   │       └── ResetPassword.jsx
│   ├── supabaseClient.js         # Supabase config
│   ├── App.jsx                   # Main app with routing
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── .env                          # Environment variables
├── package.json
└── vite.config.js
```

## 🎨 Customization

### Color Scheme

Modify the palette in `src/index.css`:

```css
:root {
  --primary-light: #E8F4F8;
  --primary-soft: #B8E0F2;
  --accent-lavender: #D4C5F9;
  --accent-peach: #FFD4BA;
  --neutral-white: #FFFFFF;
}
```

### Category Colors

Update in your tool data:
```javascript
const categoryColors = {
  Chat: '#B8E0F2',
  Image: '#D4C5F9',
  Video: '#FFD4BA',
  Coding: '#C1E7E3',
  Audio: '#F8E6D4',
  Agent: '#E8D4F8',
  Other: '#D4D4D4'
};
```

## 🔐 Authentication Flow

1. **Public Access** - Homepage is accessible to all
2. **Registration** - Users sign up via `/admin/signup`
3. **Pending State** - New users start with `pending` role
4. **Owner Approval** - Owner must approve users (promote to `admin`)
5. **Admin Access** - Approved admins can manage tools
6. **Session Management** - Revoked users auto-logout every 5 seconds

## 🎭 Key Features in Detail

### Glassmorphism Effect
- Backdrop blur for frosted glass
- Semi-transparent backgrounds
- Subtle borders and shadows
- Gradient overlays

### Mobile Responsiveness
- Card-based layouts for small screens
- Collapsible navigation
- Touch-friendly buttons
- Responsive tables transform to cards

### Real-time Updates
- Badge count refreshes on user approve/reject
- Periodic role checks for session invalidation
- Instant UI updates after actions

### Production-grade UX
- No native browser alerts/confirms
- Custom Material-UI dialogs
- Snackbar notifications with severity levels
- Loading states and error handling

## 📚 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key | `eyJhbG...` |
| `VITE_API_URL` | Backend API URL | `http://localhost:3000/api` |

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT
