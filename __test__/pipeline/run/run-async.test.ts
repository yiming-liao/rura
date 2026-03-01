import { describe, it, expect, vi } from "vitest";
import { createHook, createHookAsync } from "../../../src/hooks/create-hook";
import { runAsync } from "../../../src/pipeline";

describe("runAsync (asynchronous)", () => {
  it("returns normal result when no hook triggers early", async () => {
    const hook = createHook("A", () => {});
    const ctx = { value: 1 };
    const result = await runAsync(ctx, [hook]);
    expect(result).toEqual({
      early: false,
      ctx,
    });
  });

  it("stops execution on early return (async hook)", async () => {
    const spy = vi.fn();
    const earlyHook = createHookAsync("early", async () => ({
      early: true,
      output: 99,
    }));
    const afterHook = createHook("after", spy);
    const ctx = {};
    const result = await runAsync(ctx, [earlyHook, afterHook]);
    expect(result).toEqual({
      early: true,
      ctx,
      output: 99,
    });
    expect(spy).not.toHaveBeenCalled();
  });

  it("handles mixed sync and async hooks", async () => {
    const ctx = { count: 0 };
    const syncHook = createHook("sync", (c: any) => {
      c.count++;
    });
    const asyncHook = createHookAsync("async", async (c: any) => {
      c.count++;
    });
    await runAsync(ctx, [syncHook, asyncHook]);
    expect(ctx.count).toBe(2);
  });

  it("propagates async errors", async () => {
    const hook = createHookAsync("error", async () => {
      throw new Error("async boom");
    });
    await expect(runAsync({}, [hook])).rejects.toThrow("async boom");
  });
});
