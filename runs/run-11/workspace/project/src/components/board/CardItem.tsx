"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card } from "@/types/models";
import { format, isPast } from "date-fns";

export default function CardItem({
  card,
  onOpen,
}: {
  card: Card;
  onOpen: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: { type: "card", listId: card.listId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const checklistTotal = card.checklists.reduce((n, c) => n + c.items.length, 0);
  const checklistDone = card.checklists.reduce((n, c) => n + c.items.filter((i) => i.done).length, 0);
  const overdue = card.dueDate && isPast(new Date(card.dueDate));

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onOpen}
      className="cursor-pointer rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-sm hover:border-indigo-400 touch-none"
    >
      {card.labels.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {card.labels.map(({ label }) => (
            <span
              key={label.id}
              className="h-2 w-8 rounded-full"
              style={{ backgroundColor: label.color }}
              title={label.name}
            />
          ))}
        </div>
      )}
      <p className="text-sm text-slate-800 dark:text-slate-100">{card.title}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        {card.dueDate && (
          <span
            className={`rounded px-1.5 py-0.5 ${
              overdue
                ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                : "bg-slate-100 dark:bg-slate-700"
            }`}
          >
            {format(new Date(card.dueDate), "MMM d")}
          </span>
        )}
        {checklistTotal > 0 && (
          <span className="rounded bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5">
            {checklistDone}/{checklistTotal}
          </span>
        )}
        {(card._count?.comments ?? 0) > 0 && (
          <span className="rounded bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5">
            💬 {card._count?.comments}
          </span>
        )}
        {card.members.length > 0 && (
          <span className="ml-auto flex -space-x-1">
            {card.members.map(({ user }) => (
              <span
                key={user.id}
                title={user.name}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-medium text-white ring-2 ring-white dark:ring-slate-800"
              >
                {user.name.slice(0, 1).toUpperCase()}
              </span>
            ))}
          </span>
        )}
      </div>
    </div>
  );
}
