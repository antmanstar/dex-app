import { ChainId } from '@pancakeswap/sdk'
import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const serializedTokens = serializeTokens()

const farms: SerializedFarmConfig[] = [
  {
    pid: 1,
    lpSymbol: 'WETH-WMATIC LP',
    lpAddresses: {
      137: '0x99658e8d18Dc9BB6DBfbaA0d9C4c1cB69E3d9Fd1',
      [ChainId.TESTNET]: '0x99658e8d18Dc9BB6DBfbaA0d9C4c1cB69E3d9Fd1',
    },
    token: serializedTokens.weth,
    quoteToken: serializedTokens.wbnb,
    isCommunity: true,
  },
]

export default farms
