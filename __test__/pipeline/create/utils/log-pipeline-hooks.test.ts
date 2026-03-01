/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createHook, createHookAsync } from "../../../../src/hooks/create-hook";
import { logPipelineHooks } from "../../../../src/pipeline/create/utils/log-pipeline-hooks";

describe("logPipelineHooks", () => {
  let spy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    spy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    spy.mockRestore();
  });

  it("prints header with singular form", () => {
    const hook = createHook("test", () => {}, 200);
    logPipelineHooks([hook], "my-pipeline");
    expect(spy).toHaveBeenCalledWith("my-pipeline (1 hook)");
  });

  it("prints header with plural form", () => {
    const a = createHook("A", () => {});
    const b = createHook("B", () => {});
    logPipelineHooks([a, b], "my-pipeline");
    expect(spy).toHaveBeenCalledWith("my-pipeline (2 hooks)");
  });

  it("prints hook entries with sync label", () => {
    const hook = createHook("sync-test", () => {}, 10);
    logPipelineHooks([hook]);
    const calls = spy.mock.calls.map((c: any) => c[0]);
    expect(calls.some((line: any) => line.includes("sync-test (sync)"))).toBe(
      true,
    );
  });

  it("prints hook entries with async label", () => {
    const hook = createHookAsync("async-test", async () => {}, 5);
    logPipelineHooks([hook]);
    const calls = spy.mock.calls.map((c: any) => c[0]);
    expect(calls.some((line: any) => line.includes("async-test (async)"))).toBe(
      true,
    );
  });

  it("uses '-' when order is undefined", () => {
    const hook = createHook("no-order", () => {});
    logPipelineHooks([hook]);
    const calls = spy.mock.calls.map((c: any) => c[0]);
    expect(calls.some((line: any) => line.includes("order: -"))).toBe(true);
  });

  it("prints separators", () => {
    const hook = createHook("test", () => {});
    logPipelineHooks([hook]);
    const separatorCount = spy.mock.calls
      .map((c: any) => c[0])
      .filter((line: any) => line === "───").length;
    expect(separatorCount).toBe(2);
  });
});
