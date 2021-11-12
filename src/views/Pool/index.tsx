import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Currency, Token } from '@pancakeswap/sdk'
import {
  Text,
  Flex,
  CardBody,
  Button,
  SubMenuItems,
  Heading,
  Table,
  Th,
  Td,
  Tab,
  TabMenu,
  Input,
  useMatchBreakpoints,
  Card,
  SearchIcon, MinusIcon, AddIcon, IconButton, useModal,
} from '@pancakeswap/uikit'
import { Link } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { usePairs } from '../../hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import Dots from '../../components/Loader/Dots'
import Page from '../Page'
import config from '../../components/Menu/config/config'
import { useCurrency } from '../../hooks/Tokens'
import { CurrencyLogo } from '../../components/Logo'
import useDebounce from '../../hooks/useDebounce'
import { isAddress } from '../../utils'
// eslint-disable-next-line import/named
import { AddLiquidityCard } from '../AddLiquidity/AddLiquidityCard'
import { PoolUpdater, TokenUpdater } from '../../state/info/updaters'
import { useAllPoolData } from '../../state/info/hooks'
import { PoolData } from '../../state/info/types'

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
  background: transparent;
  border: 1px solid #59f3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  flex-direction: column;
  
  ${({theme}) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const PoolContainer = styled(`div`)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  
  ${({theme}) => theme.mediaQueries.sm} {
    width: auto;
    justify-content: center;
    align-items: center;
  }
`

const CreateButtonContainer = styled(Flex)`
  width: 100%;
  margin-top: 12px;
  ${({theme}) => theme.mediaQueries.sm} {
    margin-top: 0;
    width: auto;
  }
`

const TabContainer = styled(`div`)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const InputWrapper = styled(`div`)`
  width: 100%;
  max-width: 400px;
  position: relative;

  & > svg {
    position: absolute;
    right: 12px;
    top: 14px;
  }
`

const StyledTable = styled(Table)<{ isMobile: boolean }>`
  margin-bottom: ${({ isMobile }) => (isMobile ? '56px' : 0)};
  //margin-top: 12px;
  border-collapse: separate;
  border-spacing: 0 0.5rem;
`

const StyledDetailsWrapper = styled.div`
  display: grid;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;

  grid-template-columns: 1fr 1fr 1fr;

  ${({ theme }) => theme.mediaQueries.xs} {
    grid-template-columns: 1fr 1fr 1fr;
  }
`

const StyledTabContainer = styled(TabContainer)`
  display: flex;
  flex-direction: column-reverse;

  & > div {
    margin-top: 16px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;

    & > div {
      margin-top: 0;
    }
  }
`

const TableWrapperCard = styled(Card)`
  margin-top: 12px;
  padding-left: 8px;
  padding-right: 8px;
  background-color: transparent;
  // background: ${({theme}) => theme.colors.backgroundAlt3};
  margin-bottom: 32px;
  
  @media screen and (max-width: 576px) {
    background: transparent;
    padding-left: 0;
    padding-right: 0;
  }
`

const StyledTab = styled(Tab)`
  padding: 8px 16px;
`

const StyledSearchInput = styled(Input)`
  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle2};
    font-size: 14px;
  }
`

const PoolNameText = styled(Text)`
`

const StyledDetailsContainer = styled(Flex)`
  border-radius: 10px;
  padding: 12px;
  background-color: ${({theme}) => theme.colors.backgroundAlt};
  justify-content: space-between;
  min-width: 400px;
  ${({theme}) => theme.mediaQueries.md} {
    min-width: 500px;
  }
`

const SingleDetailWrapper = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  align-items: start;
  padding: 0px 24px;
`

const SinglePoolButton = styled(Button)`
  justify-content: flex-start;
  width: 100%;
`

const StyledTr = styled.tr`
  //border: 1px solid ${({theme}) => theme.colors.cardBorder2};
  border-radius: 10px;
  & > td {
    //background-color: ${({ theme }) => theme.colors.backgroundAlt2};
    //height: 100px;
    &:last-child {
      border-bottom-right-radius: 10px;
      border-top-right-radius: 10px;
      // border-top: 1px solid ${({theme}) => theme.colors.cardBorder2};
      //border-right: 1px solid ${({theme}) => theme.colors.cardBorder2};
      // border-bottom: 1px solid ${({theme}) => theme.colors.cardBorder2} !important;
    }

    &:first-child {
      border-bottom-left-radius: 10px;
      border-top-left-radius: 10px;
      // border-top: 1px solid ${({theme}) => theme.colors.cardBorder2};
      //border-left: 1px solid ${({theme}) => theme.colors.cardBorder2};
      // border-bottom: 1px solid ${({theme}) => theme.colors.cardBorder2};
    }
  }
  &:hover {
    & > td {
      background-color: ${({ theme }) => theme.colors.backgroundAlt2};
      ${StyledDetailsContainer} {
        background: rgba(3, 3, 3, 0.2);
      }
    }
  }
`

