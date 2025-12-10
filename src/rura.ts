import { createHook, createHookAsync } from "./hooks";
import { createPipeline, createPipelineAsync } from "./pipeline/create";
import { run, runAsync } from "./pipeline/run";
import { isAsyncHook } from "./hooks/utils/is-async-hook";

export const rura = {
  // hook factories
  createHook,
  createHookAsync,

  // executors
  run,
  runAsync,

  // pipeline constructors
  createPipeline,
  createPipelineAsync,

  // utils
  isAsyncHook,
} as const;
