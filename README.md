<div align="center">

# Claude Code i18n

**Multi-language internationalization project for Anthropic Claude Code**

[![Version](https://img.shields.io/badge/version-v2.1.88--i18n-blue?style=flat-square)](package.json)
[![Based On](https://img.shields.io/badge/based%20on-v2.1.88%20source%20map-orange?style=flat-square)](https://www.npmjs.com/package/@anthropic-ai/claude-code/v/2.1.88)
[![Runtime](https://img.shields.io/badge/Bun-%3E%3D1.3.5-f9f1e1?style=flat-square&logo=bun)](https://bun.sh)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D24.0.0-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![Language](https://img.shields.io/badge/language-TypeScript-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-See%20LICENSE.md-lightgrey?style=flat-square)](LICENSE.md)

</div>

---

## What is this?

This repository is an **internationalization (i18n) project** for **Claude Code** — Anthropic's official AI coding assistant CLI — reconstructed from source maps (v2.1.88) with missing module shims restored. It provides a framework for translating Claude Code's UI strings into multiple languages.

> Claude Code is an AI coding assistant that runs in your terminal. It can read and write files, execute commands, invoke tools, and collaborate with you on complex engineering tasks through natural language.

The i18n module lives in `src/i18n/` and uses a `t(fallback, key, ...args)` function to wrap all user-visible strings with locale-aware translations.

---

## Project Status

| Feature | Status |
|---------|--------|
| `bun install` | Working |
| `bun run version` | Working, prints version info |
| `bun run dev` | Working, starts via restored CLI bootstrap |
| `bun run dev --help` | Working, shows full command tree |
| Chrome MCP / Computer Use MCP | Degraded mode (shim implementation) |
| Native `.node` bindings | Partial compatibility layer |

> Some modules still contain fallback logic from the restoration process and may behave differently from the original Claude Code. Private/native integrations that could not be recovered from source maps rely on shims or simplified implementations.

---

## Quick Start

### Requirements

- [Bun](https://bun.sh) `>= 1.3.5`
- [Node.js](https://nodejs.org) `>= 24.0.0`

### Install & Run

```bash
# Install dependencies (includes local shim packages)
bun install

# Start the CLI
bun run dev

# Print version
bun run version

# Show help and full command tree
bun run dev --help
```

---

## Project Structure

```
claude-code-i18n/
├── src/
│   ├── bootstrap-entry.ts   # CLI entry point
│   ├── commands/            # Command implementations
│   ├── components/          # TUI React components (ink)
│   ├── services/            # Business service layer
│   ├── tools/               # Tool call implementations
│   ├── utils/               # Utility functions
│   └── i18n/                # Internationalization module
│       ├── index.ts         # t() function and locale loader
│       └── locales/
│           ├── en-US.json   # English (source strings)
│           └── zh-CN.json   # Simplified Chinese
├── shims/                   # Private package compatibility layer
│   ├── ant-claude-for-chrome-mcp/
│   ├── ant-computer-use-mcp/
│   ├── color-diff-napi/
│   ├── modifiers-napi/
│   └── url-handler-napi/
├── scripts/                 # i18n tooling scripts
│   ├── append-i18n.ts       # Batch-append keys to locale files
│   └── i18n-progress.json   # Per-module translation progress
├── vendor/                  # Third-party compatibility code
└── image-processor.node     # Native image processing module
```

---

## i18n Module (`src/i18n/`)

### How it works

All user-visible strings are wrapped with the `t()` function:

```typescript
import { t } from '../i18n'

// Simple string
const msg = t("Warning: Multiple installations found", "cli.warning.multiple_installation")

// With interpolation
const msg = t(`Found ${count} files in ${dir}`, "cli.status.found_files", count, dir)
```

Signature: `t(fallback, key, ...args)` — the first argument is always the English fallback, second is the locale key.

### Adding a new locale

1. Copy `src/i18n/locales/en-US.json` to `src/i18n/locales/<locale>.json`
2. Translate the values (keep keys unchanged)
3. Register the locale in `src/i18n/index.ts`

### Key naming convention

Keys follow the format `{module}.{category}.{descriptor}` in snake_case, e.g.:

| String | Key |
|--------|-----|
| `"Warning: Multiple installations found"` | `cli.warning.multiple_installation` |
| `"Select a model"` | `components.model_picker.select_model` |
| `"Failed to connect"` | `bridge.error.failed_to_connect` |

---

## Contributing

### Adding translations

1. **Find untranslated strings** — look for `t()` calls in `src/` or strings in `en-US.json` missing from your target locale file.
2. **Add entries to your locale file** — edit `src/i18n/locales/<locale>.json` and add the translated value for each key.
3. **Register new source strings** — if you find a UI string not yet wrapped with `t()`, use the helper script:
   ```bash
   bun scripts/append-i18n.ts '{"module.category.key": "English string here"}'
   ```
4. **Wrap the literal in source** — replace the raw string with a `t()` call (see i18n module section above).
5. **Submit a PR** — describe which locale was updated, how many keys were added, and include a screenshot if there are visible UI changes.

### Code style

- TypeScript + ESM modules, `react-jsx` rendering
- Variables/functions: `camelCase`
- React components / Manager classes: `PascalCase`
- Command directories: `kebab-case` (e.g. `src/commands/install-slack-app/`)
- No semicolons in most files, single quotes preferred

### Commit convention

Use concise imperative sentences, for example:

```
i18n: add zh-CN translations for bridge module
i18n: register missing keys for components/Spinner
fix: preserve interpolation in t() call for file count
```

PRs should describe: user-visible impact, any restoration trade-offs, and validation steps. Include screenshots for TUI/UI changes.

### Development validation

```bash
# Start CLI for smoke testing
bun run dev

# Verify version output
bun run version

# Manually test the affected command/service/UI path
bun run dev <your-command>
```

---

## Restoration Notes

This source tree is **not** an official public repository — it was reconstructed from the **2.1.88** source map and made runnable by:

- **Source map extraction**: Original TypeScript files were extracted from the published bundle (Anthropic does not publish source code)
- **Missing module shims**: Private/native packages (`@ant/computer-use-mcp`, `color-diff-napi`, etc.) were replaced with compatible stubs
- **Entry point reconstruction**: Bun scripts now connect to the real CLI bootstrap path
- **Skill content restoration**: `claude-api`, `verify`, and similar skills were rewritten from placeholder files into usable reference documents
- **MCP tool directory recovery**: Chrome MCP and Computer Use MCP compatibility layers now expose real tool manifests with structured degraded responses

### Why do some features differ?

Inherent limitations of source map extraction:

- Type-only files are typically absent
- Build-time generated files may be missing
- Private package internals and native bindings cannot be recovered
- Dynamic imports and asset files are often incomplete

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Bun + Node.js |
| UI Framework | [Ink](https://github.com/vadimdemedes/ink) (React TUI) |
| AI SDK | `@anthropic-ai/sdk`, `@anthropic-ai/claude-agent-sdk` |
| MCP | `@modelcontextprotocol/sdk` |
| Observability | OpenTelemetry |
| Validation | Zod |
| Cloud Integrations | AWS Bedrock, Google Auth |

---

## Disclaimer

This is an unofficial community reconstruction and internationalization project, unaffiliated with Anthropic. All rights to the original Claude Code belong to Anthropic. See [LICENSE.md](LICENSE.md) for specific license terms.

---

<div align="center">

Questions or suggestions? Open an Issue or submit a PR.

</div>
