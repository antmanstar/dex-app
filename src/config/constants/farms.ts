import { ChainId } from '@pancakeswap/sdk'
import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const serializedTokens = serializeTokens()

const farms: SerializedFarmConfig[] = [
  // {
  //   pid: 0,
  //   lpSymbol: 'ECO LP',
  //   lpAddresses: {
  //     137: '0x165966c22bcaE3fD8F7eC9c16b22cd8417d96Ea4',
  //     [ChainId.TESTNET]: '0x165966c22bcaE3fD8F7eC9c16b22cd8417d96Ea4',
  //   },
  //   token: serializedTokens.cake,
  //   quoteToken: serializedTokens.cake,
  //   isCommunity: true,
  // },
  // {
  //   pid: 1,
  //   lpSymbol: 'WETH-MATIC LP',
  //   lpAddresses: {
  //     137: '0x99658e8d18Dc9BB6DBfbaA0d9C4c1cB69E3d9Fd1',
  //     [ChainId.TESTNET]: '0x99658e8d18Dc9BB6DBfbaA0d9C4c1cB69E3d9Fd1',
  //   },
  //   token: serializedTokens.weth,
  //   quoteToken: serializedTokens.wbnb,
  //   isCommunity: true,
  // },
  // {
  //   pid: 2,
  //   lpSymbol: 'USDT-MATIC LP',
  //   lpAddresses: {
  //     137: '0x69B126538e89194EC895250f5ad196D364c8FB67',
  //     [ChainId.TESTNET]: '0x69B126538e89194EC895250f5ad196D364c8FB67',
  //   },
  //   token: serializedTokens.busd,
  //   quoteToken: serializedTokens.wbnb,
  //   isCommunity: true,
  // },
]

export default farms