const StyledTd = styled(Td)`
  padding: 0.75rem;
`

const StyledMobileCard = styled(Card)`
  background: ${({theme}) => theme.colors.background};
`

const TokenList = ({
  tokens,
  matic,
  volume,
  fees,
  liquidity,
  apr,
}: {
  tokens: [Token, Token]
  matic: Currency
  volume: number
  fees: number
  liquidity: number
  apr: number
}) => {
  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()

  const [token1, token2] = tokens
  let currency1: Token | Currency = token1
  let currency2: Token | Currency = token2

  const [selectedPool, setSelectedPool] = useState({
    currencyIdA: null,
    currencyIdB: null,
  })

  let address1 = token1.address
  let address2 = token2.address

  if (currency1.symbol.toLowerCase() === 'wmatic') {
    address1 = 'MATIC'
    currency1 = matic
  }
  if (currency2.symbol.toLowerCase() === 'wmatic') {
    address2 = address1
    currency2 = currency1
    address1 = 'MATIC'
    currency1 = matic
    // address2 = 'MATIC'
    // currency2 = matic
  }

  const [handleAddButton] = useModal(
    <AddLiquidityCard
      currencyIdA={selectedPool?.currencyIdA}
      currencyIdB={selectedPool?.currencyIdB}
    />
  )

  const handleAddClick = (currencyIdA, currencyIdB) => {
    setSelectedPool({
      currencyIdA,
      currencyIdB
    })
    handleAddButton()
  }

  if (isMobile) {
    return (
      <tr>
        <a href={`/add/${address1}/${address2}`}>
          <StyledMobileCard mt="8px">
            <CardBody>
              <Flex mb="12px" alignItems="center">
                <div>
                  <CurrencyLogo currency={currency1} />
                  <CurrencyLogo currency={currency2} />
                </div>
                <Text ml="10px" fontSize="20px" bold>
                  {currency1?.symbol?.toUpperCase()} - {currency2?.symbol?.toUpperCase()}
                </Text>
              </Flex>
              <StyledDetailsWrapper>
                {[
                  { title: 'volume', value: `$${volume}` },
                  { title: 'liquidity', value: `$${liquidity}` },
                  { title: 'fees', value: `$${fees}` },
                  // { title: "apr", value: `${apr}%` }
                ].map((singleValue) => {
                  return (
                    <Flex alignItems="start" flexDirection="column">
                      <Text color="textSubtle2" textTransform="capitalize" fontSize="12px">
                        {singleValue.title}:
                      </Text>
                      <Text color="text" textTransform="capitalize" fontSize="16px">
                        {singleValue.value}
                      </Text>
                    </Flex>
                  )
                })}
              </StyledDetailsWrapper>
            </CardBody>
          </StyledMobileCard>
        </a>
      </tr>
    )
  }

  return (
    <StyledTr>
      <StyledTd>
        <Button
          id={`pool-${address1}-${address2}`}
          as={Link}
          scale="xxs"
          variant="text"
          to={`/add/${address1}/${address2}`}
          pl="0"
        >
          <div>
            <CurrencyLogo currency={currency1} />
            <CurrencyLogo currency={currency2} />
          </div>
          <Text ml="10px" fontSize="14px" fontWeight="bold">
            {currency1?.symbol?.toUpperCase()}-{currency2?.symbol?.toUpperCase()}
          </Text>
        </Button>
      </StyledTd>
      <StyledTd>
        <Text fontSize="14px">${liquidity}</Text>
      </StyledTd>
      <StyledTd>
        <Text fontSize="14px">${volume}</Text>
      </StyledTd>
      <StyledTd>
        <Text fontSize="14px">${fees}</Text>
      </StyledTd>
      <StyledTd>
        <Text fontSize="14px">
          {apr}%
        </Text>
      </StyledTd>
      <StyledTd>
        <Flex justifyContent="flex-end" alignItems="center">
          <IconButton
            scale="sm"
            variant="secondary"
            // onClick={() => handleAddClick(address1, address2)}
          >
            <AddIcon color="currentColor" />
          </IconButton>
          <IconButton scale="sm" variant="secondary" marginLeft="8px">
            <MinusIcon color="currentColor" />
          </IconButton>
        </Flex>
      </StyledTd>
    </StyledTr>
  )
}

