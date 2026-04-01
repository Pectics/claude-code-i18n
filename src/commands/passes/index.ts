import { t } from 'src/i18n/index.js'
import type { Command } from '../../commands.js'
import {
  checkCachedPassesEligibility,
  getCachedReferrerReward,
} from '../../services/api/referral.js'

export default {
  type: 'local-jsx',
  name: 'passes',
  get description() {
    const reward = getCachedReferrerReward()
    if (reward) {
      return t("Share a free week of Claude Code with friends and earn extra usage", "commands.passes.description.with_reward")
    }
    return t("Share a free week of Claude Code with friends", "commands.passes.description.without_reward")
  },
  get isHidden() {
    const { eligible, hasCache } = checkCachedPassesEligibility()
    return !eligible || !hasCache
  },
  load: () => import('./passes.js'),
} satisfies Command
