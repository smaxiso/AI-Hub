# TheAIHubX Backend

**Node.js + Express API with Supabase Integration**

A RESTful API server providing tool management, user authentication, role-based access control, and admin features for TheAIHubX platform.

## 🌟 Features

- 🔐 **JWT Authentication** - Secure authentication via Supabase
- 👥 **Role-Based Access Control (RBAC)** - Owner, Admin, Pending roles
- 🛠️ **Tool CRUD API** - Full create, read, update, delete for AI tools
- 📤 **Image Upload** - Direct integration with Supabase Storage
- 🔒 **Protected Endpoints** - Middleware-based auth and role checking
- 👤 **User Management** - Approve, reject, and revoke user access
- 📊 **Profile Management** - Username, avatar, and user data

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Supabase** - PostgreSQL database, Auth, and Storage
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Supabase account with a project

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**

Create a `.env` file:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key
PORT=3000
```

3. **Run database setup (first time only):**
```bash
# Create profiles table
node scripts/setup-profiles.js

# Create storage buckets
node scripts/setup-storage.js
node scripts/setup-avatars-storage.js

# Update schema for Phase 7 features
node scripts/update-schema-phase-7.js

# Create initial owner account
node scripts/create-owner.js
```

4. **Start the server:**
```bash
npm start
```

Server runs at `http://localhost:3000`

## 📁 Project Structure

```
backend/
├── scripts/
│   ├── setup-profiles.js          # Create profiles table
│   ├── setup-storage.js           # Create tool-logos bucket
│   ├── setup-avatars-storage.js   # Create avatars bucket
│   ├── update-schema-phase-7.js   # Add avatar_url, unique username
│   ├── create-owner.js            # Seed owner account
│   └── migrate-data.js            # Import tools to Supabase
├── index.js                       # Main server file
├── .env                           # Environment variables
└── package.json
```

## 📚 API Documentation

### Public Endpoints

#### Get All Tools
```http
GET /api/tools
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "ChatGPT",
    "url": "https://chat.openai.com",
    "category": "Chat",
    "description": "AI chatbot...",
    "tags": ["ai", "chat"],
    "pricing": "Freemium",
    "icon": "https://...",
    "use_cases": ["Writing", "Coding"],
    "added_date": "2024-01-15"
  }
]
```

### Authentication Endpoints

#### User Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "full_name": "John Doe",
  "username": "johndoe"
}
```

**Response:** `200 OK` or `400 Bad Request`

#### Check Username Availability
```http
GET /api/auth/check-username?username=johndoe
```

**Response:**
```json
{
  "available": true
}
```

### Admin Endpoints (Requires Authentication)

**Headers:**
```
Authorization: Bearer <supabase_jwt_token>
```

#### Create Tool
```http
POST /api/tools
Content-Type: application/json

{
  "name": "New Tool",
  "url": "https://example.com",
  "category": "Chat",
  "description": "Tool description",
  "tags": ["ai", "productivity"],
  "pricing": "Free",
  "icon": "https://...",
  "use_cases": ["Research"]
}
```

#### Update Tool
```http
PUT /api/tools/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "New description"
}
```

#### Delete Tool
```http
DELETE /api/tools/:id
```

### Owner-Only Endpoints

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <owner_jwt_token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "email": "admin@example.com",
    "full_name": "Admin User",
    "username": "admin",
    "role": "admin",
    "avatar_url": "https://...",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Update User Role
```http
PUT /api/admin/users/:id/role
Content-Type: application/json
Authorization: Bearer <owner_jwt_token>

{
  "role": "admin"
}
```

Valid roles: `"owner"`, `"admin"`, `"pending"`

#### Delete User
```http
DELETE /api/admin/users/:id
Authorization: Bearer <owner_jwt_token>
```

Deletes user from both Supabase Auth and profiles table.

## 🔐 Middleware

### `authenticateUser`
Verifies JWT token and fetches user role from profiles table.

```javascript
// Adds to request object:
req.user = {
  id: 'user-uuid',
  email: 'user@example.com',
  role: 'admin'
}
```

### `requireRole(['owner'])`
Restricts endpoint access to specific roles.

```javascript
app.get('/api/admin/users', 
  authenticateUser, 
  requireRole(['owner']), 
  handler
);
```

## 🗄️ Database Schema

### `profiles` Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  username TEXT UNIQUE,
  role TEXT DEFAULT 'pending',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `tools` Table
```sql
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  pricing TEXT,
  icon TEXT,
  use_cases TEXT[],
  added_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 📦 Storage Buckets

- **tool-logos** - Stores tool icon/logo images
- **avatars** - Stores user profile avatars

Both buckets are configured with public read access.

## 🔧 Scripts

### Setup Scripts

Run these once during initial setup:

```bash
# Create profiles table
node scripts/setup-profiles.js

# Create tool-logos storage bucket
node scripts/setup-storage.js

# Create avatars storage bucket
node scripts/setup-avatars-storage.js

# Add avatar_url and unique username to profiles
node scripts/update-schema-phase-7.js
```

### Data Scripts

```bash
# Create initial owner account
node scripts/create-owner.js

# Migrate tools from static data (if needed)
node scripts/migrate-data.js
```

## 🌍 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_KEY` | Service role key (admin) | `eyJhbG...` |
| `PORT` | Server port | `3000` |

**Important:** Use the **Service Role Key**, not the anon key, for backend operations.

## 🚦 Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

Error response format:
```json
{
  "error": "Error message"
}
```

## 🔒 Security Best Practices

1. **Never expose Service Role Key** - Keep in `.env`, never commit
2. **Validate all inputs** - Prevent SQL injection and XSS
3. **Use HTTPS in production** - Encrypt data in transit
4. **Rate limiting** - Consider adding rate limits for production
5. **CORS configuration** - Restrict to trusted origins in production

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT
