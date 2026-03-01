/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/consistent-function-scoping */
import { describe, it, expect } from "vitest";
import { createHook, createHookAsync } from "../../../src/hooks/create-hook";
import { isAsyncHook } from "../../../src/hooks/utils/is-async-hook";

describe("isAsyncHook (contract-driven)", () => {
  it("returns false for synchronous hooks", () => {
    const runFn = (ctx: number) => ({ early: true, output: ctx + 1 }) as const;

    const hook = createHook("sync", runFn);

    expect(isAsyncHook(hook)).toBe(false);
  });

  it("returns true for asynchronous hooks", () => {
    const runFn = async (ctx: number) =>
      ({ early: true, output: ctx + 1 }) as const;

    const hook = createHookAsync("async", runFn);

    expect(isAsyncHook(hook)).toBe(true);
  });

  it("async detection depends on factory, not function syntax", () => {
    const asyncRun = async (ctx: number) =>
      ({ early: true, output: ctx + 1 }) as const;

    // Even though run is async, using createHook makes it sync contract
    const hook = createHook("forced-sync", asyncRun as any);

    expect(isAsyncHook(hook)).toBe(false);
  });

  it("correctly narrows the hook type when async", async () => {
    const runFn = async (ctx: string) =>
      ({ early: true, output: ctx.toUpperCase() }) as const;

    const hook = createHookAsync("typed-async", runFn);

    if (isAsyncHook(hook)) {
      // inside this block, hook must be RuraHookAsync<string, string>
      const result = await hook.run("hello");
      expect(result).toEqual({ early: true, output: "HELLO" });
    } else {
      throw new Error("Expected async hook to be detected as async.");
    }
  });

  it("does not leak internal async marker", () => {
    const hook = createHookAsync("hidden", async () => {});

    // Ensure no enumerable metadata is exposed
    expect(Object.keys(hook)).toEqual(expect.arrayContaining(["name", "run"]));
    expect(Object.keys(hook)).not.toContain("ASYNC_HOOK");
  });
});
