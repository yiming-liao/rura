/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/consistent-function-scoping */
import type { RuraHook } from "@/hooks";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { formatDebugMessage } from "@/pipeline/create/utils/format-debug-message";

describe("formatDebugMessage", () => {
  let logs: string[] = [];

  beforeEach(() => {
    logs = [];
    vi.spyOn(console, "log").mockImplementation((msg) => {
      logs.push(msg);
    });
  });

  const makeHook = (name: string, order: number, async = false): RuraHook => {
    return {
      name,
      order,
      run: async ? async (ctx: any) => ctx : (ctx: any) => ctx,
    };
  };

  it("prints default header and hook list", () => {
    const hooks = [makeHook("normalize", 1), makeHook("format", 2, true)];

    formatDebugMessage(hooks);

    expect(logs[0]).toContain("🌊 Rura Pipeline");
    expect(logs[2]).toContain("normalize (sync)");
    expect(logs[3]).toContain("format (async)");
  });

  it("prints name when provided", () => {
    const hooks = [makeHook("test", 0)];

    formatDebugMessage(hooks, "myPipeline");

    expect(logs[0]).toContain("🌊 Rura Pipeline <myPipeline>");
  });

  it("uses title callback when provided", () => {
    const hooks: any[] = [];
    const titleFn = vi.fn(() => "✨ Custom Title");

    formatDebugMessage(hooks, undefined, titleFn);

    expect(titleFn).toHaveBeenCalled();
    expect(logs[0]).toBe("\n✨ Custom Title");
  });

  it("prints hooks in correct order", () => {
    const hooks = [
      makeHook("z-last", 5),
      makeHook("a-first", 1),
      makeHook("m-middle", 3),
    ];

    formatDebugMessage(hooks);

    expect(logs.some((l) => l.includes("a-first"))).toBe(true);
    expect(logs.some((l) => l.includes("m-middle"))).toBe(true);
    expect(logs.some((l) => l.includes("z-last"))).toBe(true);
  });

  it("prints separator lines", () => {
    const hooks: any[] = [];

    formatDebugMessage(hooks);

    expect(logs).toContain("───");
  });
});
