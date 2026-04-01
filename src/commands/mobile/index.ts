import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'

const mobile = {
  type: 'local-jsx',
  name: 'mobile',
  aliases: ['ios', 'android'],
  description: t("Show QR code to download the Claude mobile app", "commands.mobile.description"),
  load: () => import('./mobile.js'),
} satisfies Command

export default mobile
