"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import type { BoardDetail, UserSummary } from "@/types/models";
import KanbanBoard from "@/components/board/KanbanBoard";

export default function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const router = useRouter();
  const [boardMeta, setBoardMeta] = useState<{ name: string; members: BoardDetail["members"] } | null>(
    null
  );
  const [allUsers, setAllUsers] = useState<UserSummary[]>([]);
  const [showMembers, setShowMembers] = useState(false);
  // Bump this to force KanbanBoard to refetch after a membership change.
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    apiFetch<{ board: BoardDetail }>(`/api/boards/${boardId}`).then((d) =>
      setBoardMeta({ name: d.board.name, members: d.board.members })
    );
    apiFetch<{ users: UserSummary[] }>("/api/users").then((d) => setAllUsers(d.users));
  }, [boardId, refreshKey]);

  async function addMember(userId: string) {
    await apiFetch(`/api/boards/${boardId}/members`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
    setRefreshKey((k) => k + 1);
  }

  async function removeMember(userId: string) {
    await apiFetch(`/api/boards/${boardId}/members/${userId}`, { method: "DELETE" });
    setRefreshKey((k) => k + 1);
  }

  async function handleExport() {
    const res = await fetch(`/api/boards/${boardId}/export`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${boardMeta?.name ?? "board"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleDeleteBoard() {
    if (!confirm(`Delete board "${boardMeta?.name}"? This can't be undone.`)) return;
    await apiFetch(`/api/boards/${boardId}`, { method: "DELETE" });
    router.push("/");
  }

  const memberIds = new Set((boardMeta?.members ?? []).map((m) => m.userId));
  const nonMembers = allUsers.filter((u) => !memberIds.has(u.id));

  return (
    <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <header className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="shrink-0 text-sm text-slate-500 hover:text-slate-700">
            ← Boards
          </Link>
          <h1 className="truncate text-lg font-semibold text-slate-900 dark:text-slate-50">
            {boardMeta?.name ?? "…"}
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-sm relative">
          <button
            onClick={() => setShowMembers((s) => !s)}
            className="rounded-md border border-slate-300 dark:border-slate-700 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Members ({boardMeta?.members.length ?? 0})
          </button>
          {showMembers && (
            <div className="absolute right-0 top-10 z-10 w-64 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-lg">
              <p className="mb-2 text-xs font-medium uppercase text-slate-500">On this board</p>
              <ul className="mb-3 space-y-1">
                {boardMeta?.members.map((m) => (
                  <li key={m.userId} className="flex items-center justify-between text-sm">
                    <span>
                      {m.user.name} {m.role === "owner" && <span className="text-slate-400">(owner)</span>}
                    </span>
                    {m.role !== "owner" && (
                      <button
                        onClick={() => removeMember(m.userId)}
                        className="text-xs text-slate-400 hover:text-red-500"
                      >
                        remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {nonMembers.length > 0 && (
                <>
                  <p className="mb-1 text-xs font-medium uppercase text-slate-500">Add teammate</p>
                  <ul className="space-y-1">
                    {nonMembers.map((u) => (
                      <li key={u.id}>
                        <button
                          onClick={() => addMember(u.id)}
                          className="text-sm text-indigo-600 hover:text-indigo-700"
                        >
                          + {u.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
          <button
            onClick={handleExport}
            className="rounded-md border border-slate-300 dark:border-slate-700 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Export
          </button>
          <button
            onClick={handleDeleteBoard}
            className="rounded-md border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
          >
            Delete
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        <KanbanBoard boardId={boardId} key={refreshKey} />
      </div>
    </div>
  );
}
