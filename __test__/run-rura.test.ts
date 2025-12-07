/* eslint-disable unicorn/consistent-function-scoping */
import type { RuraHook } from "@/types";
import { describe, it, expect, vi } from "vitest";
import { runRura } from "@/run-rura";

describe("runRura", () => {
  const makeHook = <Ctx, Out = unknown>(
    name: string,
    impl: RuraHook<Ctx, Out>["run"],
  ): RuraHook<Ctx, Out> => ({
    name,
    run: impl,
  });

  // ---------------------------------------------------------------------------
  // 1. Normal pipeline execution
  // ---------------------------------------------------------------------------

  it("runs all hooks when none returns early", async () => {
    const ctx = { count: 0 };

    const h1 = makeHook<typeof ctx>("h1", (c) => {
      c.count += 1;
    });

    const h2 = makeHook<typeof ctx>("h2", (c) => {
      c.count += 1;
    });

    const result = await runRura(ctx, [h1, h2]);

    expect(result).toEqual({
      early: false,
      ctx: { count: 2 },
    });
  });

  // ---------------------------------------------------------------------------
  // 2. Early return
  // ---------------------------------------------------------------------------

  it("stops early when a hook returns { early: true }", async () => {
    const ctx = { value: 1 };

    const h1 = makeHook("h1", () => ({ early: true, output: "stop" }));
    const h2 = makeHook("h2", () => {
      throw new Error("Should not run");
    });

    const result = await runRura(ctx, [h1, h2]);

    expect(result).toEqual({
      early: true,
      ctx,
      output: "stop",
    });
  });

  // ---------------------------------------------------------------------------
  // 3. Async hook support
  // ---------------------------------------------------------------------------

  it("supports async hooks", async () => {
    const ctx = { n: 1 };

    const h1 = makeHook("h1", async () => {
      await new Promise((r) => setTimeout(r, 5));
    });

    const h2 = makeHook("h2", async () => ({
      early: true,
      output: 999,
    }));

    const result = await runRura(ctx, [h1, h2]);

    expect(result).toEqual({
      early: true,
      ctx,
      output: 999,
    });
  });

  // ---------------------------------------------------------------------------
  // 4. Verify hooks do not run after early return
  // ---------------------------------------------------------------------------

  it("does not run hooks after early return", async () => {
    const ctx = {};

    const h1 = makeHook("h1", () => ({ early: true, output: "done" }));
    const h2 = makeHook("h2", vi.fn());

    const result = await runRura(ctx, [h1, h2]);

    expect(result.output).toBe("done");
    expect(h2.run).not.toHaveBeenCalled();
  });

  // ---------------------------------------------------------------------------
  // 5. Hook returns void should continue pipeline
  // ---------------------------------------------------------------------------

  it("continues pipeline when hook returns void", async () => {
    const ctx = { x: 0 };

    const h1 = makeHook("h1", () => {});
    const h2 = makeHook("h2", () => {
      ctx.x = 123;
    });

    const result = await runRura(ctx, [h1, h2]);

    expect(result).toEqual({
      early: false,
      ctx: { x: 123 },
    });
  });

  // ---------------------------------------------------------------------------
  // 6. undefined return should not break pipeline
  // ---------------------------------------------------------------------------

  it("treats undefined return as normal continuation", async () => {
    const ctx = { v: 10 };

    const h1 = makeHook("h1", () => {});
    const h2 = makeHook("h2", () => ({
      early: true,
      output: "ok",
    }));

    const result = await runRura(ctx, [h1, h2]);

    expect(result).toEqual({
      early: true,
      ctx,
      output: "ok",
    });
  });
});
