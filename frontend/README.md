# Apex Frontend

Modern React application for the Apex AI-powered project requirements management platform.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **React Router 6** | Client-side routing |
| **Zustand** | State management |
| **Tailwind CSS** | Utility-first styling |
| **Radix UI** | Accessible UI primitives |
| **Better Auth** | Authentication client |
| **Lucide React** | Icon library |

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/                    # Reusable UI components (Button, Card, etc.)
│   │   ├── layout/                # Layout components (Sidebar, DashboardLayout)
│   │   ├── signin-form.tsx        # Sign in form component
│   │   ├── signup-form.tsx        # Sign up form component
│   │   ├── project-card.tsx       # Project card display
│   │   ├── document-card.tsx      # Document card display
│   │   ├── task-card.tsx          # Task card display
│   │   ├── requirement-card.tsx   # Requirements display
│   │   ├── file-uploader.tsx      # File upload component
│   │   ├── create-task-dialog.tsx # Task creation dialog
│   │   └── typewriter-text.tsx    # Animated text effect
│   │
│   ├── pages/
│   │   ├── HomePage.tsx           # Landing page
│   │   ├── SignInPage.tsx         # Sign in page
│   │   ├── SignUpPage.tsx         # Sign up page
│   │   └── dashboard/
│   │       ├── DashboardPage.tsx      # Main dashboard
│   │       ├── ProjectsPage.tsx       # Projects list
│   │       ├── CreateProjectPage.tsx  # Create new project
│   │       ├── DocumentsPage.tsx      # Project documents
│   │       ├── RequirementsPage.tsx   # Project requirements
│   │       ├── TasksPage.tsx          # Project tasks
│   │       ├── ProgressPage.tsx       # Project progress
│   │       ├── ChatPage.tsx           # AI Q&A chat
│   │       └── ValidationPage.tsx     # Validation page
│   │
│   ├── services/
│   │   ├── api.ts             # Base API client with auth
│   │   ├── projects.ts        # Projects API
│   │   ├── documents.ts       # Documents API
│   │   ├── requirements.ts    # Requirements API
│   │   ├── tasks.ts           # Tasks API
│   │   ├── chat.ts            # Chat/assistant API (SSE)
│   │   └── validation.ts      # Validation API
│   │
│   ├── stores/
│   │   ├── projectStore.ts        # Projects state
│   │   ├── documentStore.ts       # Documents state
│   │   ├── requirementStore.ts    # Requirements state
│   │   ├── taskStore.ts           # Tasks state
│   │   ├── chatStore.ts           # Chat messages state
│   │   └── validationStore.ts     # Validation state
│   │
│   ├── lib/
│   │   ├── auth-client.ts     # Better Auth client setup
│   │   └── utils.ts           # Utility functions (cn, etc.)
│   │
│   ├── hooks/
│   │   └── use-mobile.tsx     # Mobile detection hook
│   │
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   │
│   ├── config/
│   │   └── index.ts           # App configuration
│   │
│   ├── styles/
│   │   └── globals.css        # Global styles & Tailwind
│   │
│   ├── App.tsx                # App root component
│   ├── router.tsx             # Route definitions
│   └── index.tsx              # Entry point
│
├── public/                    # Static assets
├── index.html                 # HTML template
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
├── components.json            # shadcn/ui configuration
└── package.json               # Dependencies & scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000
```

### Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
# Type check and build for production
npm run build

# Preview production build
npm run preview
```

### Linting

```bash
# Run ESLint
npm run lint
```

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | HomePage | Landing page with sign in/up links |
| `/signin` | SignInPage | User authentication |
| `/signup` | SignUpPage | User registration |
| `/dashboard` | DashboardPage | Main dashboard overview |
| `/dashboard/projects` | ProjectsPage | List all user projects |
| `/dashboard/projects/new` | CreateProjectPage | Create a new project |
| `/dashboard/projects/:id/documents` | DocumentsPage | Upload and manage project documents |
| `/dashboard/projects/:id/requirements` | RequirementsPage | View extracted requirements |
| `/dashboard/projects/:id/tasks` | TasksPage | Manage project tasks |
| `/dashboard/projects/:id/progress` | ProgressPage | Track project progress |
| `/dashboard/projects/:id/chat` | ChatPage | AI-powered Q&A chat |
| `/dashboard/projects/:id/validation` | ValidationPage | Validation and conflicts |

## State Management

The app uses **Zustand** for state management with separate stores for each domain:

### Project Store (`projectStore.ts`)
- `projects` - List of user projects
- `currentProject` - Currently selected project
- `fetchProjects()` - Load all projects
- `createProject()` - Create new project
- `deleteProject()` - Delete a project

### Document Store (`documentStore.ts`)
- `documents` - Project documents
- `uploadDocument()` - Upload and process document
- `deleteDocument()` - Remove document

### Chat Store (`chatStore.ts`)
- `messages` - Chat history
- `streamingContent` - Real-time streaming response
- `progressMessage` - Processing status messages
- `sendMessage()` - Send query to AI assistant
- `fetchHistory()` - Load chat history

### Task Store (`taskStore.ts`)
- `tasks` - Project tasks
- `createTask()` - Create new task
- `updateTaskStatus()` - Update task status (TODO, IN_PROGRESS, DONE)

## Authentication

Authentication is handled by **Better Auth** with the React client:

```typescript
import { authClient, useSession, signIn, signUp, signOut } from '@/lib/auth-client'

// Check session
const { data: session, isPending } = useSession()

// Sign in
await signIn.email({ email, password })

// Sign up  
await signUp.email({ email, password, name })

// Sign out
await signOut()
```

## API Integration

All API calls are made through service functions that use a configured fetch wrapper with authentication:

```typescript
// services/api.ts
export const api = {
  get: (url) => fetch(baseURL + url, { credentials: 'include' }),
  post: (url, data) => fetch(baseURL + url, { 
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data)
  }),
  // ...
}
```

### SSE Streaming for Chat

The chat feature uses Server-Sent Events for real-time streaming:

```typescript
// services/chat.ts
export const sendChatMessage = async (projectId, message, onChunk) => {
  const eventSource = new EventSource(`${baseURL}/api/assistant/${projectId}/chat`)
  eventSource.onmessage = (event) => {
    onChunk(JSON.parse(event.data))
  }
}
```

## UI Components

Built with **Radix UI** primitives and styled with **Tailwind CSS**:

- `Button` - Primary action buttons
- `Card` - Content containers
- `Dialog` - Modal dialogs
- `Input` - Form inputs
- `Badge` - Status indicators
- `Progress` - Progress bars
- `Sidebar` - Navigation sidebar
- `Avatar` - User avatars
- `Dropdown Menu` - Context menus
- `Tooltip` - Hover tooltips

## Styling

- **Tailwind CSS** for utility-first styling
- **CSS Variables** for theming (light/dark mode support)
- **Class Variance Authority (CVA)** for component variants
- **tailwind-merge** for class deduplication

## Deployment

### Vercel (Recommended)

The project includes a `vercel.json` for easy deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

```bash
# Build the project
npm run build

# The `dist` folder contains the production build
# Deploy to any static hosting service
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## License

ISC License
