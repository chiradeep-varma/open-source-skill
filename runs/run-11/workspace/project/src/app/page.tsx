"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { apiFetch, ClientApiError } from "@/lib/api-client";
import type { BoardSummary } from "@/types/models";
import TeamDialog from "@/components/TeamDialog";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [boards, setBoards] = useState<BoardSummary[] | null>(null);
  const [newBoardName, setNewBoardName] = useState("");
  const [creating, setCreating] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    apiFetch<{ boards: BoardSummary[] }>("/api/boards").then((d) => setBoards(d.boards));
  }, []);

  async function handleCreateBoard(e: React.FormEvent) {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    setCreating(true);
    try {
      const { board } = await apiFetch<{ board: BoardSummary }>("/api/boards", {
        method: "POST",
        body: JSON.stringify({ name: newBoardName }),
      });
      setBoards((b) => [...(b ?? []), board]);
      setNewBoardName("");
      router.push(`/boards/${board.id}`);
    } finally {
      setCreating(false);
    }
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    setImporting(true);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const { board } = await apiFetch<{ board: BoardSummary }>("/api/import/trello", {
        method: "POST",
        body: JSON.stringify(json),
      });
      router.push(`/boards/${board.id}`);
    } catch (err) {
      setImportError(
        err instanceof ClientApiError
          ? err.message
          : "Couldn't read that file — make sure it's a Trello 'Export as JSON' file."
      );
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Corkboard</h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-500 hidden sm:inline">{session?.user?.email}</span>
            <button
              onClick={() => setShowTeam(true)}
              className="rounded-md border border-slate-300 dark:border-slate-700 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Team
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="rounded-md border border-slate-300 dark:border-slate-700 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Your boards</h2>
            <p className="text-sm text-slate-500">Boards you&apos;re a member of on this instance.</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleImportFile}
              className="hidden"
              id="trello-import"
            />
            <label
              htmlFor="trello-import"
              className="cursor-pointer rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {importing ? "Importing…" : "Import from Trello"}
            </label>
          </div>
        </div>

        {importError && (
          <p className="mb-4 rounded-md bg-red-50 dark:bg-red-950 px-3 py-2 text-sm text-red-700 dark:text-red-300">
            {importError}
          </p>
        )}

        <form onSubmit={handleCreateBoard} className="mb-8 flex gap-2">
          <input
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="New board name…"
            className="flex-1 max-w-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={creating}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {creating ? "Creating…" : "Create board"}
          </button>
        </form>

        {boards === null ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : boards.length === 0 ? (
          <p className="text-sm text-slate-500">No boards yet — create your first one above.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {boards.map((board) => (
              <a
                key={board.id}
                href={`/boards/${board.id}`}
                className="block rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:border-indigo-400 hover:shadow-md transition"
              >
                <h3 className="font-medium text-slate-900 dark:text-slate-50">{board.name}</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {board._count?.lists ?? 0} list{board._count?.lists === 1 ? "" : "s"} ·{" "}
                  {board.members.length} member{board.members.length === 1 ? "" : "s"}
                </p>
              </a>
            ))}
          </div>
        )}
      </main>

      {showTeam && <TeamDialog onClose={() => setShowTeam(false)} />}
    </div>
  );
}
