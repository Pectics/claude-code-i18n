import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'

const mcp = {
  type: 'local-jsx',
  name: 'mcp',
  description: t("Manage MCP servers", "commands.mcp.description"),
  immediate: true,
  argumentHint: t("[enable|disable [server-name]]", "commands.mcp.argument_hint"),
  load: () => import('./mcp.js'),
} satisfies Command

export default mcp
