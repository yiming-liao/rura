<h1 align="center">Rura</h1>

<div align="center">

A minimal **pipeline engine** for every modern workflow,  
built for clarity and stability.

</div>

<div align="center">

[![NPM version](https://img.shields.io/npm/v/rura?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/rura)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/rura?style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/package/rura)
[![Coverage Status](https://img.shields.io/coveralls/github/yiming-liao/rura.svg?branch=main&style=flat&colorA=000000&colorB=000000)](https://coveralls.io/github/yiming-liao/rura?branch=main)
[![TypeScript](https://img.shields.io/badge/TypeScript-%E2%9C%94-blue?style=flat&colorA=000000&colorB=000000)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/rura?style=flat&colorA=000000&colorB=000000)](LICENSE)

</div>

## Features

- **Deterministic** – Ordered hooks with effortless early exit.
- **Typed** – Inferred context and output with zero boilerplate.
- **Universal** – Tiny, framework-agnostic, and ready for any flow.

## Installation

```bash
# npm
npm install rura
# yarn
yarn add rura
# pnpm
pnpm add rura
```

## Quick Start

#### 1. Define the initial context

```ts
const ctx = { count: 1 };
type Ctx = typeof ctx;
```

#### 2. Create your hooks

- Hooks can be created with `rura.createHook`, or defined manually using the `RuraHook` type.
- Hooks may specify an `order`; omitted values default to `0`.

```ts
import { rura, type RuraHook } from "rura";

// With createHook (recommended for convenience)
const addOne = rura.createHook<Ctx>("add-one", (ctx) => {
  ctx.count += 1;
}); // order: 0

// Manual hook definition (full control)
const stopIfEven: RuraHook<Ctx, number> = {
  name: "stop-if-even",
  run: (ctx) => {
    if (ctx.count % 2 === 0) {
      return { early: true, output: ctx.count };
    }
  },
  order: 2, // order: 2
};
```

- Rura executes hooks in order and exits early when a hook returns `{ early: true, output }`.

- When the pipeline does not exit early, `output` is omitted and `early` becomes `false`.

#### 3. Run the pipeline

```ts
const result = rura.run(ctx, [addOne, stopIfEven]);

console.log(result);
// -> {
//      early: true,
//      ctx: { count: 2 },
//      output: 2
//    }
```

> Note: If your hooks are asynchronous,  
> use `rura.createHookAsync()` and run them through `rura.runAsync()` accordingly.

---

## Pipeline Builder

> If you prefer working with a reusable pipeline instance

**rura.createPipeline()** - Creates a lightweight, composable pipeline instance  
that can register hooks, merge with other pipelines, and be inspected.

```ts
import { rura } from "rura";

const pipeline = rura.createPipeline<Context, Output>();

// Add hooks
pipeline
  .use(hookA) // chainable
  .use(hookB)
  .use(hookC);
```

example:

```ts
type Ctx = { value: number };

// Create a reusable pipeline instance
const pipelineA = rura.createPipeline<Ctx>();

// Register a hook using `use()`
pipelineA.use({
  name: "add-two",
  run: (ctx) => {
    ctx.value += 2;
  },
});

// Create another pipeline (preloaded with hooks)
const pipelineB = rura.createPipeline<Ctx>([
  {
    name: "multiply-three",
    run: (ctx) => {
      ctx.value *= 3;
    },
  },
]);

// Merge pipelines into a single combined pipeline
const pipeline = pipelineA.merge(pipelineB);

// Execute the pipeline
const result = await pipeline.run({ value: 1 });

console.log(result);
// -> {
//      early: false,
//      ctx: { value: 9 }
//    }
```

> Note: If your pipeline includes async hooks,  
> be sure to use `rura.createPipelineAsync()`, which awaits each hook in order.

#### Pipeline Instance Methods

`rura.createPipeline()` — Synchronous Pipeline

| Method           | Description                                                       | Parameters | Returns            |
| ---------------- | ----------------------------------------------------------------- | ---------- | ------------------ |
| **use(hook)**    | Adds a hook, normalizes its order, and re-sorts hooks.            | `hook`     | `this` (chainable) |
| **merge(other)** | Merges hooks from another pipeline and re-sorts them.             | `other`    | `this` (chainable) |
| **getHooks()**   | Returns a sorted shallow copy of all registered hooks.            | –          | `RuraHook[]`       |
| **debugHooks()** | Prints a formatted, human-readable hook list.                     | –          | `void`             |
| **run(ctx)**     | Executes the pipeline synchronously. (delegates to `rura.run()`). | `ctx`      | `RuraResult`       |

<br/>

`rura.createPipelineAsync()` — Asynchronous Pipeline

| Method           | Description                                                             | Parameters | Returns               |
| ---------------- | ----------------------------------------------------------------------- | ---------- | --------------------- |
| **use(hook)**    | Adds a hook, normalizes its order, and re-sorts hooks.                  | `hook`     | `this` (chainable)    |
| **merge(other)** | Merges hooks from another pipeline and re-sorts them.                   | `other`    | `this` (chainable)    |
| **getHooks()**   | Returns a sorted shallow copy of all registered hooks.                  | –          | `RuraHook[]`          |
| **debugHooks()** | Prints a formatted, human-readable hook list.                           | –          | `void`                |
| **run(ctx)**     | Executes the pipeline asynchronously. (delegates to `rura.runAsync()`). | `ctx`      | `Promise<RuraResult>` |
