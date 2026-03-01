import { describe, it, expect } from "vitest";
import { createHook, createHookAsync } from "../../../src/hooks/create-hook";
import { createPipelineAsync } from "../../../src/pipeline/create/create-pipeline-async";

describe("createPipelineAsync (async)", () => {
  it("returns a Promise from run()", async () => {
    const hook = createHook<number, number>("inc", (ctx) => {
      return { early: true, output: ctx + 1 };
    });

    const pipeline = createPipelineAsync<number, number>([hook]);
    const result = pipeline.run(1);
    expect(result).toBeInstanceOf(Promise);
    await expect(result).resolves.toEqual({
      early: true,
      ctx: 1,
      output: 2,
    });
  });

  it("allows async hooks", async () => {
    const asyncHook = createHookAsync<number, number>(
      "async-inc",
      async (ctx) => {
        return { early: true, output: ctx + 1 };
      },
    );
    const pipeline = createPipelineAsync<number, number>([asyncHook]);
    const result = await pipeline.run(1);
    expect(result.output).toBe(2);
  });

  it("maintains ordering", () => {
    const a = createHook("A", () => {}, 2);
    const b = createHook("B", () => {}, 1);
    const pipeline = createPipelineAsync([a, b]);
    const names = pipeline.getHooks().map((h) => h.name);
    expect(names).toEqual(["B", "A"]);
  });
});
