# Apex

**AI-Powered Project Requirements Management Platform**

Apex is a full-stack application that leverages AI agents and Retrieval-Augmented Generation (RAG) to help teams manage project requirements, documents, and tasks intelligently. Upload your project documents, and let Apex automatically extract requirements, identify conflicts, and answer questions about your project.

## Key Features

- **AI-Powered Document Analysis** - Upload PDFs, Word documents, and text files. Apex automatically extracts, chunks, and embeds content for semantic search.
- **Intelligent Q&A Chat** - Ask questions about your project documents and get AI-generated answers grounded in your uploaded content with source citations.
- **Requirements Extraction** - Automatically identifies functional and non-functional requirements from your documents.
- **Tech Stack Detection** - AI identifies and categorizes technology stacks mentioned in your project documentation.
- **Conflict Detection** - Detects conflicting requirements and flags them by severity (low, medium, high).
- **Missing Information Tracking** - Identifies gaps in your project documentation that need to be addressed.
- **Task Management** - Create and track project tasks with origin tracking (user-created vs. AI-suggested).
- **Progress Tracking** - Monitor project progress based on completed tasks.
- **Real-time Streaming** - Chat responses stream in real-time using Server-Sent Events (SSE).

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router 6** for client-side routing
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Radix UI** for accessible UI components
- **Better Auth** (React client) for authentication

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Prisma ORM** with MongoDB
- **LangGraph** for AI agent orchestration
- **Google Generative AI** for LLM capabilities
- **MongoDB Atlas Vector Search** for semantic search
- **Better Auth** for authentication
- **Multer** for file uploads

### AI & Document Processing
- **LangGraph** - State machine-based AI agent workflows
- **Google GenAI** - Text embeddings and LLM responses
- **pdf.js** - PDF text extraction
- **Mammoth** - Word document (.docx) text extraction
- **LangChain Text Splitters** - Intelligent document chunking

## Project Structure

```
apex/
├── frontend/          # React + Vite frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   ├── stores/        # Zustand state stores
│   │   └── lib/           # Utilities and auth client
│   └── ...
├── backend/           # Express.js API server
│   ├── src/
│   │   ├── agents/        # LangGraph AI agents
│   │   │   ├── graphs/    # Agent workflow definitions
│   │   │   ├── nodes/     # Individual agent nodes
│   │   │   └── tools/     # Agent tools
│   │   ├── modules/       # Feature modules (projects, tasks, etc.)
│   │   ├── config/        # Configuration files
│   │   ├── middlewares/   # Express middlewares
│   │   └── utils/         # Utility functions
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── ...
└── README.md          # This file
```

## Getting Started

### Prerequisites

- **Node.js** 18+ 
- **MongoDB** (local or MongoDB Atlas)
- **Google AI API Key** (for Generative AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/apex.git
   cd apex
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/apex"
   PORT=5000
   BASE_URL="http://localhost:5000"
   NODE_ENV="development"
   CORS_ORIGIN="http://localhost:5173"
   BETTER_AUTH_SECRET="your-secret-key-min-32-characters"
   GOOGLE_API_KEY="your-google-ai-api-key"
   ```

4. **Generate Prisma client and push schema**
   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```

5. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

6. **Configure frontend environment**
   
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL="http://localhost:5000"
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The API server will start at `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## API Overview

| Endpoint | Description |
|----------|-------------|
| `/api/auth/*` | Authentication endpoints (Better Auth) |
| `/api/projects` | Project CRUD operations |
| `/api/project/:id/documents` | Document upload and management |
| `/api/project/:id/data` | Project requirements, tech stacks, conflicts |
| `/api/assistant` | AI chat assistant (SSE streaming) |
| `/api/tasks` | Task management |
| `/api/project/:id/progress` | Project progress tracking |

## AI Agent Workflows

Apex uses LangGraph to orchestrate AI agents for various tasks:

### Information Upload Pipeline
1. **Extract Text** - Parse uploaded documents (PDF, DOCX, TXT)
2. **Summarize** - Generate document summary and extract requirements
3. **Chunk Text** - Split into semantic chunks
4. **Embed Chunks** - Generate vector embeddings
5. **Store** - Save to MongoDB with vector indexes

### Query Pipeline
1. **Decide Source** - Determine if query needs database or vector search
2. **Vector Search** - Semantic similarity search on document chunks
3. **Database Query** - Structured data retrieval
4. **Summarize Response** - Generate final answer with sources

## License

This project is licensed under the ISC License.

---

For detailed documentation on each component, see:
- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)
