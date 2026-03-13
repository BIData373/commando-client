# מערכת הנחיות - Instructions System

מערכת ניהול הנחיות RTL בעברית, עם ממשק דשבורד מודרני.

## 🚀 התחלה מהירה

### דרישות מקדימות

- Node.js 18+
- npm או yarn

### התקנה

```bash
# התקן תלויות
npm install

# הפעל MSW (Mock Service Worker) - נדרש בפעם הראשונה
npx msw init public/ --save

# הרץ שרת פיתוח
npm run dev
```

האפליקציה תהיה זמינה בכתובת: http://localhost:3000

## 📁 מבנה הפרויקט

```
src/
├── api/                 # API client, endpoints, DTOs, mappers
├── components/          # Reusable UI components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── mocks/              # MSW mock handlers & data
├── pages/              # Page components (routes)
├── routes/             # React Router configuration
├── styles/             # Global styles & SCSS variables
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── theme.ts            # MUI theme configuration (RTL)
```

## 🛠️ Tech Stack

- **Framework**: Vite + React 18 + TypeScript
- **UI Library**: Material UI v5 (MUI) + Emotion
- **Styling**: SCSS Modules + MUI theme
- **Routing**: React Router v6
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Mock API**: MSW (Mock Service Worker)
- **Data Grid**: MUI X DataGrid

## 🌐 RTL Support

האפליקציה בנויה במלואה עם תמיכה ב-RTL (Right-to-Left):
- כל הטקסטים בעברית
- Theme של MUI מוגדר כ-RTL
- Layout ו-CSS מותאמים לעברית

## 📋 Scripts

```bash
npm run dev          # הפעלת שרת פיתוח
npm run build        # בניית production
npm run preview      # תצוגה מקדימה של build
npm run lint         # הרצת ESLint
npm run format       # עיצוב קוד עם Prettier
```

## 🔌 Backend Integration Guide

### מצב נוכחי: Mock API (MSW)

כרגע, האפליקציה משתמשת ב-Mock Service Worker (MSW) לסימולציה של API.

### מעבר ל-Backend אמיתי

1. **הגדר משתני סביבה** (קובץ `.env`):

```env
VITE_API_BASE_URL=http://your-backend-url/api
VITE_USE_MOCK_API=false
```

2. **API Adapter Layer**:

הקובץ `src/api/client.ts` מכיל את ה-axios client המרכזי.
כל ה-endpoints מוגדרים ב-`src/api/endpoints/`.

3. **DTOs & Mappers**:

- DTOs (Data Transfer Objects) מוגדרים ב-`src/api/dtos/`
- Mappers להמרה בין DTOs לטיפוסים פנימיים ב-`src/api/mappers/`

4. **Authentication in Closed Network**:

מומלץ להשתמש ב:
- JWT tokens או
- Session-based auth
- תמיכה ב-HTTP-only cookies

דוגמה להוספת interceptor ל-axios:

```typescript
// src/api/client.ts
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 🗄️ PostgreSQL Schema Recommendation

### Tables

#### `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  role VARCHAR(50) DEFAULT 'user', -- 'admin', 'user'
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

#### `environments`
```sql
CREATE TABLE environments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logoUrl VARCHAR(500),
  createdBy UUID REFERENCES users(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  archived BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_environments_created_by ON environments(createdBy);
CREATE INDEX idx_environments_archived ON environments(archived);
```

#### `roles` (Lookup Table)
```sql
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL, -- 'owner', 'admin', 'member', 'viewer'
  permissions JSONB, -- flexible permissions structure
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (name, permissions) VALUES
  ('owner', '{"can_delete_env": true, "can_manage_members": true, "can_edit_instructions": true, "can_view_instructions": true}'),
  ('admin', '{"can_manage_members": true, "can_edit_instructions": true, "can_view_instructions": true}'),
  ('member', '{"can_edit_instructions": true, "can_view_instructions": true}'),
  ('viewer', '{"can_view_instructions": true}');
```

#### `environment_members`
```sql
CREATE TABLE environment_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  environmentId UUID REFERENCES environments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER REFERENCES roles(id),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(environmentId, user_id)
);

CREATE INDEX idx_env_members_env ON environment_members(environmentId);
CREATE INDEX idx_env_members_user ON environment_members(user_id);
```

