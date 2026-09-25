"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { apiFetch } from "@/lib/api-client";
import type { BoardDetail, ListWithCards, Card } from "@/types/models";
import { positionBetween } from "@/lib/ordering";
import ListColumn from "./ListColumn";
import CardItem from "./CardItem";
import CardModal from "./CardModal";

function findListForCard(lists: ListWithCards[], cardId: string): ListWithCards | undefined {
  return lists.find((l) => l.cards.some((c) => c.id === cardId));
}

export default function KanbanBoard({ boardId }: { boardId: string }) {
  const [board, setBoard] = useState<BoardDetail | null>(null);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [activeList, setActiveList] = useState<ListWithCards | null>(null);
  const [openCard, setOpenCard] = useState<Card | null>(null);
  const [newListName, setNewListName] = useState("");
  const [addingList, setAddingList] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  useEffect(() => {
    apiFetch<{ board: BoardDetail }>(`/api/boards/${boardId}`).then((d) => setBoard(d.board));
  }, [boardId]);

  if (!board) {
    return <p className="p-8 text-sm text-slate-500">Loading board…</p>;
  }

  const lists = board.lists;

  function setLists(updater: (lists: ListWithCards[]) => ListWithCards[]) {
    setBoard((b) => (b ? { ...b, lists: updater(b.lists) } : b));
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    if (active.data.current?.type === "card") {
      const list = findListForCard(lists, active.id as string);
      setActiveCard(list?.cards.find((c) => c.id === active.id) ?? null);
    } else if (active.data.current?.type === "list") {
      setActiveList(lists.find((l) => l.id === active.id) ?? null);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over || active.data.current?.type !== "card") return;

    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    const sourceList = findListForCard(lists, activeId);
    if (!sourceList) return;

    const overIsCard = over.data.current?.type === "card";
    const targetListId = overIsCard ? findListForCard(lists, overId)?.id : overId;
    if (!targetListId) return;

    if (sourceList.id === targetListId && !overIsCard) return;

    setLists((prev) => {
      const source = prev.find((l) => l.id === sourceList.id);
      const card = source?.cards.find((c) => c.id === activeId);
      if (!source || !card) return prev;

      return prev.map((l) => {
        if (l.id === sourceList.id && l.id !== targetListId) {
          return { ...l, cards: l.cards.filter((c) => c.id !== activeId) };
        }
        if (l.id === targetListId) {
          const withoutActive = l.cards.filter((c) => c.id !== activeId);
          const overIndex = overIsCard
            ? withoutActive.findIndex((c) => c.id === overId)
            : withoutActive.length;
          const insertAt = overIndex === -1 ? withoutActive.length : overIndex;
          const updatedCard = { ...card, listId: targetListId };
          return {
            ...l,
            cards: [
              ...withoutActive.slice(0, insertAt),
              updatedCard,
              ...withoutActive.slice(insertAt),
            ],
          };
        }
        return l;
      });
    });
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveCard(null);
    setActiveList(null);
    if (!over) return;

    if (active.data.current?.type === "list") {
      const oldIndex = lists.findIndex((l) => l.id === active.id);
      const newIndex = lists.findIndex((l) => l.id === over.id);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

      const reordered = arrayMove(lists, oldIndex, newIndex);
      setLists(() => reordered);

      const before = reordered[newIndex - 1]?.position;
      const after = reordered[newIndex + 1]?.position;
      const position = positionBetween(before, after);
      setLists((prev) => prev.map((l) => (l.id === active.id ? { ...l, position } : l)));
      await apiFetch(`/api/lists/${active.id}`, {
        method: "PATCH",
        body: JSON.stringify({ position }),
      });
      return;
    }

    if (active.data.current?.type === "card") {
      const cardId = active.id as string;
      const targetList = findListForCard(lists, cardId);
      if (!targetList) return;
      const index = targetList.cards.findIndex((c) => c.id === cardId);
      const before = targetList.cards[index - 1]?.position;
      const after = targetList.cards[index + 1]?.position;
      const position = positionBetween(before, after);

      setLists((prev) =>
        prev.map((l) =>
          l.id === targetList.id
            ? { ...l, cards: l.cards.map((c) => (c.id === cardId ? { ...c, position } : c)) }
            : l
        )
      );

      await apiFetch(`/api/cards/${cardId}`, {
        method: "PATCH",
        body: JSON.stringify({ listId: targetList.id, position }),
      });
    }
  }

  async function handleAddList(e: React.FormEvent) {
    e.preventDefault();
    if (!newListName.trim()) return;
    const { list } = await apiFetch<{ list: ListWithCards }>(`/api/boards/${boardId}/lists`, {
      method: "POST",
      body: JSON.stringify({ name: newListName.trim() }),
    });
    setLists((prev) => [...prev, { ...list, cards: [] }]);
    setNewListName("");
    setAddingList(false);
  }

  async function handleAddCard(listId: string, title: string) {
    const { card } = await apiFetch<{ card: Card }>(`/api/lists/${listId}/cards`, {
      method: "POST",
      body: JSON.stringify({ title }),
    });
    setLists((prev) => prev.map((l) => (l.id === listId ? { ...l, cards: [...l.cards, card] } : l)));
  }

  async function handleRenameList(listId: string, name: string) {
    setLists((prev) => prev.map((l) => (l.id === listId ? { ...l, name } : l)));
    await apiFetch(`/api/lists/${listId}`, { method: "PATCH", body: JSON.stringify({ name }) });
  }

  async function handleDeleteList(listId: string) {
    setLists((prev) => prev.filter((l) => l.id !== listId));
    await apiFetch(`/api/lists/${listId}`, { method: "DELETE" });
  }

  function handleCardUpdated(updated: Card) {
    setLists((prev) =>
      prev.map((l) => {
        if (l.id === updated.listId) {
          const exists = l.cards.some((c) => c.id === updated.id);
          return {
            ...l,
            cards: exists
              ? l.cards.map((c) => (c.id === updated.id ? updated : c))
              : [...l.cards, updated],
          };
        }
        return { ...l, cards: l.cards.filter((c) => c.id !== updated.id) };
      })
    );
    setOpenCard(updated);
  }

  function handleCardDeleted(cardId: string, listId: string) {
    setLists((prev) =>
      prev.map((l) => (l.id === listId ? { ...l, cards: l.cards.filter((c) => c.id !== cardId) } : l))
    );
    setOpenCard(null);
  }

  return (
    <div className="h-full overflow-x-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-full items-start gap-3 p-4">
          <SortableContext items={lists.map((l) => l.id)} strategy={horizontalListSortingStrategy}>
            {lists.map((list) => (
              <ListColumn
                key={list.id}
                list={list}
                onOpenCard={setOpenCard}
                onAddCard={handleAddCard}
                onRenameList={handleRenameList}
                onDeleteList={handleDeleteList}
              />
            ))}
          </SortableContext>

          <div className="w-72 shrink-0">
            {addingList ? (
              <form
                onSubmit={handleAddList}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 space-y-2"
              >
                <input
                  autoFocus
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="List name…"
                  className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-indigo-500"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500"
                  >
                    Add list
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddingList(false)}
                    className="text-xs text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setAddingList(true)}
                className="w-full rounded-xl border border-dashed border-slate-300 dark:border-slate-700 px-3 py-2 text-left text-sm text-slate-500 hover:bg-white dark:hover:bg-slate-900"
              >
                + Add a list
              </button>
            )}
          </div>
        </div>

        <DragOverlay>
          {activeCard && <CardItem card={activeCard} onOpen={() => {}} />}
          {activeList && (
            <div className="w-72 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 shadow-lg">
              <p className="text-sm font-medium">{activeList.name}</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {openCard && (
        <CardModal
          card={openCard}
          board={board}
          onClose={() => setOpenCard(null)}
          onUpdated={handleCardUpdated}
          onDeleted={() => handleCardDeleted(openCard.id, openCard.listId)}
          onBoardLabelsChanged={(labels) => setBoard((b) => (b ? { ...b, labels } : b))}
        />
      )}
    </div>
  );
}
