import { describe, it, expect, vi } from "vitest";
import { createHook, createHookAsync } from "@/hooks";
import { createPipelineAsync } from "@/pipeline/create/create-pipeline-async";
import * as runAsyncModule from "@/pipeline/run/run-async";

describe("createRuraAsync (async builder)", () => {
  it("creates a pipeline using runAsync internally", async () => {
    const runSpy = vi.spyOn(runAsyncModule, "runAsync");

    const hook = createHookAsync("async", async () => {});
    const pipeline = createPipelineAsync([hook]);

    await pipeline.run({});

    expect(runSpy).toHaveBeenCalled();
    runSpy.mockRestore();
  });

  it("supports both sync and async hooks", () => {
    const syncHook = createHook("sync", () => {});
    const asyncHook = createHookAsync("async", async () => {});

    const pipeline = createPipelineAsync([]);

    pipeline.use(syncHook).use(asyncHook);

    expect(pipeline.getHooks().length).toBe(2);
    expect(pipeline.getHooks().map((h) => h.name)).toEqual(["sync", "async"]);
  });

  it("sorts hooks by order", () => {
    const h1 = createHookAsync("a", async () => {}, 10);
    const h2 = createHookAsync("b", async () => {}, 2);

    const pipeline = createPipelineAsync([h1, h2]);

    expect(pipeline.getHooks().map((h) => h.name)).toEqual(["b", "a"]);
  });
});

describe("createRuraAsync — shared builder behaviors", () => {
  it("allows chainable API usage", () => {
    const p = createPipelineAsync();

    p.use(createHook("a", () => {})).use(createHookAsync("b", async () => {}));

    expect(p.getHooks().map((h) => h.name)).toEqual(["a", "b"]);
  });

  it("merges hooks from another pipeline", () => {
    const p1 = createPipelineAsync();
    const p2 = createPipelineAsync();

    p1.use(createHook("a", () => {}));
    p2.use(createHookAsync("b", async () => {}));

    p1.merge(p2);

    expect(p1.getHooks().map((h) => h.name)).toEqual(["a", "b"]);
  });
});
