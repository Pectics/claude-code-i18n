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

# i18n Localization Workflow

## Trigger

Use `/loop 5m Continue the i18n localization workflow. Read scripts/i18n-progress.json to determine where to resume, then process the next pending module.` to start the self-healing workflow loop.

When triggered (manually or by loop ping), execute the **Workflow Cycle** below.

## Workflow Cycle

```
1. READ PROGRESS   →  scripts/i18n-progress.json
2. DETERMINE NEXT  →  Find next unfinished module
3. PROCESS MODULE  →  Scan → Register keys → Apply t() → Verify
4. SAVE PROGRESS   →  Update progress + en-US.json
5. LOOP or HALT    →  Continue or stop if context is large
```

## Critical Rules (Read Before Doing Anything)

### RULE 1: No Module May Be Skipped Without File-Level Evidence

**Every module in `src/` MUST be scanned file-by-file.** You may NOT skip a module based on its name alone (e.g., "ssh sounds internal", "schemas is just types"). A module may only be marked `skipped` if a sub-agent has actually read every file in it and confirmed there are zero UI-facing strings. The `reason` field must list the files examined.

### RULE 2: Every Key Registered MUST Have a Corresponding t() Call

A key in `en-US.json` without a `t()` call in source code is useless. The workflow is: **register key AND apply t() in the same step, then verify both exist.** Never batch-register keys to en-US.json without simultaneously modifying the source files.

### RULE 3: Locale Values Must Use {0} Placeholder Format, NEVER ${...}

The `t()` function uses positional `{0}`, `{1}`, `{2}` placeholders. The values in `en-US.json` must NEVER contain TypeScript template literal syntax like `${variable}`, `${expr.prop}`, or `${fn(x)}`.

**CORRECT:**
```json
"bridge.error.version_too_old": "Your version ({0}) is too old. Version {1} or higher is required."
```

**WRONG (will break at runtime):**
```json
"bridge.error.version_too_old": "Your version (${MACRO.VERSION}) is too old. Version ${config.minVersion} or higher is required."
```

### RULE 4: t() Function Has Two Calling Patterns

```typescript
// Pattern A: Static string (no interpolation)
t('Some fixed message', 'module.category.key')

// Pattern B: Dynamic string with positional args
t('Found {0} files in {1}', 'module.category.key', count, dir)
```

**Signature:** `t(fallback: string, key: string, ...args: unknown[]): string`
- First arg = English fallback (always a plain string literal with `{0}` placeholders, NOT a template literal)
- Second arg = i18n key
- Remaining args = values to substitute for `{0}`, `{1}`, etc.

**WRONG patterns (do NOT produce these):**
```typescript
// WRONG: template literal as fallback
t(`Found ${count} files`, 'key', count)

// WRONG: reversed argument order
t('module.key', 'Found files')

// WRONG: no key
t('Some message')
```

### RULE 5: Strict Sub-Agent Usage for Context Protection

The main agent MUST NOT read source files directly. All file reading and scanning is done by sub-agents. The main agent only:
1. Reads/writes `scripts/i18n-progress.json`
2. Orchestrates sub-agents
3. Runs `bun scripts/append-i18n.ts` for batch key registration
4. Updates progress tracking

**Sub-agent responsibilities and limits:**
- Each sub-agent handles **at most 5 files** per invocation
- Each sub-agent MUST return: `{ file, keysFound: [{literal, key, line, confidence}], importNeeded: boolean }`
- For modules with >5 files, spawn multiple sub-agents (can run in parallel)

### RULE 6: Mandatory Verification Pass

After processing each module, spawn a **separate verification sub-agent** that:
1. Reads every file in the module that was modified
2. Confirms each registered key has a matching `t()` call in source
3. Confirms every `t()` call has its key present in en-US.json
4. Confirms no `${...}` patterns exist in en-US.json values for this module's keys
5. Confirms the `import { t } from '../i18n'` (correct relative path) is present in every modified file
6. Returns a pass/fail report with specific issues

If verification fails, fix the issues before marking the module as done.

### RULE 7: One Module Per Cycle, Then Evaluate Context

Process exactly ONE module per workflow trigger. After completing a module (including verification), evaluate whether to continue:
- If the conversation has fewer than ~30 tool calls so far, continue to the next module
- Otherwise, save progress and halt — the loop will resume in the next cycle

