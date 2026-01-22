# Apex Frontend

React + TypeScript frontend built with Vite, Tailwind CSS, and Shadcn/ui.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Reusable component library
- **React Router v6** - Client-side routing
- **Zustand** - State management

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at http://localhost:5173

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable UI components
│   └── ui/         # Shadcn/ui components
├── config/         # App configuration
├── lib/            # Utility libraries
├── pages/          # Page components
├── services/       # API services
├── styles/         # Global styles
├── types/          # TypeScript type definitions
├── utils/          # Helper functions
├── App.tsx         # Root component
├── index.tsx       # Entry point
└── router.tsx      # Route definitions
```

## Adding Shadcn/ui Components

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

See [Shadcn/ui documentation](https://ui.shadcn.com/) for available components.

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

All environment variables must be prefixed with `VITE_` to be exposed to the client.
