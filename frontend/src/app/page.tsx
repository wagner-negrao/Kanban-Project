"use client";

import { useState } from "react";
import { KanbanBoard } from "@/components/KanbanBoard";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "user" && password === "password") {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Invalid credentials. Try user / password");
    }
  };

  if (isLoggedIn) {
    return <KanbanBoard onLogout={() => setIsLoggedIn(false)} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--surface)] p-6">
      <div className="w-full max-w-md rounded-2xl border border-[var(--stroke)] bg-white p-8 shadow-[var(--shadow)]">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--gray-text)]">
            Kanban Studio
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-[var(--navy-dark)]">
            Welcome Back
          </h1>
        </div>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--gray-text)]">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-xl border border-[var(--stroke)] px-4 py-3 text-sm focus:border-[var(--primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--primary-blue)]"
              placeholder="Enter 'user'"
              required
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--gray-text)]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-[var(--stroke)] px-4 py-3 text-sm focus:border-[var(--primary-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--primary-blue)]"
              placeholder="Enter 'password'"
              required
            />
          </div>
          
          <button
            type="submit"
            className="mt-2 rounded-xl bg-[var(--secondary-purple)] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-opacity-90 active:scale-95"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
