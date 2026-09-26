"use client";

import { useEffect, useState } from "react";
import { apiFetch, ClientApiError } from "@/lib/api-client";
import type { UserSummary } from "@/types/models";
import Modal from "@/components/Modal";

export default function TeamDialog({ onClose }: { onClose: () => void }) {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch<{ users: UserSummary[] }>("/api/users").then((d) => setUsers(d.users));
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { user } = await apiFetch<{ user: UserSummary }>("/api/users", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      setUsers((u) => [...u, user].sort((a, b) => a.name.localeCompare(b.name)));
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err instanceof ClientApiError ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal onClose={onClose}>
      <div className="p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Team</h2>
        <p className="mt-1 text-sm text-slate-500">
          Everyone with an account can sign in to this instance. Add the rest of your team below.
        </p>

        <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800 max-h-48 overflow-y-auto">
          {users.map((u) => (
            <li key={u.id} className="flex items-center justify-between py-2 text-sm">
              <span className="font-medium text-slate-800 dark:text-slate-200">{u.name}</span>
              <span className="text-slate-500">{u.email}</span>
            </li>
          ))}
        </ul>

        <form onSubmit={handleAdd} className="mt-4 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
          {error && (
            <p className="rounded-md bg-red-50 dark:bg-red-950 px-3 py-2 text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
          )}
          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="Full name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
            <input
              placeholder="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>
          <input
            placeholder="Temporary password (8+ chars)"
            type="text"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Adding…" : "Add teammate"}
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
