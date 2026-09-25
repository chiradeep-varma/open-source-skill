/**
 * Fractional-index ordering: every list/card has a float `position`. To move
 * an item between two neighbors we only need to update that one row, not
 * renumber the whole list. Gaps of 1000 between fresh items leave room for
 * ~10 reorders before two neighbors' positions get within float-precision
 * distance of each other, which is more than an 8-person team will hit in
 * practice; if it ever does, a periodic renumber job is the fix (documented
 * as a Later item, not implemented here).
 */
const GAP = 1000;

export function positionForAppend(lastPosition: number | undefined): number {
  return (lastPosition ?? 0) + GAP;
}

export function positionBetween(
  before: number | undefined,
  after: number | undefined
): number {
  if (before === undefined && after === undefined) return GAP;
  if (before === undefined) return (after as number) - GAP;
  if (after === undefined) return before + GAP;
  return (before + after) / 2;
}
