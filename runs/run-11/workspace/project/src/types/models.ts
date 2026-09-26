export interface UserSummary {
  id: string;
  name: string;
  email: string;
}

export interface BoardSummary {
  id: string;
  name: string;
  archived: boolean;
  createdAt: string;
  members: { userId: string; role: string; user: UserSummary }[];
  _count?: { lists: number };
}

export interface Label {
  id: string;
  name: string;
  color: string;
  boardId: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
  position: number;
  checklistId: string;
}

export interface Checklist {
  id: string;
  title: string;
  position: number;
  cardId: string;
  items: ChecklistItem[];
}

export interface Comment {
  id: string;
  body: string;
  createdAt: string;
  authorId: string;
  author: { id: string; name: string };
}

export interface Card {
  id: string;
  title: string;
  description: string;
  position: number;
  dueDate: string | null;
  archived: boolean;
  listId: string;
  createdById: string;
  labels: { label: Label }[];
  members: { user: UserSummary }[];
  checklists: Checklist[];
  comments?: Comment[];
  _count?: { comments: number };
}

export interface ListWithCards {
  id: string;
  name: string;
  position: number;
  archived: boolean;
  boardId: string;
  cards: Card[];
}

export interface BoardDetail {
  id: string;
  name: string;
  archived: boolean;
  members: { userId: string; role: string; user: UserSummary }[];
  labels: Label[];
  lists: ListWithCards[];
}