#### `instruction_statuses` (Lookup Table)
```sql
CREATE TABLE instruction_statuses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL, -- 'open', 'inProgress', 'completed', 'archived'
  display_name_he VARCHAR(100) NOT NULL, -- 'פתוח', 'בטיפול', 'הושלם', 'בארכיון'
  color VARCHAR(7), -- hex color for UI
  sort_order INTEGER DEFAULT 0
);

INSERT INTO instruction_statuses (name, display_name_he, color, sort_order) VALUES
  ('open', 'פתוח', '#3b82f6', 1),
  ('inProgress', 'בטיפול', '#f59e0b', 2),
  ('completed', 'הושלם', '#10b981', 3),
  ('archived', 'בארכיון', '#6b7280', 4);
```

#### `instruction_priorities` (Lookup Table)
```sql
CREATE TABLE instruction_priorities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL, -- 'low', 'medium', 'high', 'urgent'
  display_name_he VARCHAR(100) NOT NULL, -- 'נמוכה', 'רגילה', 'גבוהה', 'דחוף'
  color VARCHAR(7),
  sort_order INTEGER DEFAULT 0
);

INSERT INTO instruction_priorities (name, display_name_he, color, sort_order) VALUES
  ('low', 'נמוכה', '#6b7280', 1),
  ('medium', 'רגילה', '#3b82f6', 2),
  ('high', 'גבוהה', '#f59e0b', 3),
  ('urgent', 'דחוף', '#ef4444', 4);
```

#### `instructions`
```sql
CREATE TABLE instructions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  environmentId UUID REFERENCES environments(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  status_id INTEGER REFERENCES instruction_statuses(id) DEFAULT 1,
  priority_id INTEGER REFERENCES instruction_priorities(id) DEFAULT 2,
  due_date TIMESTAMP,
  source VARCHAR(255), -- e.g., "ישיבת צוות 15/01", "דיון עם מנכ״ל"
  createdBy UUID REFERENCES users(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  archived BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_instructions_env ON instructions(environmentId);
CREATE INDEX idx_instructions_status ON instructions(status_id);
CREATE INDEX idx_instructions_priority ON instructions(priority_id);
CREATE INDEX idx_instructions_due_date ON instructions(due_date);
CREATE INDEX idx_instructions_created_by ON instructions(createdBy);
```

#### `instruction_assignees`
```sql
CREATE TABLE instruction_assignees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instruction_id UUID REFERENCES instructions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by UUID REFERENCES users(id),
  UNIQUE(instruction_id, user_id)
);

CREATE INDEX idx_instruction_assignees_instruction ON instruction_assignees(instruction_id);
CREATE INDEX idx_instruction_assignees_user ON instruction_assignees(user_id);
```

#### `tags`
```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  environmentId UUID REFERENCES environments(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7), -- hex color
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(environmentId, name)
);

CREATE INDEX idx_tags_env ON tags(environmentId);
```

#### `instruction_tags`
```sql
CREATE TABLE instruction_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instruction_id UUID REFERENCES instructions(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(instruction_id, tag_id)
);

CREATE INDEX idx_instruction_tags_instruction ON instruction_tags(instruction_id);
CREATE INDEX idx_instruction_tags_tag ON instruction_tags(tag_id);
```

#### `comments`
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instruction_id UUID REFERENCES instructions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  edited BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_comments_instruction ON comments(instruction_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(createdAt DESC);
```

#### `attachments`
```sql
CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instruction_id UUID REFERENCES instructions(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_size BIGINT, -- bytes
  mime_type VARCHAR(100),
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attachments_instruction ON attachments(instruction_id);
```

#### `activity_log`
```sql
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instruction_id UUID REFERENCES instructions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL, -- 'created', 'status_changed', 'assigned', 'commented', etc.
  metadata JSONB, -- flexible structure for action details
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_log_instruction ON activity_log(instruction_id);
CREATE INDEX idx_activity_log_user ON activity_log(user_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(createdAt DESC);
```

### Audit Fields

לכל טבלה רלוונטית מומלץ להוסיף:
- `createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
- `updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
- `createdBy UUID REFERENCES users(id)` (לפי הצורך)

### Triggers for `updatedAt`

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedAt = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_environments_updated_at BEFORE UPDATE ON environments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instructions_updated_at BEFORE UPDATE ON instructions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 📝 Development Notes

### שלב נוכחי: Step 1 Complete ✅

מבנה הפרויקט הבסיסי הושלם:
- ✅ Vite + React + TypeScript
- ✅ Material UI + RTL theme
- ✅ React Router + placeholder pages
- ✅ SCSS Modules + global styles
- ✅ ESLint + Prettier
- ✅ MSW setup (placeholder)

### שלבים הבאים:
- Step 2: TypeScript types, DTOs, API layer
- Step 3: MSW mock backend + Hebrew seed data
- Step 4: Home Screen implementation
- ...וכו׳

## 📄 License

Private project - all rights reserved.
