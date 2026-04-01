/**
 * Color command - minimal metadata only.
 * Implementation is lazy-loaded from color.ts to reduce startup time.
 */
import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'

const color = {
  type: 'local-jsx',
  name: 'color',
  description: t("Set the prompt bar color for this session", "commands.color.description"),
  immediate: true,
  argumentHint: t("<color|default>", "commands.color.argument_hint"),
  load: () => import('./color.js'),
} satisfies Command

export default color
