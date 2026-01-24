# Apex Backend

Express.js API server with AI-powered document processing and RAG (Retrieval-Augmented Generation) capabilities for the Apex project management platform.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **TypeScript** | Type safety |
| **Prisma** | ORM for MongoDB |
| **MongoDB** | Database (with Atlas Vector Search) |
| **LangGraph** | AI agent orchestration |
| **Google GenAI** | LLM and embeddings |
| **Better Auth** | Authentication |
| **Multer** | File uploads |
| **Zod** | Schema validation |

## Project Structure

```
backend/
├── src/
│   ├── agents/
│   │   ├── graphs/                    # LangGraph workflow definitions
│   │   │   ├── assistantGraph.ts      # Main query answering agent
│   │   │   ├── informationGraph.ts    # Document summarization agent
│   │   │   ├── vectorGraph.ts         # Vector embedding pipeline
│   │   │   ├── textInfoGraph.ts       # Text data processing
│   │   │   ├── textVectorGraph.ts     # Text vectorization
│   │   │   ├── subAssistantDatabaseGraph.ts  # Database query sub-agent
│   │   │   └── subAssistantRagGraph.ts       # RAG sub-agent
│   │   │
│   │   ├── nodes/
│   │   │   ├── informatinUpload/      # Document upload processing nodes
│   │   │   │   ├── extractText.ts     # Extract text from files
│   │   │   │   ├── chunkText.ts       # Split text into chunks
│   │   │   │   ├── embedChunks.ts     # Generate embeddings
│   │   │   │   ├── storeChunks.ts     # Store in vector DB
│   │   │   │   ├── summarizeFile.ts   # AI summarization
│   │   │   │   ├── summarizeTextData.ts
│   │   │   │   ├── saveFileData.ts    # Save to database
│   │   │   │   └── saveTextData.ts
│   │   │   │
│   │   │   └── InformationRetrieve.ts/  # Query processing nodes
│   │   │       ├── decideInformationSource.ts  # Route queries
│   │   │       ├── embedQuery.ts       # Embed user query
│   │   │       ├── vectorSearch.ts     # Semantic search
│   │   │       ├── cleanVectorSearchInfo.ts
│   │   │       ├── cleanDatabaseInfo.ts
│   │   │       └── responseSummary.ts  # Generate response
│   │   │
│   │   ├── tools/
│   │   │   └── databaseAccess.ts       # Database query tool
│   │   │
│   │   ├── functionDeclaration.ts/
│   │   │   └── assitant.function.ts    # Function declarations
│   │   │
│   │   └── zodSchema/
│   │       └── documentSchema.ts       # Zod schemas for AI output
│   │
│   ├── modules/                        # Feature modules
│   │   ├── projects/
│   │   │   ├── projects.controller.ts
│   │   │   ├── projects.routes.ts
│   │   │   ├── projects.schema.ts
│   │   │   └── projects.sevice.ts
│   │   │
│   │   ├── data/                       # Document upload module
│   │   │   ├── data.controller.ts
│   │   │   ├── data.routes.ts
│   │   │   ├── data.schema.ts
│   │   │   └── data.service.ts
│   │   │
│   │   ├── assistant/                  # AI chat module
│   │   │   ├── assistant.controller.ts
│   │   │   ├── assistant.routes.ts
│   │   │   ├── assistant.schema.ts
│   │   │   └── assistant.service.ts
│   │   │
│   │   ├── tasks/
│   │   │   ├── tasks.controller.ts
│   │   │   ├── tasks.routes.ts
│   │   │   ├── tasks.schema.ts
│   │   │   └── tasks.service.ts
│   │   │
│   │   ├── projectData/                # Requirements, conflicts, etc.
│   │   │   ├── projectData.controller.ts
│   │   │   ├── projectData.routes.ts
│   │   │   ├── projectData.schema.ts
│   │   │   └── projectData.service.ts
│   │   │
│   │   └── progress/
│   │       ├── progress.controller.ts
│   │       ├── progress.route.ts
│   │       └── progress.service.ts
│   │
│   ├── config/
│   │   ├── index.ts                    # Config exports
│   │   ├── database.ts                 # Prisma client
│   │   ├── genAI.ts                    # Google GenAI setup
│   │   ├── mongoDB.ts                  # MongoDB native client
│   │   └── multer.ts                   # File upload config
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.ts           # Auth verification
│   │   ├── errorHandler.ts             # Global error handler
│   │   ├── validate.ts                 # Request validation
│   │   ├── notFound.ts                 # 404 handler
│   │   └── middleware.ts               # Middleware exports
│   │
│   ├── utils/
│   │   ├── sse.ts                      # Server-Sent Events helper
│   │   ├── chunk.text.ts               # Text chunking utility
│   │   ├── embedChunk.ts               # Embedding utility
│   │   └── extractTextFromFile.ts      # File text extraction
│   │
│   ├── types/
│   │   └── express.d.ts                # Express type extensions
│   │
│   ├── routes/
│   │   └── index.ts                    # Route aggregation
│   │
│   ├── auth.ts                         # Better Auth configuration
│   ├── env.ts                          # Environment validation
│   ├── routes.ts                       # Main router
│   └── server.ts                       # Express app entry
│
├── prisma/
│   └── schema.prisma                   # Database schema
│
├── uploads/                            # Uploaded files (temporary)
├── tsconfig.json                       # TypeScript config
└── package.json                        # Dependencies & scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas with Vector Search)
- Google AI API Key

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/apex"

# Server
PORT=5000
BASE_URL="http://localhost:5000"
NODE_ENV="development"
CORS_ORIGIN="http://localhost:5173"

# Authentication
BETTER_AUTH_SECRET="your-secret-key-minimum-32-characters-long"

# AI
GOOGLE_API_KEY="your-google-ai-api-key"
```

### Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Open Prisma Studio (optional)
npm run prisma:studio
```

### MongoDB Atlas Vector Search Index

For semantic search to work, create a vector search index in MongoDB Atlas:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "vector",
      "numDimensions": 768,
      "similarity": "cosine"
    },
    {
      "type": "filter",
      "path": "projectId"
    }
  ]
}
```

### Running the Server

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build
npm start
```

The API server will start at `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `ALL` | `/api/auth/*` | Better Auth handlers (sign up, sign in, sign out, session) |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects` | List all user projects |
| `GET` | `/api/projects/:id` | Get project by ID |
| `POST` | `/api/projects` | Create new project |
| `PUT` | `/api/projects/:id` | Update project |
| `DELETE` | `/api/projects/:id` | Delete project |

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/project/:projectId/documents` | List project documents |
| `POST` | `/api/project/:projectId/upload` | Upload document (multipart/form-data) |
| `POST` | `/api/project/:projectId/text` | Add text data |
| `DELETE` | `/api/project/:projectId/documents/:docId` | Delete document |

### Project Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/project/:projectId/requirements` | Get all requirements |
| `GET` | `/api/project/:projectId/tech-stacks` | Get tech stacks |
| `GET` | `/api/project/:projectId/conflicts` | Get conflicts |
| `GET` | `/api/project/:projectId/missing-info` | Get missing information |
| `PUT` | `/api/project/:projectId/conflicts/:id` | Resolve conflict |
| `PUT` | `/api/project/:projectId/missing-info/:id` | Address missing info |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks/:projectId` | List project tasks |
| `POST` | `/api/tasks/:projectId` | Create task |
| `PUT` | `/api/tasks/:taskId` | Update task |
| `DELETE` | `/api/tasks/:taskId` | Delete task |

### AI Assistant

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/assistant/:projectId/chat` | Send message (SSE streaming response) |
| `GET` | `/api/assistant/:projectId/history` | Get chat history |
| `DELETE` | `/api/assistant/:projectId/history` | Clear chat history |

### Progress

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/project/:projectId/progress` | Get project progress |

## Database Schema

### Core Models

```prisma
model Project {
  id          String        @id
  title       String
  description String?
  status      ProjectStatus @default(ACTIVE)  // ACTIVE | COMPLETED
  progress    Float         @default(0)
  userId      String
  
  documents                 Document[]
  tasks                     Task[]
  chunks                    Chunk[]
  functionalRequirements    FunctionalRequirement[]
  nonFunctionalRequirements NonFunctionalRequirement[]
  techStacks                TechStack[]
  conflicts                 Conflict[]
  missingInformation        MissingInformation[]
}

