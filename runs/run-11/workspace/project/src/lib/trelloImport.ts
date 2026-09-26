/**
 * Parses a Trello board JSON export (Trello's own "Export as JSON" feature)
 * into a normalized shape Corkboard can persist. Written from Trello's public
 * export format as observed in documentation/community write-ups, not from
 * any Trello source code. Power-Ups data, attachments, and custom fields are
 * intentionally dropped — see the parity matrix for what's in/out of scope.
 */

const TRELLO_COLOR_TO_HEX: Record<string, string> = {
  green: "#22c55e",
  yellow: "#eab308",
  orange: "#f97316",
  red: "#ef4444",
  purple: "#a855f7",
  blue: "#3b82f6",
  sky: "#0ea5e9",
  lime: "#84cc16",
  pink: "#ec4899",
  black: "#1f2937",
  null: "#6b7280",
};

export interface ParsedChecklistItem {
  text: string;
  done: boolean;
}

export interface ParsedChecklist {
  title: string;
  items: ParsedChecklistItem[];
}

export interface ParsedCard {
  trelloId: string;
  title: string;
  description: string;
  dueDate: string | null;
  labelTrelloIds: string[];
  checklists: ParsedChecklist[];
}

export interface ParsedList {
  trelloId: string;
  name: string;
  cards: ParsedCard[];
}

export interface ParsedLabel {
  trelloId: string;
  name: string;
  color: string;
}

export interface ParsedBoard {
  boardName: string;
  labels: ParsedLabel[];
  lists: ParsedList[];
}

interface TrelloCheckItem {
  name?: string;
  state?: string;
}
interface TrelloChecklist {
  id: string;
  name?: string;
  idCard: string;
  checkItems?: TrelloCheckItem[];
}
interface TrelloLabel {
  id: string;
  name?: string;
  color?: string | null;
}
interface TrelloCard {
  id: string;
  name?: string;
  desc?: string;
  due?: string | null;
  closed?: boolean;
  idList: string;
  idLabels?: string[];
  labels?: TrelloLabel[];
}
interface TrelloList {
  id: string;
  name?: string;
  closed?: boolean;
}
interface TrelloExport {
  name?: string;
  lists?: TrelloList[];
  cards?: TrelloCard[];
  labels?: TrelloLabel[];
  checklists?: TrelloChecklist[];
}

export class TrelloImportError extends Error {}

export function parseTrelloExport(raw: unknown): ParsedBoard {
  if (typeof raw !== "object" || raw === null) {
    throw new TrelloImportError("File is not a valid Trello export (expected a JSON object)");
  }
  const data = raw as TrelloExport;
  if (!Array.isArray(data.lists) || !Array.isArray(data.cards)) {
    throw new TrelloImportError(
      "File is missing 'lists' or 'cards' — this doesn't look like a Trello board export"
    );
  }

  const labels: ParsedLabel[] = (data.labels ?? [])
    .filter((l) => l.name || l.color)
    .map((l) => ({
      trelloId: l.id,
      name: l.name?.trim() || l.color || "label",
      color: TRELLO_COLOR_TO_HEX[l.color ?? "null"] ?? "#6b7280",
    }));

  const checklistsByCard = new Map<string, ParsedChecklist[]>();
  for (const cl of data.checklists ?? []) {
    const parsed: ParsedChecklist = {
      title: cl.name?.trim() || "Checklist",
      items: (cl.checkItems ?? []).map((item) => ({
        text: item.name?.trim() || "",
        done: item.state === "complete",
      })).filter((item) => item.text),
    };
    const existing = checklistsByCard.get(cl.idCard) ?? [];
    existing.push(parsed);
    checklistsByCard.set(cl.idCard, existing);
  }

  const openLists = data.lists.filter((l) => !l.closed);
  const listsById = new Map(openLists.map((l) => [l.id, l]));

  const cardsByList = new Map<string, ParsedCard[]>();
  for (const c of data.cards) {
    if (c.closed) continue;
    if (!listsById.has(c.idList)) continue;
    const parsedCard: ParsedCard = {
      trelloId: c.id,
      title: c.name?.trim() || "Untitled card",
      description: c.desc ?? "",
      dueDate: c.due ?? null,
      labelTrelloIds: c.idLabels ?? (c.labels ?? []).map((l) => l.id),
      checklists: checklistsByCard.get(c.id) ?? [],
    };
    const existing = cardsByList.get(c.idList) ?? [];
    existing.push(parsedCard);
    cardsByList.set(c.idList, existing);
  }

  const lists: ParsedList[] = openLists.map((l) => ({
    trelloId: l.id,
    name: l.name?.trim() || "Untitled list",
    cards: cardsByList.get(l.id) ?? [],
  }));

  return {
    boardName: data.name?.trim() || "Imported board",
    labels,
    lists,
  };
}