## Module Processing Order

Every module in `src/` sorted alphabetically. Root-level files are grouped as `root`.

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

Only modules 14, 31, and 36 may be marked `skipped` without scanning. ALL other modules require file-by-file scanning.

## Step-by-Step: Processing a Single Module

### Phase 1 — List Files

Use `Glob` to list all `.ts`/`.tsx` files. For `root`, glob `src/*.ts` and `src/*.tsx`.

### Phase 2 — Scan Files (Sub-Agents)

Spawn sub-agents (max 5 files each) with this exact prompt template:

```
You are scanning source files for UI-facing string literals that need i18n.

For each file, READ the entire file and identify string literals in these positions:
- JSX text content: <Text>...</Text>, <Box>...</Box> children
- JSX attributes: placeholder=, label=, title=, description=
- chalk.* calls: chalk.red('...'), chalk.bold('...')
- console.log/warn/error that are user-facing CLI output
- Error messages in throw/reject that surface to the user
- Status messages, prompts, help text, descriptions
- Template literals producing user-visible output

EXCLUDE (do NOT report):
- Enum values, type literals, union tags, object keys
- File paths, URLs, regex, ANSI codes
- Agent/LLM system prompts and tool descriptions (long multi-line strings describing agent behavior)
- Internal identifiers, log-level strings ('info','debug')
- Import paths, module names, CSS classes, HTML tags
- Format patterns ('YYYY-MM-DD'), technical terms ('WebSocket')
- Strings already wrapped in t()

For each found literal, output:
{
  "file": "<path>",
  "line": <number>,
  "literal": "<the string>",
  "key": "<module>.<category>.<descriptor>",
  "hasInterpolation": <boolean>,
  "placeholders": ["description of {0}", "description of {1}"],
  "confidence": "high|medium|low"
}

Key naming rules:
- Format: {module}.{category}.{descriptor}
- module = directory name (or 'general' for heavily reused strings)
- category = error|warning|label|action|status|prompt|help|info
- descriptor = snake_case, concise but descriptive
- For strings used across many modules, use 'general.' prefix

Files to scan: [list provided by orchestrator]
```

### Phase 3 — Register Keys and Apply t()

For each batch of scan results:

1. **Build the key-value JSON** for `en-US.json`:
   - Static strings: `"key": "The exact string"`
   - Dynamic strings: Convert `${expr}` to `{0}`, `{1}`, etc. in order of appearance
   - Example: `` `Found ${count} files in ${dir}` `` → `"Found {0} files in {1}"`

2. **Register keys** via the append script:
   ```bash
   bun scripts/append-i18n.ts '{"key1":"value1","key2":"value2"}'
   ```

3. **Apply t() calls** in source files using the Edit tool:
   - Static: `t('English fallback', 'module.category.key')`
   - Dynamic: `t('Found {0} files in {1}', 'module.category.key', count, dir)`
   - Add `import { t } from '../i18n'` (adjust relative path) if not already present

**IMPORTANT:** When converting template literals with interpolation:
```typescript
// Source has:
const msg = `Connection lost (code ${closeCode})`

// en-US.json gets:
"bridge.error.connection_lost": "Connection lost (code {0})"

// Source becomes:
const msg = t('Connection lost (code {0})', 'bridge.error.connection_lost', closeCode)
```
The fallback string in `t()` MUST be a regular string literal with `{0}` placeholders, NOT a template literal with `${...}`.

### Phase 4 — Verification (Sub-Agent)

Spawn a verification sub-agent with this prompt:

```
You are verifying i18n changes for the [MODULE] module.

For each file listed below, READ the file and check:
1. Every t() call has exactly 2+ arguments: t(fallback, key, ...args)
2. The fallback (first arg) is a plain string literal, NOT a template literal
3. The key (second arg) matches a key that should exist in en-US.json
4. If the fallback contains {0}, {1} etc., corresponding args are passed
5. The import { t } from '[correct relative path]/i18n' is present
6. No untranslated UI-facing string literals remain (that should have been caught)

Also verify the en-US.json entries for this module's keys:
- No ${...} syntax in values (must use {0} format)
- Values match the fallback strings in t() calls

Return a JSON report:
{
  "passed": boolean,
  "issues": [{"file": "...", "line": N, "issue": "description"}],
  "keysVerified": N,
  "filesChecked": N
}

Files to verify: [list provided by orchestrator]
```

