/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unicorn/consistent-function-scoping */
import type { RuraHookSync, RuraHookAsync } from "@/hooks/types";
import { describe, it, expect } from "vitest";
import { createHook, createHookAsync } from "@/hooks/create-hook";

describe("createHook (sync)", () => {
  it("should create a sync hook with given name and run function", () => {
    const runFn = (_ctx: unknown) => {};
    const hook = createHook("test-sync", runFn);

    expect(hook.name).toBe("test-sync");
    expect(hook.run).toBe(runFn);
    expect(hook.order).toBeUndefined();
  });

  it("should assign the provided order", () => {
    const runFn = (_ctx: unknown) => {};
    const hook = createHook("ordered-sync", runFn, 5);

    expect(hook.order).toBe(5);
  });

  it("should match RuraHookSync type shape", () => {
    const runFn = (ctx: number) => ({ early: true, output: ctx * 2 }) as const;
    const hook: RuraHookSync<number, number> = createHook("typed-sync", runFn);

    // runtime check
    expect(hook.run(2)).toEqual({ early: true, output: 4 });
  });
});

describe("createHookAsync (async)", () => {
  it("should create an async hook with given name and run function", () => {
    const runFn = async (_ctx: unknown) => {};
    const hook = createHookAsync("test-async", runFn);

    expect(hook.name).toBe("test-async");
    expect(hook.run).toBe(runFn);
    expect(hook.order).toBeUndefined();
  });

  it("should assign the provided order", () => {
    const runFn = async (_ctx: unknown) => {};
    const hook = createHookAsync("ordered-async", runFn, 3);

    expect(hook.order).toBe(3);
  });

  it("should match RuraHookAsync type shape", async () => {
    const runFn = async (ctx: number) =>
      ({ early: true, output: ctx + 1 }) as const;
    const hook: RuraHookAsync<number, number> = createHookAsync(
      "typed-async",
      runFn,
    );

    const result = await hook.run(10);
    expect(result).toEqual({ early: true, output: 11 });
  });
});
