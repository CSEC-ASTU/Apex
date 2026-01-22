import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { signIn, signOut, signUp, useSession } from "@/lib/auth-client";

export default function AuthPage() {
  const navigate = useNavigate();
  const { data: session, isPending, error } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const canSubmit = useMemo(() => email.length > 3 && password.length >= 8, [email, password]);

  async function handleSignUp() {
    setBusy(true);
    try {
      const result = await signUp.email({ name, email, password });
      console.log("Sign up result:", result);
      if (result.error) {
        alert(`Sign up failed: ${result.error.message}`);
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleSignIn() {
    setBusy(true);
    try {
      await signIn.email({ email, password, rememberMe: true });
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setBusy(true);
    try {
      await signOut();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Auth</h1>
          <p className="text-sm text-muted-foreground">
            Email/password demo using Better Auth.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-4 space-y-3">
          <div className="text-sm">
            <div className="font-medium">Session</div>
            {isPending ? (
              <div className="text-muted-foreground">Loading…</div>
            ) : error ? (
              <div className="text-destructive">Error: {String(error)}</div>
            ) : session ? (
              <pre className="mt-2 overflow-auto text-xs text-muted-foreground">
                {JSON.stringify(session, null, 2)}
              </pre>
            ) : (
              <div className="text-muted-foreground">Not signed in</div>
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 space-y-3">
          <label className="block space-y-1">
            <span className="text-sm font-medium">Name (for sign-up)</span>
            <input
              className="w-full h-10 rounded-md border bg-background px-3 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              autoComplete="name"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium">Email</span>
            <input
              className="w-full h-10 rounded-md border bg-background px-3 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium">Password</span>
            <input
              className="w-full h-10 rounded-md border bg-background px-3 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="min 8 characters"
              type="password"
              autoComplete="current-password"
            />
          </label>

          <div className="flex gap-2">
            <Button disabled={!canSubmit || busy} onClick={handleSignUp} type="button">
              Sign up
            </Button>
            <Button disabled={!canSubmit || busy} onClick={handleSignIn} type="button" variant="secondary">
              Sign in
            </Button>
            <Button disabled={busy} onClick={handleSignOut} type="button" variant="outline">
              Sign out
            </Button>
          </div>

          <div className="pt-2">
            <Button type="button" variant="ghost" onClick={() => navigate("/")}>
              Back home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

