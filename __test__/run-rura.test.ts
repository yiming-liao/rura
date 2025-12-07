import type { Hook } from "@/types";
import { describe, it, expect } from "vitest";
import { runRura } from "@/run-rura";

describe("runRura", () => {
  it("should return ctx when no hook returns done", async () => {
    const ctx = { value: 1 };
    const hooks: Hook<typeof ctx, number>[] = [
      { name: "a", run: () => {} },
      { name: "b", run: () => {} },
    ];

    const result = await runRura(ctx, hooks);
    expect(result).toBe(ctx);
  });

  it("should short-circuit when a hook returns done", async () => {
    const ctx = { x: 10 };
    const hooks: Hook<typeof ctx, number>[] = [
      { name: "a", run: () => {} },
      { name: "b", run: () => ({ done: true, output: 42 }) },
      {
        name: "c",
        run: () => {
          throw new Error("Should not run");
        },
      },
    ];

    const result = await runRura(ctx, hooks);
    expect(result).toBe(42);
  });

  it("should execute hooks in order", async () => {
    const calls: string[] = [];
    const ctx = {};

    const hooks: Hook<typeof ctx, string>[] = [
      { name: "last", order: 10, run: () => void calls.push("last") },
      { name: "first", order: -1, run: () => void calls.push("first") },
      { name: "mid", order: 0, run: () => void calls.push("mid") },
    ];

    await runRura(ctx, hooks);
    expect(calls).toEqual(["first", "mid", "last"]);
  });

  it("should support async hooks", async () => {
    const ctx = {};
    const hooks: Hook<typeof ctx, string>[] = [
      {
        name: "asyncHook",
        run: async () => {
          await new Promise((r) => setTimeout(r, 10));
          return { done: true, output: "ok" };
        },
      },
    ];

    const result = await runRura(ctx, hooks);
    expect(result).toBe("ok");
  });
});
