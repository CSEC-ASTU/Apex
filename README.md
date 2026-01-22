# Apex

A full-stack application with React frontend and Express.js backend.

## Project Structure

```
Apex/
├── frontend/          # React + Vite + TypeScript frontend
├── backend/           # Express.js + TypeScript + Prisma backend
└── README.md          # This file
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Apex
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env` in both `frontend` and `backend` directories
   - Fill in the required values

5. Generate Prisma client:
   ```bash
   cd backend
   npx prisma generate
   ```

### Running the Application

**Frontend (development):**
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:5173

**Backend (development):**
```bash
cd backend
npm run dev
```
Backend runs on http://localhost:3000

---

## Contributing

We use a **Git Flow** branching strategy. Please follow these guidelines when contributing to the project.

### Branch Structure

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code. Only accepts PRs from `develop`. |
| `develop` | Integration branch for features. All feature branches are created from here. |
| `feature/*` | New features and enhancements. |
| `bugfix/*` | Bug fixes. |
| `hotfix/*` | Urgent fixes for production (branched from `main`). |

### Workflow

#### 1. Starting a New Feature

```bash
# Make sure you're on develop and it's up to date
git checkout develop
git pull origin develop

# Create a new feature branch
git checkout -b feature/your-feature-name
```

#### 2. Working on Your Feature

- Make your changes
- Commit regularly with meaningful commit messages
- Keep your branch up to date with develop:

```bash
git fetch origin
git rebase origin/develop
```

#### 3. Submitting Your Work

```bash
# Push your feature branch
git push origin feature/your-feature-name
```

Then create a **Pull Request** from `feature/your-feature-name` → `develop`

#### 4. Code Review & Merge

- Request a code review from team members
- Address any feedback
- Once approved, your PR will be merged into `develop`

#### 5. Releasing to Production

When `develop` is stable and ready for release:

1. A PR is created from `develop` → `main`
2. After review and approval, it's merged into `main`
3. A release tag is created on `main`

### Commit Message Guidelines

Use clear, descriptive commit messages:

```
feat: add user authentication
fix: resolve login redirect issue
docs: update API documentation
refactor: simplify database queries
test: add unit tests for user service
chore: update dependencies
```

### Quick Reference

```bash
# Create feature branch
git checkout develop
git checkout -b feature/my-feature

# Keep branch updated
git fetch origin
git rebase origin/develop

# Push changes
git push origin feature/my-feature

# After PR is merged, clean up
git checkout develop
git pull origin develop
git branch -d feature/my-feature
```

---

## License

This project is licensed under the MIT License.
