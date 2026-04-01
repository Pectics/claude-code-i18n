import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'

const heapDump = {
  type: 'local',
  name: 'heapdump',
  description: t("Dump the JS heap to ~/Desktop", "commands.heapdump.description"),
  isHidden: true,
  supportsNonInteractive: true,
  load: () => import('./heapdump.js'),
} satisfies Command

export default heapDump
