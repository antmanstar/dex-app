import { ChainId, Token } from '@pancakeswap/sdk'
import { serializeToken } from 'state/user/hooks/helpers'
import { SerializedToken } from './types'

const { MAINNET, TESTNET } = ChainId

interface TokenList {
  [symbol: string]: Token
}

interface SerializedTokenList {
  [symbol: string]: SerializedToken
}

export const mainnetTokens = {
  wbnb: new Token(
    MAINNET,
    '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    18,
    'WMATC',
    'Wrapped MATIC',
    'https://www.binance.com/',
  ),
  // bnb here points to the wbnb contract. Wherever the currency BNB is required, conditional checks for the symbol 'BNB' can be used
  bnb: new Token(
    MAINNET,
    '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    18,
    'MATIC',
    'MATIC',
    'https://www.binance.com/',
  ),
  busd: new Token(
    MAINNET,
    '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    18,
    'BUSD',
    'BUSD',
    'https://www.binance.com/',
  ),
  cake: new Token(
    MAINNET,
    '0xdbF0Fb8499ab4dd4727fdbf96B3F9465063345f9',
    18,
    'ECO',
    'EcoSwap Token',
    'https://pancakeswap.finance/',
  ),
  weth: new Token(
    MAINNET,
    '0x6726ba83CD463dc3a2118Ab2C6E553E2c8a9F2d8',
    18,
    'WETH',
    'Wrapped ETH',
    'https://www.binance.com/',
  ),
  usdt: new Token(
    MAINNET,
    '0x65B1A7066D51499DC6F5284c81645d6051D2ca67',
    18,
    'USDT',
    'US Doller Tether',
    'https://www.binance.com/',
  ),
}

export const testnetTokens = {
  wbnb: new Token(
    TESTNET,
    '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    18,
    'WMATIC',
    'Wrapped MATIC',
    'https://www.binance.com/',
  ),
  weth: new Token(
    TESTNET,
    '0x6726ba83CD463dc3a2118Ab2C6E553E2c8a9F2d8',
    18,
    'WETH',
    'Wrapped ETH',
    'https://www.binance.com/',
  ),
  bnb: new Token(
    TESTNET,
    '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    18,
    'MATIC',
    'MATIC',
    'https://www.binance.com/',
  ),
  cake: new Token(
    TESTNET,
    '0xdbF0Fb8499ab4dd4727fdbf96B3F9465063345f9',
    18,
    'ECO',
    'EcoSwap Token',
    'https://pancakeswap.finance/',
  ),
  usdt: new Token(
    TESTNET,
    '0x65B1A7066D51499DC6F5284c81645d6051D2ca67',
    18,
    'USDT',
    'US Doller Tether',
    'https://www.binance.com/',
  ),
}

const tokens = (): TokenList => {
  const chainId = process.env.REACT_APP_CHAIN_ID

  // If testnet - return list comprised of testnetTokens wherever they exist, and mainnetTokens where they don't
  if (parseInt(chainId, 10) === ChainId.TESTNET) {
    return Object.keys(mainnetTokens).reduce((accum, key) => {
      return { ...accum, [key]: testnetTokens[key] || mainnetTokens[key] }
    }, {})
  }

  return mainnetTokens
}

export const serializeTokens = (): SerializedTokenList => {
  const unserializedTokens = tokens()
  const serializedTokens = Object.keys(unserializedTokens).reduce((accum, key) => {
    return { ...accum, [key]: serializeToken(unserializedTokens[key]) }
  }, {})

  return serializedTokens
}

export default tokens()
