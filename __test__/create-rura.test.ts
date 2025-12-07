import { describe, it, expect, vi } from "vitest";
import { createHook } from "@/create-hook";

describe("createHook", () => {
  it("creates a hook with name and run", () => {
    const run = vi.fn();
    const hook = createHook("test", run);

    expect(hook.name).toBe("test");
    expect(hook.run).toBe(run);
    expect(hook.order).toBeUndefined();
  });

  it("creates a hook with order", () => {
    const run = vi.fn();
    const hook = createHook("ordered", run, 5);

    expect(hook.order).toBe(5);
  });
});
