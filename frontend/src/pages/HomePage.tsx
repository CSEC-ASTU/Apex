export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome to Apex
        </h1>
        <p className="text-muted-foreground text-lg">
          Your full-stack application is ready to go.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="https://react.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
          >
            React Docs
          </a>
          <a
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition-opacity"
          >
            Shadcn/ui
          </a>
        </div>
      </div>
    </div>
  )
}
