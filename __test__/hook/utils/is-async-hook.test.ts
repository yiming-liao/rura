/* eslint-disable unicorn/consistent-function-scoping */
import { describe, it, expect } from "vitest";
import { createHook, createHookAsync } from "@/hooks/create-hook";
import { isAsyncHook } from "@/hooks/utils/is-async-hook";

describe("isAsyncHook", () => {
  it("should return false for synchronous hooks", () => {
    const runFn = (ctx: number) => ({ early: true, output: ctx + 1 }) as const;
    const hook = createHook("sync", runFn);

    expect(isAsyncHook(hook)).toBe(false);
  });

  it("should return true for asynchronous hooks", () => {
    const runFn = async (ctx: number) =>
      ({ early: true, output: ctx + 1 }) as const;
    const hook = createHookAsync("async", runFn);

    expect(isAsyncHook(hook)).toBe(true);
  });

  it("should narrow the hook type when returning true", async () => {
    const runFn = async (ctx: string) =>
      ({ early: true, output: ctx.toUpperCase() }) as const;

    const hook = createHookAsync("typed-async", runFn);

    if (isAsyncHook(hook)) {
      // type guard: inside here, hook is RuraHookAsync<string, string>
      const result = await hook.run("hello");
      expect(result).toEqual({ early: true, output: "HELLO" });
    } else {
      throw new Error("Hook should be async but was not detected as such.");
    }
  });
});
