import type { RuraHook } from "@/hooks";
import { describe, it, expect } from "vitest";
import { createHook, createHookAsync } from "@/hooks";
import { run } from "@/pipeline/run/run";

describe("run (synchronous pipeline)", () => {
  it("executes all sync hooks when no early return occurs", () => {
    const calls: string[] = [];

    const hookA = createHook("a", () => {
      calls.push("a");
    });

    const hookB = createHook("b", () => {
      calls.push("b");
    });

    const result = run({}, [hookA, hookB]);

    expect(calls).toEqual(["a", "b"]);
    expect(result).toEqual({ early: false, ctx: {} });
  });

  it("stops early when a hook returns an early-return signal", () => {
    const hookA = createHook("a", () => ({ early: true, output: 42 }) as const);

    const hookB = createHook("b", () => {
      throw new Error("should not execute");
    });

    const result = run({}, [hookA, hookB]);

    expect(result.early).toBe(true);
    expect(result.output).toBe(42);
    expect(result.ctx).toEqual({});
  });

  it("throws when encountering an async hook", () => {
    const syncHook = createHook("sync", () => {});
    const asyncHook = createHookAsync("async", async () => {});

    const hooks: RuraHook[] = [syncHook, asyncHook];

    expect(() => run({}, hooks)).toThrowError(/Async hook "async" detected/);
  });

  it("passes context through unchanged", () => {
    const ctx = { message: "hello" };

    const hook = createHook("test", () => {});

    const result = run(ctx, [hook]);

    expect(result.ctx).toBe(ctx);
  });

  it("returns the correct output type on early return", () => {
    const hook = createHook("value", () => {
      return { early: true, output: { str: "ok", num: 1 } } as const;
    });

    const result = run({}, [hook]);

    expect(result.output).toEqual({ str: "ok", num: 1 });
  });
});
