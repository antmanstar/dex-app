import { getAddress } from 'utils/addressHelpers'

describe('getAddress', () => {
  const address = {
    137: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    80001: '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
  }

  it(`get address for mainnet (chainId 137)`, () => {
    process.env.REACT_APP_CHAIN_ID = '137'
    const expected = address[137]
    expect(getAddress(address)).toEqual(expected)
  })
  it(`get address for testnet (chainId 80001)`, () => {
    process.env.REACT_APP_CHAIN_ID = '80001'
    const expected = address[80001]
    expect(getAddress(address)).toEqual(expected)
  })
  it(`get address for any other network (chainId 31337)`, () => {
    process.env.REACT_APP_CHAIN_ID = '31337'
    const expected = address[137]
    expect(getAddress(address)).toEqual(expected)
  })
})
