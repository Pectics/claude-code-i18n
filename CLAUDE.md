# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chinese localization (`i18n`) of Claude Code (version 2.1.88), reconstructed from source maps with missing module shims restored. The project is a TypeScript/React CLI application using Bun as the runtime.

## Build & Development Commands

```bash
bun install       # Install dependencies and local shim packages
bun run dev       # Start the restored CLI entrypoint interactively
bun run start     # Alias for development entrypoint
bun run version   # Verify CLI boots and prints version
```

No `lint` or `test` scripts are configured. TypeScript is validated at runtime via Bun.

## Architecture

### Entry Flow
- `src/bootstrap-entry.ts` → `src/bootstrapMacro.ts` → `src/entrypoints/cli.tsx`
- The bootstrap macro (`ensureBootstrapMacro`) runs before any other imports

### Core Modules
- **`src/bridge/`** — Remote bridge communication layer (API client, messaging, session management, OAuth, permissions)
- **`src/commands/`** — CLI command implementations (one folder per command, e.g., `src/commands/config/`, `src/commands/mcp/`)
- **`src/services/`** — Background services (analytics, context collapse, oauth, policy limits, settings sync, team memory)
- **`src/components/`** — React components (CustomSelect, Spinner, MCP browser UI, wizard)
- **`src/buddy/`** — Companion sprite/avatar system
- **`src/assistant/`** — Session discovery and history
- **`src/i18n/`** — Internationalization module with `t()` function and locale files

### Native Modules
- **`src/native-ts/`** — Native TypeScript wrappers (color-diff, file-index, yoga-layout)

### Shim Packages
- **`shims/`** — Local package shims for native modules (`color-diff-napi`, `modifiers-napi`, `url-handler-napi`, etc.)

### Skills System
- **`src/skills/`** — Bundled skill definitions including `claude-api` (API reference docs for multiple languages) and `verify`

## Code Style

- TypeScript-first with ESM imports and `react-jsx`
- No semicolons, single quotes preferred
- camelCase for variables/functions, PascalCase for React components and manager classes
- kebab-case for command folders (e.g., `src/commands/install-slack-app/`)
- Strict mode is off (`strict: false` in tsconfig)

## Restoration Context

This is a reconstructed source tree, not pristine upstream. Some modules use fallback/shim behavior. Prefer minimal, auditable changes and document any workaround added due to restoration.

---

# 🔄 i18n Localization Workflow

## Quick Start

**Use `/loop 5m /i18n` to start the self-healing workflow loop.**

When triggered (manually or by ping), execute the **Workflow Cycle** below.

## Workflow Cycle

```
┌─────────────────────────────────────────────────────────┐
│  /i18n  or  ping received                               │
│                                                         │
│  1. READ PROGRESS  ──→  scripts/i18n-progress.json      │
│     ↓                                                   │
│  2. DETERMINE NEXT ──→  Find next unfinished module     │
│     ↓                                                   │
│  3. PROCESS MODULE ──→  Scan → Identify → Register      │
│     ↓                                                   │
│  4. SAVE PROGRESS  ──→  Update progress + en-US.json    │
│     ↓                                                   │
│  5. LOOP or HALT   ──→  Continue next module or stop    │
│                         if context is getting large     │
└─────────────────────────────────────────────────────────┘
```

## Module Processing Order (Alphabetical)

The following is the **canonical processing order** — every module in `src/` sorted alphabetically. Root-level `.ts`/`.tsx` files are grouped as module `root`.

```
 1. root              (*.ts/*.tsx directly under src/)
 2. assistant
 3. bootstrap
 4. bridge
 5. buddy
 6. cli
 7. commands
 8. components
 9. constants
10. context
11. coordinator
12. entrypoints
13. hooks
14. i18n              (SKIP — this is the i18n module itself)
15. ink
16. jobs
17. keybindings
18. memdir
19. migrations
20. moreright
21. native-ts
22. outputStyles
23. plugins
24. proactive
25. query
26. remote
27. schemas
28. screens
29. server
30. services
31. skills            (SKIP — contains agent prompts, not UI)
32. ssh
33. state
34. tasks
35. tools
36. types             (SKIP — type definitions only)
37. upstreamproxy
38. utils
39. vim
40. voice
```

## Step-by-Step: Processing a Single Module

### Step 1 — List Files

Use `Glob` to list all `.ts`/`.tsx` files in the module directory. For `root`, glob `src/*.ts` and `src/*.tsx`.

### Step 2 — Scan Each File (use sub-agents!)

**Critical: Use Agent tool with subagent_type=Explore or general-purpose agents** to scan files. This protects the main context window.

For each file, the scanning agent should:
1. Read the file content
2. Identify all **string literals** that appear in UI-facing positions:
   - JSX text content and attributes (`<Text>`, `placeholder=`, `label=`, `title=`, etc.)
   - Arguments to logging/display functions (`console.log` visible to user, `chalk.*`, `render()`)
   - Error messages shown to the user (not internal error codes)
   - CLI help text, descriptions, prompts, status messages
   - Template literals that produce user-visible output
3. **EXCLUDE** the following (do NOT register these):
   - Enum values, type literals, discriminated union tags
   - Object keys, property names, internal identifiers
   - File paths, URLs, regex patterns, ANSI codes
   - Agent/LLM system prompts and tool descriptions
   - Log-level identifiers (`'info'`, `'debug'`, `'error'`)
   - Import paths, module names
   - Test fixtures and mock data
   - CSS class names, HTML tag names
   - Constants used as internal protocol values
4. Return a structured list: `{ literal, suggestedKey, filePath, lineNumber, confidence }`
   - `confidence`: `high` (definitely UI), `medium` (likely UI), `low` (uncertain)

### Step 3 — Design i18n Keys

Key format: `{module}.{category}.{descriptor}`

Examples:
| Literal | File | Key |
|---------|------|-----|
| `"Warning: Multiple installations found"` | `src/cli/update.ts` | `cli.warning.multiple_installation` |
| `"Select a model"` | `src/components/ModelPicker.tsx` | `components.model_picker.select_model` |
| `"Failed to connect"` | `src/bridge/client.ts` | `bridge.error.failed_to_connect` |
| `"Yes"` / `"No"` (used everywhere) | multiple | `general.yes` / `general.no` |

Rules:
- First key part = module name (or `general` for heavily reused short strings)
- Use snake_case for all key parts
- Keep keys concise but descriptive
- Group by semantic category when natural (`error`, `warning`, `label`, `action`, `status`, `prompt`, `help`)

### Step 4 — Register to en-US.json

Use the helper script `scripts/append-i18n.ts` (auto-created on first run) to batch-append entries:

```bash
bun scripts/append-i18n.ts '{"cli.warning.multiple_installation":"Warning: Multiple installations found"}'
```

This avoids repeatedly reading/writing the full JSON file.

### Step 5 — Apply `t()` in Source Files

Replace the original literal with a `t()` call:

```typescript
// Before:
const msg = "Warning: Multiple installations found"

// After:
import { t } from '../i18n'
const msg = t("Warning: Multiple installations found", "cli.warning.multiple_installation")
```

**Note:** `t(fallback, key, ...args)` — the first argument is always the English fallback, second is the key.

For template literals with interpolation:
```typescript
// Before:
const msg = `Found ${count} files in ${dir}`

// After:
const msg = t(`Found ${count} files in ${dir}`, "cli.status.found_files", count, dir)
// And register: "cli.status.found_files": "Found {0} files in {1}"
```

### Step 6 — Update Progress

Update `scripts/i18n-progress.json` to mark the module as done.

## Progress Tracking

File: `scripts/i18n-progress.json`

```json
{
  "current_module": "cli",
  "current_file_index": 3,
  "modules": {
    "root": { "status": "done", "files_total": 15, "keys_registered": 42 },
    "assistant": { "status": "done", "files_total": 8, "keys_registered": 12 },
    "bootstrap": { "status": "skipped", "reason": "no UI strings" },
    "bridge": { "status": "in_progress", "files_total": 20, "files_done": 5, "keys_registered": 8 },
    "cli": { "status": "pending" }
  },
  "ambiguous": [
    { "file": "src/bridge/auth.ts", "line": 42, "literal": "session expired", "reason": "might be internal log only" }
  ],
  "stats": {
    "total_keys": 54,
    "modules_done": 2,
    "modules_skipped": 1,
    "modules_pending": 37
  }
}
```

- `ambiguous` array holds items needing human review
- On each cycle, read this file first to determine where to resume

## Context Protection Strategies

1. **Sub-agents for scanning**: Always delegate file reading and literal identification to sub-agents. The main agent only orchestrates.
2. **Batch JSON writes**: Use `scripts/append-i18n.ts` instead of editing en-US.json directly.
3. **Paginated reading**: For large files (>200 lines), read in chunks using `offset`/`limit` on the Read tool.
4. **Progress file as checkpoint**: If context gets large, stop gracefully — the progress file ensures seamless resume.
5. **One module per cycle**: Process one module, save progress, then evaluate whether to continue or yield.

## Helper Scripts

### `scripts/append-i18n.ts`

Accepts a JSON object of key-value pairs and merges them into `src/i18n/locales/en-US.json`, preserving alphabetical key order.

### `scripts/scan-module.ts` (optional)

A lightweight scanner that lists string literals in a file with line numbers, to assist sub-agents.

## Decision Rules for Ambiguous Cases

| Situation | Action |
|-----------|--------|
| String is in a `throw new Error(...)` | Register if the error message is shown to the user via UI; skip if caught internally |
| String is in `console.error(...)` | Register if it's a CLI user-facing message; skip if it's a debug log |
| String is a single word like `"loading"` | Register if rendered in UI; skip if it's an internal state string |
| String appears in both UI and agent prompt | Register only the UI occurrence |
| String is a format pattern like `"YYYY-MM-DD"` | Skip — not translatable |
| String is a technical term like `"WebSocket"` | Skip — universal terminology |

## Self-Healing Loop

The `/loop 5m /i18n` command ensures the workflow automatically resumes if interrupted:

1. **Ping received** → Read `scripts/i18n-progress.json`
2. **If `current_module` has status `in_progress`** → Resume from `current_file_index`
3. **If `current_module` has status `done`** → Advance to next pending module
4. **If all modules done** → Report completion, stop the loop
5. **If main agent is already working** → Ignore the ping

## Verification Checklist (per module)

Before marking a module as `done`:
- [ ] All `.ts`/`.tsx` files scanned
- [ ] All UI-facing literals identified and registered in en-US.json
- [ ] `t()` calls added with correct fallback and key
- [ ] Import `{ t } from '../i18n'` (or correct relative path) added where needed
- [ ] No regressions introduced (string interpolation preserved)
- [ ] Ambiguous items logged to progress file for human review
