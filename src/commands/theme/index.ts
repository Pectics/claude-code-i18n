import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'

const theme = {
  type: 'local-jsx',
  name: 'theme',
  description: t("Change the theme", "commands.theme.description"),
  load: () => import('./theme.js'),
} satisfies Command

export default theme
