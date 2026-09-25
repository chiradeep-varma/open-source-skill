import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, handleApiError, ApiError } from "@/lib/api-helpers";
import { parseTrelloExport, TrelloImportError } from "@/lib/trelloImport";
import { positionForAppend } from "@/lib/ordering";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();

    let parsed;
    try {
      parsed = parseTrelloExport(body);
    } catch (err) {
      if (err instanceof TrelloImportError) throw new ApiError(400, err.message);
      throw err;
    }

    const board = await prisma.$transaction(async (tx) => {
      const board = await tx.board.create({
        data: {
          name: parsed.boardName,
          createdById: user.id,
          members: { create: { userId: user.id, role: "owner" } },
        },
      });

      const labelIdMap = new Map<string, string>();
      for (const label of parsed.labels) {
        const created = await tx.label.create({
          data: { boardId: board.id, name: label.name, color: label.color },
        });
        labelIdMap.set(label.trelloId, created.id);
      }

      let listPosition = 0;
      for (const list of parsed.lists) {
        listPosition = positionForAppend(listPosition === 0 ? undefined : listPosition);
        const createdList = await tx.list.create({
          data: { boardId: board.id, name: list.name, position: listPosition },
        });

        let cardPosition = 0;
        for (const card of list.cards) {
          cardPosition = positionForAppend(cardPosition === 0 ? undefined : cardPosition);
          const createdCard = await tx.card.create({
            data: {
              listId: createdList.id,
              title: card.title,
              description: card.description,
              dueDate: card.dueDate ? new Date(card.dueDate) : null,
              position: cardPosition,
              createdById: user.id,
            },
          });

          for (const trelloLabelId of card.labelTrelloIds) {
            const labelId = labelIdMap.get(trelloLabelId);
            if (!labelId) continue;
            await tx.cardLabel.create({ data: { cardId: createdCard.id, labelId } });
          }

          let checklistPosition = 0;
          for (const checklist of card.checklists) {
            checklistPosition = positionForAppend(
              checklistPosition === 0 ? undefined : checklistPosition
            );
            const createdChecklist = await tx.checklist.create({
              data: {
                cardId: createdCard.id,
                title: checklist.title,
                position: checklistPosition,
              },
            });

            let itemPosition = 0;
            for (const item of checklist.items) {
              itemPosition = positionForAppend(itemPosition === 0 ? undefined : itemPosition);
              await tx.checklistItem.create({
                data: {
                  checklistId: createdChecklist.id,
                  text: item.text,
                  done: item.done,
                  position: itemPosition,
                },
              });
            }
          }
        }
      }

      return board;
    });

    return NextResponse.json({ board }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
