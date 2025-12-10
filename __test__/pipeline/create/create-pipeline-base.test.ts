/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/consistent-function-scoping */
import type { RuraHook } from "@/hooks/types";
import type { RuraResult } from "@/pipeline/types";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createHook, createHookAsync } from "@/hooks";
import { createPipelineBase } from "@/pipeline/create/create-pipeline-base";

describe("createRuraBase", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  function mockRunFn<Ctx, Out>(): [
    ReturnType<typeof vi.fn>,
    (ctx: Ctx, hooks: RuraHook<Ctx, Out>[]) => RuraResult<Ctx, Out>,
  ] {
    const impl = (ctx: Ctx) => ({ early: false, ctx });
    const spy = vi.fn(impl);
    return [spy, impl];
  }

  it("initializes with sorted hooks", () => {
    const h1 = createHook("a", () => {}, 5);
    const h2 = createHook("b", () => {}, 1);

    const [runSpy] = mockRunFn() as any;
    const pipeline = createPipelineBase([h1, h2], runSpy, { mode: "sync" });

    expect(pipeline.getHooks().map((h) => h.name)).toEqual(["b", "a"]);
  });

  it("registers new hooks using use()", () => {
    const h1 = createHook("a", () => {});
    const h2 = createHook("b", () => {});

    const [runSpy] = mockRunFn() as any;
    const pipeline = createPipelineBase<RuraHook, any, any, any>([], runSpy, {
      mode: "sync",
    });

    pipeline.use(h1).use(h2);

    expect(pipeline.getHooks().map((h) => h.name)).toEqual(["a", "b"]);
  });

  it("throws when async hook is added in sync mode", () => {
    const syncHook = createHook("sync", () => {});
    const asyncHook = createHookAsync("async", async () => {});

    const [runSpy] = mockRunFn() as any;
    const pipeline = createPipelineBase<RuraHook, any, any, any>(
      [syncHook],
      runSpy,
      {
        mode: "sync",
      },
    );

    expect(() => pipeline.use(asyncHook)).toThrowError(/not allowed/i);
  });

  it("allows async hooks in async mode", () => {
    const syncHook = createHook("sync", () => {});
    const asyncHook = createHookAsync("async", async () => {});

    const [runSpy] = mockRunFn() as any;
    const pipeline = createPipelineBase<RuraHook, any, any, any>([], runSpy, {
      mode: "async",
    });

    pipeline.use(syncHook).use(asyncHook);

    expect(pipeline.getHooks().length).toBe(2);
  });

  it("merges hooks from another pipeline", () => {
    const a = createHook("a", () => {});
    const b = createHook("b", () => {});

    const [runSpy] = mockRunFn() as any;
    const p1 = createPipelineBase<RuraHook, any, any, any>([a], runSpy, {
      mode: "sync",
    });
    const p2 = createPipelineBase<RuraHook, any, any, any>([b], runSpy, {
      mode: "sync",
    });

    p1.merge(p2);

    expect(p1.getHooks().map((h) => h.name)).toEqual(["a", "b"]);
  });

  it("executes run() using the provided runFn", () => {
    const hook = createHook("x", () => {});
    const [runSpy] = mockRunFn() as any;

    const pipeline = createPipelineBase([hook], runSpy, { mode: "sync" });

    const ctx = { value: 123 };
    const result = pipeline.run(ctx) as any;

    expect(runSpy).toHaveBeenCalled();
    expect(result.ctx).toEqual(ctx);
  });

  it("debugHooks() prints hook list including sync/async type", () => {
    const syncHook = createHook("syncHook", () => {}, 0);
    const asyncHook = createHookAsync("asyncHook", async () => {}, 1);

    const [runSpy] = mockRunFn() as any;
    const pipeline = createPipelineBase([syncHook, asyncHook], runSpy, {
      mode: "async",
    });

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    pipeline.debugHooks();

    const calls = logSpy.mock.calls.flat().join("\n");

    expect(calls).toMatch(/syncHook \(sync\)/);
    expect(calls).toMatch(/asyncHook \(async\)/);

    logSpy.mockRestore();
  });
});
