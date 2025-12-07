import { describe, it, expect } from "vitest";
import { createHook, createHookAsync } from "@/hooks";
import { runAsync } from "@/pipeline/run/run-async";

describe("runAsync (asynchronous pipeline)", () => {
  it("executes async hooks sequentially when no early return occurs", async () => {
    const calls: string[] = [];

    const hookA = createHookAsync("a", async () => {
      calls.push("a");
    });

    const hookB = createHookAsync("b", async () => {
      calls.push("b");
    });

    const result = await runAsync({}, [hookA, hookB]);

    expect(calls).toEqual(["a", "b"]);
    expect(result).toEqual({ early: false, ctx: {} });
  });

  it("supports mixed sync + async hooks", async () => {
    const calls: string[] = [];

    const syncHook = createHook("sync", () => {
      calls.push("sync");
    });

    const asyncHook = createHookAsync("async", async () => {
      calls.push("async");
    });

    const result = await runAsync({}, [syncHook, asyncHook]);

    expect(calls).toEqual(["sync", "async"]);
    expect(result.early).toBe(false);
  });

  it("stops early when a hook returns an early-return signal", async () => {
    const hookA = createHookAsync("stop", async () => {
      return { early: true, output: "done" } as const;
    });

    const hookB = createHookAsync("should-not-run", async () => {
      throw new Error("This hook should not execute.");
    });

    const result = await runAsync({}, [hookA, hookB]);

    expect(result.early).toBe(true);
    expect(result.output).toBe("done");
    expect(result.ctx).toEqual({});
  });

  it("passes context through unchanged", async () => {
    const ctx = { msg: "hello" };
    const hook = createHookAsync("noop", async () => {});

    const result = await runAsync(ctx, [hook]);

    expect(result.ctx).toBe(ctx);
  });

  it("returns the correct output type on early return", async () => {
    const hook = createHookAsync("typed", async () => {
      return { early: true, output: { a: 1, b: 2 } } as const;
    });

    const result = await runAsync({}, [hook]);

    expect(result.output).toEqual({ a: 1, b: 2 });
  });
});
