import { ChainId } from '@pancakeswap/sdk'
import { serializeTokens } from './tokens'
import { SerializedStakeConfig } from './types'

const serializedTokens = serializeTokens()

const stake: SerializedStakeConfig[] = [
  {
    text1: "Stake your ECO for XECO and maximize your yield. No Impermanent Loss.",
    text2: `For every swap on ECO, a 0.05% fee is collected to XECO and used to buy back ECO tokens. Currently, buybacks are occurring every
    24 hours. Your XECO is continuously compounding! When you unstake you will receive all the originally deposited ECO and any
    additional from fees.`,
    text3: "Note: If you've staked your xECO into a farm, it will not appear here."
  }
]

export default stake
