import { ChainId } from '@pancakeswap/sdk'

const NETWORK_URLS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://rpc-mainnet.matic.network',
  [ChainId.TESTNET]: 'https://matic-mumbai.chainstacklabs.com',
}

export default NETWORK_URLS
