/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createHook, createHookAsync } from "../../../src/hooks/create-hook";
import { createPipelineBase } from "../../../src/pipeline/create/create-pipeline-base";
import { formatDebugMessage } from "../../../src/pipeline/create/utils/format-debug-message";

vi.mock("../../../src/pipeline/create/utils/format-debug-message", () => ({
  formatDebugMessage: vi.fn(),
}));

describe("createPipelineBase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws when async hook is provided to sync pipeline (initial)", () => {
    const asyncHook = createHookAsync("async", async () => {});
    expect(() =>
      createPipelineBase([asyncHook], () => ({ early: false, ctx: null }), {
        mode: "sync",
      }),
    ).toThrow();
  });

  it("allows async hook in async pipeline", () => {
    const asyncHook = createHookAsync("async", async () => {});
    expect(() =>
      createPipelineBase(
        [asyncHook],
        async () => ({ early: false, ctx: null }),
        { mode: "async" },
      ),
    ).not.toThrow();
  });

  it("throws when async hook is registered via use() in sync mode", () => {
    const pipeline = createPipelineBase(
      [] as any,
      () => ({ early: false, ctx: null }),
      { mode: "sync" },
    );
    const asyncHook = createHookAsync("async", async () => {});
    expect(() => pipeline.use(asyncHook)).toThrow();
  });

  it("sorts initial hooks by order", () => {
    const a = createHook("A", () => {}, 2);
    const b = createHook("B", () => {}, 1);
    const pipeline = createPipelineBase(
      [a, b],
      () => ({ early: false, ctx: null }),
      { mode: "sync" },
    );
    expect(pipeline.getHooks().map((h) => h.name)).toEqual(["B", "A"]);
  });

  it("keeps insertion order when no order is defined", () => {
    const a = createHook("A", () => {});
    const b = createHook("B", () => {});
    const pipeline = createPipelineBase(
      [a, b],
      () => ({ early: false, ctx: null }),
      { mode: "sync" },
    );
    expect(pipeline.getHooks().map((h) => h.name)).toEqual(["A", "B"]);
  });

  it("keeps insertion order when order values are equal", () => {
    const a = createHook("A", () => {}, 1);
    const b = createHook("B", () => {}, 1);
    const pipeline = createPipelineBase(
      [a, b],
      () => ({ early: false, ctx: null }),
      { mode: "sync" },
    );
    expect(pipeline.getHooks().map((h) => h.name)).toEqual(["A", "B"]);
  });

  it("places ordered hooks before unordered ones", () => {
    const a = createHook("A", () => {});
    const b = createHook("B", () => {}, 1);
    const pipeline = createPipelineBase(
      [a, b],
      () => ({ early: false, ctx: null }),
      { mode: "sync" },
    );
    expect(pipeline.getHooks().map((h) => h.name)).toEqual(["B", "A"]);
  });

  it("use() registers hook and maintains ordering", () => {
    const a = createHook("A", () => {});
    const b = createHook("B", () => {}, 1);
    const pipeline = createPipelineBase(
      [a],
      () => ({ early: false, ctx: null }),
      { mode: "sync" },
    );
    pipeline.use(b);
    expect(pipeline.getHooks().map((h) => h.name)).toEqual(["B", "A"]);
  });

  it("use() returns same pipeline instance (chainable)", () => {
    const pipeline = createPipelineBase(
      [] as any,
      () => ({ early: false, ctx: null }),
      { mode: "sync" },
    );
    const result = pipeline.use(createHook("A", () => {}));
    expect(result).toBe(pipeline);
  });

  it("debugHooks delegates to formatDebugMessage", () => {
    const a = createHook("A", () => {}, 2);
    const b = createHook("B", () => {}, 1);
    const pipeline = createPipelineBase(
      [a, b],
      () => ({ early: false, ctx: null }),
      { mode: "sync", name: "debug-test" },
    );
    pipeline.debugHooks();
    expect(formatDebugMessage).toHaveBeenCalledTimes(1);
    const [hooksArg, nameArg, titleArg] = (formatDebugMessage as any).mock
      .calls[0];
    expect(hooksArg.map((h: any) => h.name)).toEqual(["B", "A"]);
    expect(nameArg).toBe("debug-test");
    expect(titleArg).toBeUndefined();
  });

  it("run() provides a shallow copy of hooks", () => {
    const hook = createHook("A", () => {});
    let receivedHooks: any[] = [];
    const pipeline = createPipelineBase(
      [hook],
      (_ctx, hooks) => {
        receivedHooks = hooks;
        hooks.push(createHook("MUTATED", () => {}));
        return { early: false, ctx: null };
      },
      { mode: "sync" },
    );
    pipeline.run(null);
    expect(pipeline.getHooks().map((h) => h.name)).toEqual(["A"]);
    expect(receivedHooks.length).toBe(2);
  });

  it("does not assert in async mode when using async hook", () => {
    const asyncHook = createHookAsync("async", async () => {});
    const pipeline = createPipelineBase(
      [] as any,
      async () => ({ early: false, ctx: null }),
      { mode: "async" },
    );
    expect(() => pipeline.use(asyncHook)).not.toThrow();
  });
});
