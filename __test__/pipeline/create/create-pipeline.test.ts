/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { createHook, createHookAsync } from "../../../src/hooks/create-hook";
import { createPipeline } from "../../../src/pipeline/create/create-pipeline";

describe("createPipeline (sync)", () => {
  it("runs synchronously", () => {
    const hook = createHook<number, number>("inc", (ctx) => {
      return { early: true, output: ctx + 1 };
    });
    const pipeline = createPipeline<number, number>([hook]);
    const result = pipeline.run(1);
    expect(result).toEqual({
      early: true,
      ctx: 1,
      output: 2,
    });
  });

  it("throws when async hook is provided", () => {
    const asyncHook = createHookAsync("async", async () => {}) as any;
    expect(() => createPipeline([asyncHook])).toThrow();
  });

  it("maintains ordering", () => {
    const a = createHook("A", () => {}, 2);
    const b = createHook("B", () => {}, 1);
    const pipeline = createPipeline([a, b]);
    const names = pipeline.getHooks().map((h) => h.name);
    expect(names).toEqual(["B", "A"]);
  });
});
