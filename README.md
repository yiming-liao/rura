<h1 align="center">Rura</h1>

<div align="center">

A minimal **pipeline engine** for every modern workflow.

</div>

<div align="center">

[![NPM version](https://img.shields.io/npm/v/rura?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/rura)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/rura?style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/package/rura)
[![Coverage Status](https://img.shields.io/coveralls/github/yiming-liao/rura.svg?branch=main&style=flat&colorA=000000&colorB=000000)](https://coveralls.io/github/yiming-liao/rura?branch=main)
[![TypeScript](https://img.shields.io/badge/TypeScript-%E2%9C%94-blue?style=flat&colorA=000000&colorB=000000)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/rura?style=flat&colorA=000000&colorB=000000)](LICENSE)

</div>

> Clarity meets stability.

## Features

- 🎯 **Deterministic** – Ordered hooks with effortless early exit.
- 🧱 **Typed** – Inferred context and output with zero boilerplate.
- 🌏 **Universal** – Tiny, framework-agnostic, and ready for any flow.

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

- Hooks can be defined with `createHook` or manually via the `Hook` type.
- Hooks may specify an `order`; omitted values default to `0`.

```ts
// With createHook (recommended for convenience)
const addOne = createHook<Ctx>("add-one", (ctx) => {
  ctx.count += 1;
}); // order: 0

// Manual hook definition (full control)
const stopIfEven: Hook<Ctx, number> = {
  name: "stop-if-even",
  run: (ctx) => {
    if (ctx.count % 2 === 0) {
      return { done: true, output: ctx.count };
    }
  },
  order: 2, // order: 2
};
```

> Rura executes hooks in order and exits early when a hook returns `{ done: true }`.

#### 3. Run the pipeline

```ts
const result = await runRura(ctx, [addOne, stopIfEven]);

console.log(result); // -> 2 (early exit triggered)
```

---

## Pipeline Builder

**createRura()** - Creates a lightweight, composable pipeline instance.

```ts
const rura = createRura<Context, Output>();

// Add hooks
rura
  .use(hookA) // chainable
  .use(hookB)
  .use(hookC);
```

example:

```ts
import { createRura } from "rura";

type Ctx = { value: number };

// Create a pipeline
const pipelineA = createRura<Ctx>();

pipelineA.use({
  name: "add-two",
  run: (ctx) => {
    ctx.value += 2;
  },
});

// Create another pipeline
const pipelineB = createRura<Ctx>();

pipelineB.use({
  name: "multiply-three",
  run: (ctx) => {
    ctx.value *= 3;
  },
});

// Merge pipelines
const pipeline = pipelineA.merge(pipelineB);

// Run it
const result = await pipeline.run({ value: 1 });

console.log(result); // -> { value: 9 }
```

#### Pipeline Instance Methods

| Method           | Description                                          | Parameters | Returns                      |
| ---------------- | ---------------------------------------------------- | ---------- | ---------------------------- |
| **use(hook)**    | Adds a hook to the pipeline.                         | `hook`     | `this` (chainable)           |
| **merge(other)** | Merges hooks from another pipeline instance.         | `other`    | `this` (chainable)           |
| **getHooks()**   | Returns all registered hooks.                        | –          | `Hook[]`                     |
| **run(ctx)**     | Executes the pipeline **_(equivalent to runRura)_**. | `ctx`      | `Promise<Output \| Context>` |
