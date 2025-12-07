import { describe, it, expect } from "vitest";
import { isDone } from "@/is-done";

describe("isDone", () => {
  it("returns true for valid Done object", () => {
    const obj = { done: true, output: 123 };
    expect(isDone(obj)).toBe(true);
  });

  it("returns false for null", () => {
    expect(isDone(null)).toBe(false);
  });

  it("returns false for primitives", () => {
    expect(isDone(123)).toBe(false);
    expect(isDone("abc")).toBe(false);
    expect(isDone(false)).toBe(false);
  });

  it("returns false for object without done", () => {
    expect(isDone({ output: 1 })).toBe(false);
  });
});
