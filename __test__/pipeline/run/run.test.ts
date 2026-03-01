import { describe, it, expect, vi } from "vitest";
import { createHook } from "../../../src/hooks/create-hook";
import { run } from "../../../src/pipeline";

describe("run (synchronous)", () => {
  it("returns normal result when no hook triggers early", () => {
    const hook = createHook("A", () => {});
    const ctx = { value: 1 };
    const result = run(ctx, [hook]);
    expect(result).toEqual({
      early: false,
      ctx,
    });
  });

  it("stops execution on early return", () => {
    const spy = vi.fn();
    const earlyHook = createHook("early", () => ({
      early: true,
      output: 42,
    }));
    const afterHook = createHook("after", spy);
    const ctx = {};
    const result = run(ctx, [earlyHook, afterHook]);
    expect(result).toEqual({
      early: true,
      ctx,
      output: 42,
    });
    expect(spy).not.toHaveBeenCalled();
  });

  it("passes the same ctx reference to all hooks", () => {
    const ctx = { count: 0 };
    const hook1 = createHook("A", (c: any) => {
      c.count++;
    });
    const hook2 = createHook("B", (c: any) => {
      c.count++;
    });
    run(ctx, [hook1, hook2]);
    expect(ctx.count).toBe(2);
  });

  it("propagates thrown errors", () => {
    const hook = createHook("error", () => {
      throw new Error("boom");
    });
    expect(() => run({}, [hook])).toThrow("boom");
  });
});
