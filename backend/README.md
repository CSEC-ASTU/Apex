# Apex Backend

Express.js + TypeScript backend with Prisma ORM and MongoDB.

## Tech Stack

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **MongoDB** - Database
- **tsx** - TypeScript execution for development

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB instance (local or cloud like MongoDB Atlas)

### Install Dependencies

```bash
npm install
```

### Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Update the `.env` file with your MongoDB connection string.

### Generate Prisma Client

```bash
npm run prisma:generate
```

### Push Schema to Database

```bash
npm run prisma:push
```

### Run Development Server

```bash
npm run dev
```

The server will start at http://localhost:3000

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run lint` | Run ESLint |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:push` | Push schema changes to database |
| `npm run prisma:studio` | Open Prisma Studio GUI |

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middlewares/    # Express middlewares
├── models/         # Data models and schemas
├── routes/         # API route definitions
├── services/       # Business logic
├── utils/          # Helper utilities
├── app.ts          # Express app setup
└── server.ts       # Server entry point
```

## API Endpoints

Base URL: `http://localhost:3000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |

More endpoints will be added as features are developed.
