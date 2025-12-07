/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Hook } from "@/types";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRura } from "@/create-rura";
import { runRura } from "@/run-rura";

// Mock runRura
vi.mock("@/run-rura", () => ({
  runRura: vi.fn(async (_ctx, hooks) => hooks),
}));

// Helper
const makeHook = (name: string, order?: number): Hook<any, any> => ({
  name,
  order,
  run: vi.fn(),
});

describe("createRura – Full Test Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // Initialization
  // ---------------------------------------------------------------------------

  it("should assign default order=0 during initialization", () => {
    const h1 = makeHook("h1");
    const h2 = makeHook("h2");

    const rura = createRura([h1, h2]);

    expect(rura.getHooks()).toEqual([
      { ...h1, order: 0 },
      { ...h2, order: 0 },
    ]);
  });

  it("should sort hooks by order during initialization", () => {
    const rura = createRura([
      makeHook("b", 20),
      makeHook("a", 10),
      makeHook("c", 30),
    ]);

    expect(rura.getHooks().map((h) => h.name)).toEqual(["a", "b", "c"]);
  });

  it("should treat undefined order as 0 during initialization", () => {
    const rura = createRura([makeHook("x"), makeHook("y", 5), makeHook("z")]);

    expect(rura.getHooks().map((h) => h.name)).toEqual(["x", "z", "y"]);
  });

  // ---------------------------------------------------------------------------
  // use()
  // ---------------------------------------------------------------------------

  it("use() should add a hook and assign default order=0", () => {
    const rura = createRura([]);
    const h = makeHook("a");

    rura.use(h);

    expect(rura.getHooks()).toEqual([{ ...h, order: 0 }]);
  });

  it("use() should re-sort hooks after insertion", () => {
    const rura = createRura([makeHook("b", 50)]);
    rura.use(makeHook("a", 0));

    expect(rura.getHooks().map((h) => h.name)).toEqual(["a", "b"]);
  });

  it("use() should preserve stable sort when orders are identical", () => {
    const rura = createRura([makeHook("a"), makeHook("b")]);
    rura.use(makeHook("c"));

    expect(rura.getHooks().map((h) => h.name)).toEqual(["a", "b", "c"]);
  });

  // ---------------------------------------------------------------------------
  // merge()
  // ---------------------------------------------------------------------------

  it("merge() should combine hooks and re-sort", () => {
    const a = createRura([makeHook("a", 50)]);
    const b = createRura([makeHook("b", 0)]);

    a.merge(b);

    expect(a.getHooks().map((h) => h.name)).toEqual(["b", "a"]);
  });

  it("merge() should apply default order=0 to incoming hooks without order", () => {
    const a = createRura([makeHook("a", 10)]);
    const b = createRura([makeHook("x")]); // undefined order

    a.merge(b);

    expect(a.getHooks()[0]).toMatchObject({ name: "x", order: 0 });
  });

  // ---------------------------------------------------------------------------
  // getHooks()
  // ---------------------------------------------------------------------------

  it("getHooks() should return a shallow copy", () => {
    const rura = createRura([makeHook("a")]);

    const h1 = rura.getHooks();
    const h2 = rura.getHooks();

    expect(h1).not.toBe(h2);
    expect(h1).toEqual(h2);
  });

  it("getHooks() should always return a sorted list of hooks", () => {
    const rura = createRura([
      makeHook("z", 100),
      makeHook("a", 0),
      makeHook("m", 50),
    ]);

    expect(rura.getHooks().map((h) => h.name)).toEqual(["a", "m", "z"]);
  });

  // ---------------------------------------------------------------------------
  // debugHooks()
  // ---------------------------------------------------------------------------

  it("debugHooks() should print correctly formatted output", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const rura = createRura([makeHook("a"), makeHook("b", 200)]);
    rura.debugHooks();

    expect(logSpy).toHaveBeenCalled();
    expect(logSpy.mock.calls[0][0]).toContain("Rura Pipeline");
    expect(logSpy.mock.calls[2][0]).toContain("order:");
    expect(logSpy.mock.calls[2][0]).toContain("name:");
  });

  // ---------------------------------------------------------------------------
  // run()
  // ---------------------------------------------------------------------------

  it("run() should call runRura with sorted hooks", async () => {
    const h1 = makeHook("a", 50);
    const h2 = makeHook("b", 10);

    const rura = createRura([h1, h2]);
    const ctx = { foo: 1 };

    await rura.run(ctx);

    expect(runRura).toHaveBeenCalledWith(ctx, rura.getHooks());
    expect(rura.getHooks().map((h) => h.name)).toEqual(["b", "a"]);
  });

  // ---------------------------------------------------------------------------
  // API Shape
  // ---------------------------------------------------------------------------

  it("API should support chaining", () => {
    const rura = createRura();

    expect(() =>
      rura.use(makeHook("a")).merge(createRura()).debugHooks(),
    ).not.toThrow();
  });

  // ---------------------------------------------------------------------------
  // sortHooks fallback coverage
  // ---------------------------------------------------------------------------

  it("should trigger the fallback branch of (order ?? 0) if order is undefined", () => {
    // Getter ensures applyDefaultOrder cannot override undefined
    const getterHook: Hook<any, any> = {
      name: "getter",
      // @ts-expect-error any
      get order() {
        return; // sorter will see undefined → fallback triggers
      },
      run: () => {},
    };

    const rura = createRura([getterHook]);
    const sorted = rura.getHooks();

    expect(sorted[0].order).toBe(0);
    expect(sorted[0].name).toBe("getter");
  });
});
