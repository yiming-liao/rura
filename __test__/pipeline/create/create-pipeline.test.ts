import { describe, it, expect, vi } from "vitest";
import { createHook, createHookAsync } from "@/hooks";
import { createPipeline } from "@/pipeline/create/create-pipeline";
import * as runModule from "@/pipeline/run/run";

describe("createRura (sync pipeline builder)", () => {
  it("uses run internally when executing", () => {
    const runSpy = vi.spyOn(runModule, "run");

    const hook = createHook("sync", () => {});
    const pipeline = createPipeline([hook]);

    pipeline.run({});

    expect(runSpy).toHaveBeenCalled();
    runSpy.mockRestore();
  });

  it("rejects asynchronous hooks", () => {
    const pipeline = createPipeline();

    expect(() =>
      pipeline.use(createHookAsync("async", async () => {})),
    ).toThrowError(/not allowed/i);
  });

  it("sorts hooks based on `order` value", () => {
    const h1 = createHook("late", () => {}, 10);
    const h2 = createHook("early", () => {}, 1);

    const pipeline = createPipeline([h1, h2]);

    expect(pipeline.getHooks().map((h) => h.name)).toEqual(["early", "late"]);
  });

  it("supports chainable use() calls", () => {
    const pipeline = createPipeline();

    pipeline.use(createHook("a", () => {})).use(createHook("b", () => {}));

    expect(pipeline.getHooks().map((h) => h.name)).toEqual(["a", "b"]);
  });

  it("merges hooks from another pipeline instance", () => {
    const p1 = createPipeline();
    const p2 = createPipeline();

    p1.use(createHook("a", () => {}));
    p2.use(createHook("b", () => {}));

    p1.merge(p2);

    expect(p1.getHooks().map((h) => h.name)).toEqual(["a", "b"]);
  });

  it("getHooks() returns a sorted shallow copy", () => {
    const h1 = createHook("x", () => {}, 3);
    const h2 = createHook("y", () => {}, 1);

    const pipeline = createPipeline([h1, h2]);
    const result = pipeline.getHooks();

    // 正確排序
    expect(result.map((h) => h.name)).toEqual(["y", "x"]);

    // 不會回傳同一個陣列參照
    expect(result).not.toBe(pipeline.getHooks());
  });

  it("debugHooks() prints without throwing", () => {
    const pipeline = createPipeline([
      createHook("a", () => {}, 2),
      createHook("b", () => {}, 1),
    ]);

    expect(() => pipeline.debugHooks()).not.toThrow();
  });
});
