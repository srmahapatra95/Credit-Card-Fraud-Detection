import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api/client";
import { User, Mail, Lock, Loader2, AlertCircle, CircleCheck, CircleX } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const username = form.username.trim();
    if (username.length < 3) {
      setUsernameStatus("idle");
      return;
    }

    setUsernameStatus("checking");

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.get(`/users/check-username/${username}`);
        setUsernameStatus(res.data.available ? "available" : "taken");
      } catch {
        setUsernameStatus("idle");
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [form.username]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/users/register", form);
      navigate("/login");
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((d: any) => d.msg).join(". "));
      } else {
        setError(detail || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Register to start detecting fraud
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="username"
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className={`flex h-10 w-full rounded-md border bg-background pl-9 pr-9 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                  usernameStatus === "available" ? "border-green-500" : usernameStatus === "taken" ? "border-red-500" : ""
                }`}
                placeholder="At least 3 characters"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {usernameStatus === "checking" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                {usernameStatus === "available" && <CircleCheck className="h-4 w-4 text-green-500" />}
                {usernameStatus === "taken" && <CircleX className="h-4 w-4 text-red-500" />}
              </div>
            </div>
            {usernameStatus === "taken" && (
              <p className="text-xs text-red-500">Username is already taken</p>
            )}
            {usernameStatus === "available" && (
              <p className="text-xs text-green-500">Username is available</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="flex h-10 w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="flex h-10 w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Min 8 chars, uppercase, lowercase, digit"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || usernameStatus === "taken" || usernameStatus === "checking"}
            className="flex items-center justify-center gap-2 w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</> : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
