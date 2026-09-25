"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import type { BoardDetail, Card, Checklist } from "@/types/models";
import Modal from "@/components/Modal";

const LABEL_COLORS = [
  "#22c55e",
  "#eab308",
  "#f97316",
  "#ef4444",
  "#a855f7",
  "#3b82f6",
  "#0ea5e9",
  "#ec4899",
  "#6b7280",
];

export default function CardModal({
  card: initialCard,
  board,
  onClose,
  onUpdated,
  onDeleted,
  onBoardLabelsChanged,
}: {
  card: Card;
  board: BoardDetail;
  onClose: () => void;
  onUpdated: (card: Card) => void;
  onDeleted: () => void;
  onBoardLabelsChanged: (labels: BoardDetail["labels"]) => void;
}) {
  const [card, setCard] = useState<Card>(initialCard);
  const [title, setTitle] = useState(initialCard.title);
  const [description, setDescription] = useState(initialCard.description);
  const [newComment, setNewComment] = useState("");
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [showNewLabel, setShowNewLabel] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState(LABEL_COLORS[0]);

  useEffect(() => {
    apiFetch<{ card: Card }>(`/api/cards/${initialCard.id}`).then((d) => {
      setCard(d.card);
      setTitle(d.card.title);
      setDescription(d.card.description);
    });
  }, [initialCard.id]);

  async function patchCard(data: Record<string, unknown>) {
    const { card: updated } = await apiFetch<{ card: Card }>(`/api/cards/${card.id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    const merged = { ...card, ...updated };
    setCard(merged);
    onUpdated(merged);
    return merged;
  }

  function submitTitle() {
    if (title.trim() && title.trim() !== card.title) patchCard({ title: title.trim() });
  }

  function submitDescription() {
    if (description !== card.description) patchCard({ description });
  }

  async function toggleLabel(labelId: string) {
    const attached = card.labels.some((l) => l.label.id === labelId);
    if (attached) {
      await apiFetch(`/api/cards/${card.id}/labels/${labelId}`, { method: "DELETE" });
      const updated = { ...card, labels: card.labels.filter((l) => l.label.id !== labelId) };
      setCard(updated);
      onUpdated(updated);
    } else {
      await apiFetch(`/api/cards/${card.id}/labels`, {
        method: "POST",
        body: JSON.stringify({ labelId }),
      });
      const label = board.labels.find((l) => l.id === labelId)!;
      const updated = { ...card, labels: [...card.labels, { label }] };
      setCard(updated);
      onUpdated(updated);
    }
  }

  async function createLabel(e: React.FormEvent) {
    e.preventDefault();
    if (!newLabelName.trim()) return;
    const { label } = await apiFetch<{ label: BoardDetail["labels"][number] }>(
      `/api/boards/${board.id}/labels`,
      { method: "POST", body: JSON.stringify({ name: newLabelName.trim(), color: newLabelColor }) }
    );
    onBoardLabelsChanged([...board.labels, label]);
    setNewLabelName("");
    setShowNewLabel(false);

    // Attach directly with the freshly-created label object, rather than
    // going through toggleLabel(label.id): that looks the label up in the
    // `board` prop, which still reflects the pre-creation state in this
    // closure (onBoardLabelsChanged's update hasn't re-rendered us yet).
    await apiFetch(`/api/cards/${card.id}/labels`, {
      method: "POST",
      body: JSON.stringify({ labelId: label.id }),
    });
    const updated = { ...card, labels: [...card.labels, { label }] };
    setCard(updated);
    onUpdated(updated);
  }

  async function toggleMember(userId: string) {
    const attached = card.members.some((m) => m.user.id === userId);
    if (attached) {
      await apiFetch(`/api/cards/${card.id}/members/${userId}`, { method: "DELETE" });
      const updated = { ...card, members: card.members.filter((m) => m.user.id !== userId) };
      setCard(updated);
      onUpdated(updated);
    } else {
      await apiFetch(`/api/cards/${card.id}/members`, {
        method: "POST",
        body: JSON.stringify({ userId }),
      });
      const user = board.members.find((m) => m.userId === userId)!.user;
      const updated = { ...card, members: [...card.members, { user }] };
      setCard(updated);
      onUpdated(updated);
    }
  }

  async function addChecklist(e: React.FormEvent) {
    e.preventDefault();
    if (!newChecklistTitle.trim()) return;
    const { checklist } = await apiFetch<{ checklist: Checklist }>(
      `/api/cards/${card.id}/checklists`,
      { method: "POST", body: JSON.stringify({ title: newChecklistTitle.trim() }) }
    );
    const updated = { ...card, checklists: [...card.checklists, checklist] };
    setCard(updated);
    onUpdated(updated);
    setNewChecklistTitle("");
  }

  async function deleteChecklist(checklistId: string) {
    await apiFetch(`/api/checklists/${checklistId}`, { method: "DELETE" });
    const updated = { ...card, checklists: card.checklists.filter((c) => c.id !== checklistId) };
    setCard(updated);
    onUpdated(updated);
  }

  async function addChecklistItem(checklistId: string, text: string) {
    if (!text.trim()) return;
    const { item } = await apiFetch<{ item: Checklist["items"][number] }>(
      `/api/checklists/${checklistId}/items`,
      { method: "POST", body: JSON.stringify({ text: text.trim() }) }
    );
    const updated = {
      ...card,
      checklists: card.checklists.map((c) =>
        c.id === checklistId ? { ...c, items: [...c.items, item] } : c
      ),
    };
    setCard(updated);
    onUpdated(updated);
  }

  async function toggleItem(checklistId: string, itemId: string, done: boolean) {
    await apiFetch(`/api/checklist-items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ done }),
    });
    const updated = {
      ...card,
      checklists: card.checklists.map((c) =>
        c.id === checklistId
          ? { ...c, items: c.items.map((i) => (i.id === itemId ? { ...i, done } : i)) }
          : c
      ),
    };
    setCard(updated);
    onUpdated(updated);
  }

  async function deleteItem(checklistId: string, itemId: string) {
    await apiFetch(`/api/checklist-items/${itemId}`, { method: "DELETE" });
    const updated = {
      ...card,
      checklists: card.checklists.map((c) =>
        c.id === checklistId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c
      ),
    };
    setCard(updated);
    onUpdated(updated);
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;
    const { comment } = await apiFetch<{ comment: NonNullable<Card["comments"]>[number] }>(
      `/api/cards/${card.id}/comments`,
      { method: "POST", body: JSON.stringify({ body: newComment.trim() }) }
    );
    setCard((c) => ({ ...c, comments: [...(c.comments ?? []), comment] }));
    setNewComment("");
  }

  async function handleDelete() {
    if (!confirm("Delete this card?")) return;
    await apiFetch(`/api/cards/${card.id}`, { method: "DELETE" });
    onDeleted();
  }

  async function moveToList(listId: string) {
    await patchCard({ listId });
  }

  return (
    <Modal onClose={onClose} wide>
      <div className="max-h-[85vh] overflow-y-auto p-5">
        <div className="flex items-start justify-between gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={submitTitle}
            onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
            className="w-full text-lg font-semibold bg-transparent outline-none text-slate-900 dark:text-slate-50 border-b border-transparent focus:border-indigo-400 pb-1"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 shrink-0">
            ✕
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div>
            <label className="block text-xs font-medium uppercase text-slate-500 mb-1">List</label>
            <select
              value={card.listId}
              onChange={(e) => moveToList(e.target.value)}
              className="rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1 text-sm"
            >
              {board.lists.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium uppercase text-slate-500 mb-1">Due date</label>
            <input
              type="date"
              value={card.dueDate ? card.dueDate.slice(0, 10) : ""}
              onChange={(e) => patchCard({ dueDate: e.target.value ? e.target.value : null })}
              className="rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1 text-sm"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-medium uppercase text-slate-500 mb-1">Labels</label>
          <div className="flex flex-wrap gap-1.5 items-center">
            {board.labels.map((label) => {
              const active = card.labels.some((l) => l.label.id === label.id);
              return (
                <button
                  key={label.id}
                  onClick={() => toggleLabel(label.id)}
                  style={{ backgroundColor: label.color }}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium text-white ${
                    active ? "ring-2 ring-offset-1 ring-slate-900 dark:ring-slate-100" : "opacity-50"
                  }`}
                >
                  {label.name}
                </button>
              );
            })}
            <button
              onClick={() => setShowNewLabel((s) => !s)}
              className="rounded-full border border-dashed border-slate-300 dark:border-slate-700 px-2.5 py-1 text-xs text-slate-500"
            >
              + label
            </button>
          </div>
          {showNewLabel && (
            <form onSubmit={createLabel} className="mt-2 flex flex-wrap items-center gap-2">
              <input
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                placeholder="Label name"
                className="rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1 text-sm"
              />
              <div className="flex gap-1">
                {LABEL_COLORS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setNewLabelColor(c)}
                    style={{ backgroundColor: c }}
                    className={`h-5 w-5 rounded-full ${newLabelColor === c ? "ring-2 ring-slate-900 dark:ring-slate-100" : ""}`}
                  />
                ))}
              </div>
              <button type="submit" className="rounded-md bg-indigo-600 px-2 py-1 text-xs text-white">
                Create
              </button>
            </form>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-xs font-medium uppercase text-slate-500 mb-1">Members</label>
          <div className="flex flex-wrap gap-1.5">
            {board.members.map(({ user }) => {
              const active = card.members.some((m) => m.user.id === user.id);
              return (
                <button
                  key={user.id}
                  onClick={() => toggleMember(user.id)}
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${
                    active
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                      : "border-slate-300 dark:border-slate-700 text-slate-500"
                  }`}
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[9px] font-medium text-white">
                    {user.name.slice(0, 1).toUpperCase()}
                  </span>
                  {user.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-medium uppercase text-slate-500 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={submitDescription}
            rows={3}
            placeholder="Add a more detailed description…"
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-indigo-500"
          />
        </div>

        <div className="mt-5 space-y-4">
          <label className="block text-xs font-medium uppercase text-slate-500">Checklists</label>
          {card.checklists.map((checklist) => {
            const total = checklist.items.length;
            const done = checklist.items.filter((i) => i.done).length;
            return (
              <div key={checklist.id} className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{checklist.title}</p>
                  <button
                    onClick={() => deleteChecklist(checklist.id)}
                    className="text-xs text-slate-400 hover:text-red-500"
                  >
                    delete
                  </button>
                </div>
                {total > 0 && (
                  <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-1.5 rounded-full bg-indigo-500"
                      style={{ width: `${(done / total) * 100}%` }}
                    />
                  </div>
                )}
                <ul className="mt-2 space-y-1">
                  {checklist.items.map((item) => (
                    <li key={item.id} className="flex items-center gap-2 text-sm group">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={(e) => toggleItem(checklist.id, item.id, e.target.checked)}
                      />
                      <span className={item.done ? "line-through text-slate-400" : ""}>{item.text}</span>
                      <button
                        onClick={() => deleteItem(checklist.id, item.id)}
                        className="ml-auto text-xs text-slate-300 opacity-0 group-hover:opacity-100 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
                <ChecklistItemForm onAdd={(text) => addChecklistItem(checklist.id, text)} />
              </div>
            );
          })}
          <form onSubmit={addChecklist} className="flex gap-2">
            <input
              value={newChecklistTitle}
              onChange={(e) => setNewChecklistTitle(e.target.value)}
              placeholder="New checklist name…"
              className="flex-1 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-indigo-500"
            />
            <button type="submit" className="rounded-md border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm">
              Add checklist
            </button>
          </form>
        </div>

        <div className="mt-5">
          <label className="block text-xs font-medium uppercase text-slate-500 mb-2">Comments</label>
          <form onSubmit={submitComment} className="flex gap-2 mb-3">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment…"
              className="flex-1 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-indigo-500"
            />
            <button type="submit" className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white">
              Post
            </button>
          </form>
          <ul className="space-y-2">
            {(card.comments ?? []).map((c) => (
              <li key={c.id} className="rounded-md bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{c.author.name}</p>
                <p className="text-slate-800 dark:text-slate-100">{c.body}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
          <button onClick={handleDelete} className="text-sm text-red-600 hover:text-red-700">
            Delete card
          </button>
        </div>
      </div>
    </Modal>
  );
}

function ChecklistItemForm({ onAdd }: { onAdd: (text: string) => void }) {
  const [text, setText] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onAdd(text);
        setText("");
      }}
      className="mt-2 flex gap-2"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add an item…"
        className="flex-1 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1 text-sm outline-none focus:border-indigo-500"
      />
      <button type="submit" className="text-xs text-indigo-600 hover:text-indigo-700">
        Add
      </button>
    </form>
  );
}