### Phase 5 — Update Progress

Update `scripts/i18n-progress.json`:
```json
{
  "module_name": {
    "status": "done",
    "files_total": N,
    "files_modified": N,
    "keys_registered": N,
    "verified": true
  }
}
```

## Progress Tracking

File: `scripts/i18n-progress.json`

```json
{
  "current_module": "bridge",
  "current_file_index": 0,
  "workflow_complete": false,
  "modules": {
    "root": { "status": "done", "files_total": 22, "files_modified": 15, "keys_registered": 42, "verified": true },
    "assistant": { "status": "done", "files_total": 8, "files_modified": 3, "keys_registered": 12, "verified": true },
    "bootstrap": { "status": "skipped", "reason": "Scanned 3 files (bootstrapMacro.ts, bootstrap-entry.ts, bootstrap.ts): no UI-facing strings, only internal module initialization", "files_examined": 3 },
    "bridge": { "status": "in_progress", "files_total": 20, "files_done": 5, "keys_registered": 8 }
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

Fields explained:
- `files_modified`: files that actually had t() calls added (not just scanned)
- `verified`: true only after Phase 4 verification passes
- `ambiguous`: items needing human review — always log rather than guess
- `status: "skipped"` requires `reason` with specific file names examined

## Key Naming Convention

Format: `{module}.{category}.{descriptor}`

| Category | Use for |
|----------|---------|
| `error` | Error messages shown to user |
| `warning` | Warning messages |
| `label` | UI labels, field names |
| `action` | Button text, action descriptions |
| `status` | Status messages, progress indicators |
| `prompt` | Prompts asking for user input |
| `help` | Help text, descriptions, usage info |
| `info` | Informational messages |

Examples:
| Literal | Key |
|---------|-----|
| `"Warning: Multiple installations found"` | `cli.warning.multiple_installation` |
| `"Select a model"` | `components.model_picker.select_model` |
| `"Failed to connect"` | `bridge.error.connect_failed` |
| `"Yes"` / `"No"` (cross-module) | `general.yes` / `general.no` |

## Decision Rules for Ambiguous Cases

| Situation | Action |
|-----------|--------|
| String in `throw new Error(...)` | Register if error surfaces to CLI user; skip if caught internally |
| String in `console.error(...)` | Register if it's CLI user-facing output; skip if debug/internal log |
| Single word like `"loading"` | Register if rendered in UI (JSX, chalk); skip if internal state |
| String in both UI and agent prompt | Register only the UI occurrence |
| Format pattern `"YYYY-MM-DD"` | Skip |
| Technical term `"WebSocket"` | Skip |
| Long multi-line string describing agent behavior | Skip — this is a system prompt |
| String only used as object key or map lookup | Skip |
| Module name sounds "internal" (ssh, remote, etc.) | **STILL SCAN IT** — module names say nothing about UI content |

## Context Protection Strategy

1. **Main agent never reads source files** — all scanning/editing delegated to sub-agents
2. **Max 5 files per sub-agent** — prevents any single agent from overloading context
3. **Batch JSON writes** via `scripts/append-i18n.ts` — avoids editing en-US.json directly
4. **One module per cycle** — complete, verify, save progress, then evaluate context budget
5. **Progress file as checkpoint** — enables seamless resume across conversation boundaries
6. **Separate verification agent** — catches errors before marking done, prevents false "completed" states

## Common Mistakes to Avoid

These are real mistakes observed in previous runs. Do NOT repeat them:

1. **Registering keys without adding t() calls** — en-US.json had 1000+ keys but only 16 files imported t()
2. **Skipping modules by name** — "ssh" was skipped as "internal" without reading a single file
3. **Using ${...} in locale values** — 36 keys had raw TS template syntax like `${jsonStringify(response.data)}`
4. **Template literals as t() fallback** — `` t(`Found ${count} files`, 'key') `` is WRONG; must be `t('Found {0} files', 'key', count)`
5. **Marking modules "done" without verification** — no second pass to confirm changes were actually applied
6. **Reading large files in main context** — source files should only be read by sub-agents
7. **Processing too many modules before stopping** — leads to context exhaustion and increasing error rates
