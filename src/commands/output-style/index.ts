import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'

const outputStyle = {
  type: 'local-jsx',
  name: 'output-style',
  description: t("Deprecated: use /config to change output style", "commands.output_style.description"),
  isHidden: true,
  load: () => import('./output-style.js'),
} satisfies Command

export default outputStyle
