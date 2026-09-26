import { describe, it, expect } from "vitest";
import { parseTrelloExport, TrelloImportError } from "./trelloImport";

const sample = {
  name: "Sample Trello Board",
  lists: [
    { id: "list1", name: "Backlog", closed: false },
    { id: "list2", name: "Doing", closed: false },
    { id: "list3", name: "Archived List", closed: true },
  ],
  cards: [
    {
      id: "card1",
      name: "Migrate off Trello",
      desc: "Because seat pricing.",
      idList: "list1",
      closed: false,
      due: "2026-11-01T00:00:00.000Z",
      idLabels: ["label1"],
    },
    { id: "card2", name: "Closed card should be skipped", idList: "list1", closed: true },
    { id: "card3", name: "Card in Doing", idList: "list2", closed: false },
    { id: "card4", name: "Card in a closed list", idList: "list3", closed: false },
  ],
  labels: [{ id: "label1", name: "High priority", color: "red" }],
  checklists: [
    {
      id: "cl1",
      name: "Migration steps",
      idCard: "card1",
      checkItems: [
        { name: "Export from Trello", state: "complete" },
        { name: "Import into Corkboard", state: "incomplete" },
      ],
    },
  ],
};

describe("parseTrelloExport", () => {
  it("rejects a non-object payload", () => {
    expect(() => parseTrelloExport(null)).toThrow(TrelloImportError);
    expect(() => parseTrelloExport("not json")).toThrow(TrelloImportError);
  });

  it("rejects a payload missing lists/cards", () => {
    expect(() => parseTrelloExport({ name: "Not a board export" })).toThrow(TrelloImportError);
  });

  it("carries over the board name", () => {
    expect(parseTrelloExport(sample).boardName).toBe("Sample Trello Board");
  });

  it("drops closed lists entirely", () => {
    const parsed = parseTrelloExport(sample);
    expect(parsed.lists.map((l) => l.name)).toEqual(["Backlog", "Doing"]);
  });

  it("drops closed cards and cards belonging to closed lists", () => {
    const parsed = parseTrelloExport(sample);
    const backlog = parsed.lists.find((l) => l.name === "Backlog")!;
    expect(backlog.cards.map((c) => c.title)).toEqual(["Migrate off Trello"]);
    // card4 belonged to the closed "Archived List" and must not surface anywhere.
    const allTitles = parsed.lists.flatMap((l) => l.cards.map((c) => c.title));
    expect(allTitles).not.toContain("Card in a closed list");
    expect(allTitles).not.toContain("Closed card should be skipped");
  });

  it("maps Trello label colors to hex and keeps the label linked to its card", () => {
    const parsed = parseTrelloExport(sample);
    expect(parsed.labels).toEqual([{ trelloId: "label1", name: "High priority", color: "#ef4444" }]);
    const card = parsed.lists.flatMap((l) => l.cards).find((c) => c.title === "Migrate off Trello")!;
    expect(card.labelTrelloIds).toEqual(["label1"]);
  });

  it("attaches checklists to the right card and maps item completion state", () => {
    const parsed = parseTrelloExport(sample);
    const card = parsed.lists.flatMap((l) => l.cards).find((c) => c.title === "Migrate off Trello")!;
    expect(card.checklists).toEqual([
      {
        title: "Migration steps",
        items: [
          { text: "Export from Trello", done: true },
          { text: "Import into Corkboard", done: false },
        ],
      },
    ]);
  });

  it("carries over the due date and description", () => {
    const parsed = parseTrelloExport(sample);
    const card = parsed.lists.flatMap((l) => l.cards).find((c) => c.title === "Migrate off Trello")!;
    expect(card.dueDate).toBe("2026-11-01T00:00:00.000Z");
    expect(card.description).toBe("Because seat pricing.");
  });

  it("falls back to sensible defaults for untitled lists/cards", () => {
    const parsed = parseTrelloExport({
      lists: [{ id: "l1", name: "", closed: false }],
      cards: [{ id: "c1", name: "", idList: "l1", closed: false }],
    });
    expect(parsed.lists[0].name).toBe("Untitled list");
    expect(parsed.lists[0].cards[0].title).toBe("Untitled card");
    expect(parsed.boardName).toBe("Imported board");
  });
});
