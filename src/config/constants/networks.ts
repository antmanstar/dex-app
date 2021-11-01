import { ChainId } from '@pancakeswap/sdk'

const NETWORK_URLS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://rpc-mainnet.matic.network',
  [ChainId.TESTNET]: 'https://matic-mumbai.chainstacklabs.com',
}

export const networkList = (t) => {
  return [
    {
      label: t('Polygon'),
      icon: '/images/tokens/matic.png',
      value: 'polygon',
    },
    // {
    //   label: t('Ethereum'),
    //   icon: '/images/tokens/0x2170Ed0880ac9A755fd29B2688956BD959F933F8.png',
    //   value: 'ethereum',
    // },
    // {
    //   label: t('BSC Mainnet'),
    //   icon: '/images/tokens/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270.png',
    //   value: 'bscMainnet',
    // },
  ]
}

export default NETWORK_URLS
