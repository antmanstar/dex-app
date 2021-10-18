import React, { RefObject, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Currency, Pair, Token } from '@pancakeswap/sdk'
import {
  Text,
  Flex,
  CardBody,
  CardFooter,
  Button,
  AddIcon,
  SubMenuItems,
  Heading,
  Table,
  Th,
  Td, Tab, TabMenu, Input,
} from '@pancakeswap/uikit'
import { Link } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { usePairs } from '../../hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import Dots from '../../components/Loader/Dots'
import { AppHeader } from '../../components/App'
import Page from '../Page'
import config from '../../components/Menu/config/config'
import Container from '../../components/Layout/Container'
import { useCurrency, useToken } from '../../hooks/Tokens'
import { CurrencyLogo } from '../../components/Logo'
import useDebounce from '../../hooks/useDebounce'
import { filterTokens } from '../../components/SearchModal/filtering'
import { isAddress } from '../../utils'

const pairs = [
  {
    token1: 'matic',
    token2: '0x3222818d06F63eCa9502e18e40000807893C3a46',
  }
];

const AppBody = styled(`div`)`
  max-width: 1024px;
  width: 100%;
  z-index: 1;
`

const Body = styled(`div`)`
  border-radius: 10px;
  margin-top: 2rem;
`

const Header = styled(`div`)`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
`

const PoolContainer = styled(`div`)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const TabContainer = styled(`div`)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CurrencyContainer = styled(`div`)`
  display: flex;
`

const InputWrapper = styled(`div`)`
  width: 100%;
  max-width: 400px;
`

export default function Pool() {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
  }, [])

  const debouncedQuery = useDebounce(searchQuery, 200)

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const filteredPairs: any = useMemo(() => {

    const lowerSearchParts = debouncedQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0)

    const matchesSearch = (s: string): boolean => {
      const sParts = s
        .toLowerCase()
        .split(/\s+/)
        .filter((s_) => s_.length > 0)

      return lowerSearchParts.every((p) => p.length === 0 || sParts.some((sp) => sp.startsWith(p) || sp.endsWith(p)))
    }
    return trackedTokenPairs.filter((pairss) => {
      const [pair1, pair2] = pairss;
      return (pair1 && matchesSearch(pair1.symbol)) || (pair2 && matchesSearch(pair2.symbol))
    })
  }, [trackedTokenPairs, debouncedQuery])
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const renderBody = () => {
    if (!account) {
      return (
        <Text color="textSubtle" textAlign="center">
          {t('Connect to a wallet to view your liquidity.')}
        </Text>
      )
    }
    if (v2IsLoading) {
      return (
        <Text color="textSubtle" textAlign="center">
          <Dots>{t('Loading')}</Dots>
        </Text>
      )
    }
    if (allV2PairsWithLiquidity?.length > 0) {
      return allV2PairsWithLiquidity.map((v2Pair, index) => (
        <FullPositionCard
          key={v2Pair.liquidityToken.address}
          pair={v2Pair}
          mb={index < allV2PairsWithLiquidity.length - 1 ? '16px' : 0}
        />
      ))
    }
    return (
      <Text color="textSubtle" textAlign="center">
        {t('No liquidity found.')}
      </Text>
    )
  }

  return (
    <Page>
      {/* @ts-ignore */}
      <SubMenuItems items={config(t)[0].items} mt={`${56 + 1}px`} activeItem="/liquidity" />
      <AppBody>
        <Header>
          <PoolContainer>
            <Heading>Pool</Heading>
            <Button id="import-pool-link" variant="text" scale="sm" as={Link} to="/find">
              {t('Import')}
            </Button>
          </PoolContainer>
          <Button id="join-pool-button" as={Link} to="/add">
            {t('Create a Pool')}
          </Button>
        </Header>
        {/* <AppHeader title={t('Your Liquidity')} subtitle={t('Remove liquidity to receive tokens back')} /> */}
        <Body>
          {/* {renderBody()} */}
          <TabContainer>
            <TabMenu activeIndex={0}>
              <Tab color='primary'>
                All
              </Tab>
              <Tab>
                My Pools
              </Tab>
            </TabMenu>
            <InputWrapper>
              <Input
                id="token-search-input"
                placeholder={t('Search name or paste address')}
                scale="lg"
                autoComplete="off"
                value={searchQuery}
                onChange={handleInput}
              />
            </InputWrapper>
          </TabContainer>
          <Table>
            <thead>
              <Th>Name</Th>
              <Th>Liquidity</Th>
              <Th>Volume</Th>
              <Th>Fees</Th>
            </thead>
            <tbody>
            {filteredPairs.map(TokenList)}
            </tbody>
          </Table>
        </Body>
      </AppBody>
    </Page>
  )
}


const TokenList = (tokens: [Token, Token]) => {
  const [token1, token2] = tokens;
  let currency1: Token | Currency = token1;
  let currency2: Token | Currency = token2;
  const matic = useCurrency('matic')

  let address1 = token1.address;
  let address2 = token2.address;

  if(currency1.symbol.toLowerCase() === 'wmatic') {
    address1 = 'MATIC'
    currency1 = matic
  }
  if(currency2.symbol.toLowerCase() === 'wmatic') {
    address2 = address1
    currency2 = currency1
    address1 = 'MATIC'
    currency1 = matic
    // address2 = 'MATIC'
    // currency2 = matic
  }
  return (
    <>
      <Td>
        <Button id={`pool-${address1}-${address2}`} as={Link} variant="text" to={`/add/${address1}/${address2}`}>
          <div>
            <CurrencyLogo currency={currency1} />
            <CurrencyLogo currency={currency2} style={{marginLeft: '-10px'}} />
          </div>
          <Text ml='10px'>{currency1?.name?.toUpperCase()} / {currency2?.name?.toUpperCase()}</Text>
        </Button>
      </Td>
      <Td><Text>0</Text></Td>
      <Td><Text>0</Text></Td>
      <Td><Text>0</Text></Td>
    </>
  );
}