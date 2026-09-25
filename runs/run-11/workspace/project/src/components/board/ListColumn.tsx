"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ListWithCards, Card } from "@/types/models";
import CardItem from "./CardItem";

export default function ListColumn({
  list,
  onOpenCard,
  onAddCard,
  onRenameList,
  onDeleteList,
}: {
  list: ListWithCards;
  onOpenCard: (card: Card) => void;
  onAddCard: (listId: string, title: string) => void;
  onRenameList: (listId: string, name: string) => void;
  onDeleteList: (listId: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(list.name);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: list.id,
    data: { type: "list" },
  });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: list.id,
    data: { type: "list-drop" },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  function submitNewCard(e: React.FormEvent) {
    e.preventDefault();
    if (!newCardTitle.trim()) {
      setAdding(false);
      return;
    }
    onAddCard(list.id, newCardTitle.trim());
    setNewCardTitle("");
  }

  function submitRename() {
    setEditingName(false);
    if (name.trim() && name.trim() !== list.name) onRenameList(list.id, name.trim());
    else setName(list.name);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex w-72 shrink-0 flex-col rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between gap-2 px-3 py-2 cursor-grab touch-none"
      >
        {editingName ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={submitRename}
            onKeyDown={(e) => e.key === "Enter" && submitRename()}
            className="w-full rounded border border-indigo-400 bg-white dark:bg-slate-800 px-2 py-1 text-sm font-medium outline-none"
          />
        ) : (
          <h3
            onClick={() => setEditingName(true)}
            className="text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            {list.name}
          </h3>
        )}
        <button
          onClick={() => {
            if (confirm(`Delete list "${list.name}" and all its cards?`)) onDeleteList(list.id);
          }}
          className="text-slate-400 hover:text-red-500 text-xs"
          title="Delete list"
        >
          ✕
        </button>
      </div>

      <div ref={setDroppableRef} className="flex-1 space-y-2 px-2 pb-2 min-h-[8px]">
        <SortableContext items={list.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {list.cards.map((card) => (
            <CardItem key={card.id} card={card} onOpen={() => onOpenCard(card)} />
          ))}
        </SortableContext>
      </div>

      <div className="p-2">
        {adding ? (
          <form onSubmit={submitNewCard} className="space-y-2">
            <textarea
              autoFocus
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Card title…"
              rows={2}
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5 text-sm outline-none focus:border-indigo-500"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submitNewCard(e);
                }
              }}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500"
              >
                Add card
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdding(false);
                  setNewCardTitle("");
                }}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="w-full rounded-md px-2 py-1.5 text-left text-sm text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            + Add a card
          </button>
        )}
      </div>
    </div>
  );
}
