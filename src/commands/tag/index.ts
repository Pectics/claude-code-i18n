import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'

const tag = {
  type: 'local-jsx',
  name: 'tag',
  description: t("Toggle a searchable tag on the current session", "commands.tag.description"),
  isEnabled: () => process.env.USER_TYPE === 'ant',
  argumentHint: t("<tag-name>", "commands.tag.argument_hint"),
  load: () => import('./tag.js'),
} satisfies Command

export default tag
