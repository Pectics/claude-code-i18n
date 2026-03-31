<div align="center">

# Claude Code 汉化版

**Anthropic Claude Code 的中文本地化源码复原项目**

[![版本](https://img.shields.io/badge/版本-v2.1.88--zh-blue?style=flat-square)](package.json)
[![基于版本](https://img.shields.io/badge/基于-v2.1.88%20source%20map-orange?style=flat-square)](https://www.npmjs.com/package/@anthropic-ai/claude-code/v/2.1.88)
[![运行时](https://img.shields.io/badge/Bun-%3E%3D1.3.5-f9f1e1?style=flat-square&logo=bun)](https://bun.sh)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D24.0.0-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![语言](https://img.shields.io/badge/语言-TypeScript-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![许可证](https://img.shields.io/badge/许可证-See%20LICENSE.md-lightgrey?style=flat-square)](LICENSE.md)

![预览图](preview.png)

</div>

---

## 这是什么？

本仓库是 **Claude Code**（Anthropic 官方 AI 编程助手 CLI）的**中文汉化版本**，基于从 source map 中复原的源码树重构而来，并在此基础上进行了本地化工作。

> Claude Code 是一款在终端中运行的 AI 编程助手，能够读写文件、执行命令、调用工具，并通过自然语言与你协同完成复杂的工程任务。

---

## 项目现状

| 功能 | 状态 |
|------|------|
| `bun install` | 成功 |
| `bun run version` | 成功，输出版本信息 |
| `bun run dev` | 成功，经由复原的 CLI bootstrap 启动 |
| `bun run dev --help` | 成功，展示完整命令树 |
| Chrome MCP / Computer Use MCP | 降级模式（shim 实现） |
| 原生 `.node` 绑定 | 部分兼容层替代 |

> 部分模块仍包含复原时的降级回退逻辑，行为可能与原始 Claude Code 有所不同。私有/原生集成因源码不可恢复，仍依赖 shim 或简化实现。

---

## 快速开始

### 环境要求

- [Bun](https://bun.sh) `>= 1.3.5`
- [Node.js](https://nodejs.org) `>= 24.0.0`

### 安装与运行

```bash
# 安装依赖（含本地 shim 包）
bun install

# 启动 CLI
bun run dev

# 查看版本
bun run version

# 查看帮助与完整命令树
bun run dev --help
```

---

## 项目结构

```
claude-code-zh/
├── src/                    # 核心源码
│   ├── bootstrap-entry.ts  # CLI 入口
│   ├── commands/           # 命令实现
│   ├── components/         # TUI React 组件（ink）
│   ├── services/           # 业务服务层
│   ├── tools/              # 工具调用实现
│   └── utils/              # 工具函数
├── shims/                  # 私有包兼容层
│   ├── ant-claude-for-chrome-mcp/
│   ├── ant-computer-use-mcp/
│   ├── color-diff-napi/
│   ├── modifiers-napi/
│   └── url-handler-napi/
├── vendor/                 # 第三方兼容代码
└── image-processor.node    # 原生图像处理模块
```

---

## 复原工作说明

此源码树**非**官方公开仓库，而是从 **2.1.88** 版本的 source map 反推还原，并通过以下方式补齐使其可运行：

- **source map 反推**：从已发布的 bundle 中提取原始 TypeScript 源文件（官方未公开源码）
- **缺失模块 shim**：对无法从 source map 恢复的私有/原生包（`@ant/computer-use-mcp`、`color-diff-napi` 等）编写了兼容替代层
- **入口重建**：默认 Bun 脚本现已接入真实的 CLI bootstrap 路径
- **Skill 内容补全**：`claude-api`、`verify` 等 skill 内容已从占位文件重写为可用的参考文档
- **MCP 工具目录恢复**：Chrome MCP 和 Computer Use MCP 的兼容层现在暴露真实的工具目录和结构化降级响应

### 为什么部分功能存在差异？

Source map 本身的固有局限：

- 仅类型定义的文件通常不包含在内
- 构建时生成的文件可能缺失
- 私有包封装和原生绑定无法恢复
- 动态导入和资源文件往往不完整

---

## 贡献指南

### 代码风格

- TypeScript + ESM 模块，`react-jsx` 渲染
- 变量/函数：`camelCase`
- React 组件 / Manager 类：`PascalCase`
- 命令目录：`kebab-case`（如 `src/commands/install-slack-app/`）
- 大部分文件省略分号，使用单引号

### 提交规范

使用简洁的祈使句式，例如：

```
Fix MCP config normalization
Restore planning prompt fallback
Add zh translation for help text
```

PR 应说明：用户可见的影响、复原相关的权衡取舍、验证步骤；TUI/UI 变更请附截图。

### 开发验证

```bash
# 启动 CLI 进行冒烟测试
bun run dev

# 验证版本输出
bun run version

# 针对修改的命令/服务/界面路径手动测试
bun run dev <your-command>
```

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 运行时 | Bun + Node.js |
| UI 框架 | [Ink](https://github.com/vadimdemedes/ink)（React TUI） |
| AI SDK | `@anthropic-ai/sdk`、`@anthropic-ai/claude-agent-sdk` |
| MCP | `@modelcontextprotocol/sdk` |
| 可观测性 | OpenTelemetry |
| 验证 | Zod |
| 云集成 | AWS Bedrock、Google Auth |

---

## 免责声明

本项目为非官方社区复原及汉化工作，与 Anthropic 无官方关联。原始 Claude Code 的所有权利归 Anthropic 所有。请参阅 [LICENSE.md](LICENSE.md) 了解具体许可条款。

---

<div align="center">

如有问题或建议，欢迎提交 Issue 或 PR。

</div>
