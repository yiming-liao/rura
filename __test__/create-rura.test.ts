/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Hook } from "@/types";
import { describe, it, expect } from "vitest";
import { createRura } from "@/create-rura";

describe("createRura", () => {
  it("should initialize with initial hooks", () => {
    const h1: Hook<any, any> = { name: "h1", run: () => {} };
    const h2: Hook<any, any> = { name: "h2", run: () => {} };

    const rura = createRura<any, any>([h1, h2]);

    expect(rura.getHooks()).toEqual([h1, h2]);
  });

  it("use() should add hooks", () => {
    const rura = createRura<any, any>();
    const hook: Hook<any, any> = { name: "a", run: () => {} };

    rura.use(hook);

    expect(rura.getHooks()).toEqual([hook]);
  });

  it("merge() should append hooks from another rura", () => {
    const a = createRura<any, any>();
    const b = createRura<any, any>();

    const h1 = { name: "h1", run: () => {} };
    const h2 = { name: "h2", run: () => {} };

    a.use(h1);
    b.use(h2);

    a.merge(b);

    expect(a.getHooks()).toEqual([h1, h2]);
  });

  it("run() should execute pipeline and return final output", async () => {
    const ctx = { x: 1 };
    const rura = createRura<typeof ctx, number>();

    const hook: Hook<typeof ctx, number> = {
      name: "done",
      run: () => ({ done: true, output: 99 }),
    };

    rura.use(hook);

    const result = await rura.run(ctx);
    expect(result).toBe(99);
  });

  it("API should be chainable", () => {
    const rura = createRura<any, any>();
    const noop = () => {};

    const result = rura
      .use({ name: "a", run: noop })
      .use({ name: "b", run: noop });

    expect(result).toBe(rura);
    expect(rura.getHooks().length).toBe(2);
  });
});
