import { describe, it, expect } from "vitest";
import { positionForAppend, positionBetween } from "./ordering";

describe("positionForAppend", () => {
  it("gives the first item a positive position", () => {
    expect(positionForAppend(undefined)).toBeGreaterThan(0);
  });

  it("always sorts after the last item", () => {
    const first = positionForAppend(undefined);
    const second = positionForAppend(first);
    const third = positionForAppend(second);
    expect(second).toBeGreaterThan(first);
    expect(third).toBeGreaterThan(second);
  });
});

describe("positionBetween", () => {
  it("returns a positive gap value for an empty list", () => {
    expect(positionBetween(undefined, undefined)).toBeGreaterThan(0);
  });

  it("sorts before the only item when dropped at the start", () => {
    const only = positionForAppend(undefined);
    const beforeIt = positionBetween(undefined, only);
    expect(beforeIt).toBeLessThan(only);
  });

  it("sorts after the last item when dropped at the end", () => {
    const last = positionForAppend(undefined);
    const afterIt = positionBetween(last, undefined);
    expect(afterIt).toBeGreaterThan(last);
  });

  it("sorts strictly between two neighbors", () => {
    const a = 1000;
    const b = 2000;
    const between = positionBetween(a, b);
    expect(between).toBeGreaterThan(a);
    expect(between).toBeLessThan(b);
  });

  it("repeated inserts between the same neighbors stay ordered and distinct", () => {
    let before = 1000;
    const after = 2000;
    const seen = new Set<number>();
    for (let i = 0; i < 8; i++) {
      const mid = positionBetween(before, after);
      expect(mid).toBeGreaterThan(before);
      expect(mid).toBeLessThan(after);
      expect(seen.has(mid)).toBe(false);
      seen.add(mid);
      before = mid;
    }
  });
});