export default function Pool() {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('none')
  const [reverseOrder, setReversOrder] = useState<boolean>(false)
  const [tab, setTab] = useState<'all' | 'my'>('all')

  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
  }, [])

  const debouncedQuery = useDebounce(searchQuery, 200)

  const allPoolData = useAllPoolData()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () =>
      trackedTokenPairs.map((tokens, index) => {
        const lpToken = toV2LiquidityToken(tokens);
        const pool = allPoolData[lpToken.address]?.data
        return {
          liquidityToken: lpToken,
          tokens,
          volume: pool?.volumeUSD || 0,
          fees: pool?.totalFees24h || 0,
          liquidity: pool?.liquidityUSD || 0,
          apr: pool?.lpApr7d || 0,
        };
      }),
    [trackedTokenPairs, allPoolData],
  )

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
    return tokenPairsWithLiquidityTokens.filter((pairss) => {
      const [pair1, pair2] = pairss.tokens
      return (
        ((pair1 && matchesSearch(pair1.symbol)) || (pair2 && matchesSearch(pair2.symbol))) &&
        (tab === 'my' ? v2PairsBalances[pairss.liquidityToken.address]?.greaterThan('0') : true)
      )
    })
  }, [tokenPairsWithLiquidityTokens, debouncedQuery, v2PairsBalances, tab])

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  // const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))
  const matic = useCurrency('matic')
  const renderTable = () => {
    if (tab === 'my') {
      if (!account) {
        return (
          <tr>
            <Td colSpan={4}>
              <Text color="textSubtle" textAlign="center">
                {t('Connect to a wallet to view your liquidity.')}
              </Text>
            </Td>
          </tr>
        )
      }
      if (v2IsLoading) {
        return (
          <tr>
            <Td colSpan={4}>
              <Text color="textSubtle" textAlign="center">
                <Dots>{t('Loading')}</Dots>
              </Text>
            </Td>
          </tr>
        )
      }
    }
    if (filteredPairs?.length > 0) {
      let sortedOrder = [...filteredPairs]

      if (sortBy !== 'none') {
        sortedOrder.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : b[sortBy] > a[sortBy] ? -1 : 0))
      }

      sortedOrder = reverseOrder ? [...sortedOrder].reverse() : sortedOrder

      return sortedOrder.map((arr) => <TokenList tokens={arr.tokens} matic={matic} {...arr} />)
    }
    return (
      <tr>
        <Td colSpan={4}>
          <Text color="textSubtle" textAlign="center">
            {t('No liquidity found.')}
          </Text>
        </Td>
      </tr>
    )
  }

  const handleHeaderClick = (key: string) => {
    if (key !== sortBy) {
      setSortBy(key)
      setReversOrder(false)
    } else if (key === sortBy && !reverseOrder) {
      setReversOrder(true)
    } else {
      setSortBy('none')
      setReversOrder(false)
    }
  }

  const getHeaders = () => {
    if (isMobile) {
      return []
    }

    return [
      {
        id: 'name',
        title: 'name',
      },
      {
        id: 'liquidity',
        title: 'liquidity',
      },
      {
        id: 'volume',
        title: 'volume',
      },
      {
        id: 'fees',
        title: 'fees',
      },
      {
        id: 'apr',
        title: 'APR',
      },
      {
        id: 'my',
        title: 'My Liquidity',
      },
    ]
  }

  return (
    <Page>
      <PoolUpdater />
      <TokenUpdater />
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
          <CreateButtonContainer>
            <Button id="join-pool-button" variant="subtle" as={Link} to="/add" width="100%">
              {t('Create Pool')}
            </Button>
          </CreateButtonContainer>
        </Header>
        {/* <AppHeader title={t('Your Liquidity')} subtitle={t('Remove liquidity to receive tokens back')} /> */}
        <Body>
          {/* {renderBody()} */}
          <StyledTabContainer>
            <TabMenu
              activeIndex={tab === 'all' ? 0 : 1}
              onItemClick={(index) => {
                if (index === 0) {
                  setTab('all')
                } else {
                  setTab('my')
                }
              }}
              switchVariant
            >
              <StyledTab color={tab === 'all' ? 'primary' : ''} onClick={() => setTab('all')}>
                All
              </StyledTab>
              <StyledTab color={tab === 'my' ? 'primary' : ''} onClick={() => setTab('my')}>
                My Pools
              </StyledTab>
            </TabMenu>
            <InputWrapper>
              <StyledSearchInput
                id="token-search-input"
                placeholder={t('Search name or paste address')}
                scale="lg"
                autoComplete="off"
                value={searchQuery}
                onChange={handleInput}
              />
              <SearchIcon />
            </InputWrapper>
          </StyledTabContainer>
          <TableWrapperCard>
            <StyledTable isMobile={isMobile}>
              <thead>
              {getHeaders().map((singleHeader, index) => {
                return (
                  <Th
                    className="cursor-pointer"
                    textAlign={index === getHeaders().length - 1 ? 'right' : 'left'}
                    onClick={() => handleHeaderClick(singleHeader.id)}
                  >
                    {singleHeader.title}
                  </Th>
                )
              })}
              </thead>
              <tbody>{renderTable()}</tbody>
            </StyledTable>
          </TableWrapperCard>
        </Body>
      </AppBody>
    </Page>
  )
}