model Document {
  id       String         @id
  fileName String
  fileType String
  status   DocumentStatus  // PENDING | PROCESSED | FAILED
  projectId String
  chunks   Chunk[]
}

model Chunk {
  id         String   @id
  content    String
  vector     Float[]   // Embedding vector for semantic search
  source     String?
  projectId  String
  documentId String?
}

model Task {
  id          String     @id
  title       String
  description String?
  status      TaskStatus  // TODO | IN_PROGRESS | DONE
  origin      TaskOrigin  // USER | AGENT
  weight      Int
  projectId   String
}
```

### Requirements & Analysis

```prisma
model FunctionalRequirement {
  id          String @id
  code        String   // e.g., "FR-1"
  description String
  projectId   String
}

model NonFunctionalRequirement {
  id          String @id
  code        String   // e.g., "NFR-1"
  description String
  projectId   String
}

model TechStack {
  id       String   @id
  category String   // "frontend" | "backend" | "database" | etc.
  stack    String[] // ["React", "TypeScript", "Tailwind"]
  projectId String
}

model Conflict {
  id          String           @id
  description String
  severity    ConflictSeverity  // LOW | MEDIUM | HIGH
  resolved    Boolean
  resolution  String?
  projectId   String
}

model MissingInformation {
  id          String @id
  description String
  addressed   Boolean
  note        String?
  projectId   String
}
```

## AI Agent Workflows

### Document Processing Pipeline

When a document is uploaded, it goes through:

```
┌─────────────────┐
│  Upload File    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Extract Text   │  (PDF.js / Mammoth)
└────────┬────────┘
         │
         ├──────────────────────┐
         │                      │
         ▼                      ▼
┌─────────────────┐    ┌─────────────────┐
│   Summarize     │    │   Chunk Text    │
│  & Extract      │    │                 │
│  Requirements   │    └────────┬────────┘
└────────┬────────┘             │
         │                      ▼
         │             ┌─────────────────┐
         │             │ Embed Chunks    │  (Google GenAI)
         │             └────────┬────────┘
         │                      │
         ▼                      ▼
┌─────────────────┐    ┌─────────────────┐
│  Save to DB     │    │  Store Vectors  │
│ (Requirements,  │    │  (MongoDB)      │
│  TechStack,     │    └─────────────────┘
│  Conflicts)     │
└─────────────────┘
```

### Query Processing Pipeline

When a user asks a question:

```
┌─────────────────┐
│  User Query     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Decide Source   │  (LLM decides: DB, RAG, or both)
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐  ┌───────┐
│  DB   │  │  RAG  │
│ Query │  │Search │
└───┬───┘  └───┬───┘
    │          │
    └────┬─────┘
         │
         ▼
┌─────────────────┐
│   Summarize     │  (Generate answer with sources)
│   Response      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  SSE Stream     │  (Real-time to client)
└─────────────────┘
```

## Real-time Streaming

The chat endpoint uses Server-Sent Events (SSE) for real-time responses:

```typescript
// SSE event types
interface SSEEvent {
  type: 'progress' | 'chunk' | 'done' | 'error'
  data: string
}

// Progress events show what the agent is doing
{ type: 'progress', data: 'Searching documents...' }

// Chunk events stream the response
{ type: 'chunk', data: 'Based on your requirements...' }

// Done event signals completion
{ type: 'done', data: JSON.stringify({ sources: [...] }) }
```

## Authentication

Better Auth handles all authentication with:

- **Email/Password** authentication
- **Session-based** auth with secure cookies
- **Cookie caching** for performance (5 min TTL)
- **7-day** session expiration with daily refresh

```typescript
// Protecting routes
import { authMiddleware } from './middlewares/authMiddleware'

router.use(authMiddleware)  // All routes after this are protected
```

## File Uploads

Multer handles file uploads with:

- Max file size: 10MB
- Supported formats: PDF, DOCX, TXT
- Files stored temporarily in `/uploads`

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with hot reload (tsx watch) |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled JS |
| `npm run lint` | Run ESLint |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:push` | Push schema to database |
| `npm run prisma:studio` | Open Prisma Studio |

## Error Handling

Centralized error handling with proper HTTP status codes:

```typescript
// Custom error format
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"  // optional
}
```

## License

ISC License
