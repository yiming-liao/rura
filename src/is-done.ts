import type { Done } from "@/types";

export function isDone<Output>(r: unknown): r is Done<Output> {
  return typeof r === "object" && r !== null && "done" in r;
}
