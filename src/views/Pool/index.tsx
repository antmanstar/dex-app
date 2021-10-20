import React, { useCallback, useMemo, useState } from 'react'
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
  Td,
  Tab,
  TabMenu,
  Input, useMatchBreakpoints, Card, SearchIcon,
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
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
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
  position: relative;
  
  & > svg {
    position: absolute;
    right: 12px;
    top: 14px;
  }
`

const StyledTable = styled(Table)<{isMobile: boolean}>`
  margin-bottom: ${({isMobile}) => isMobile ? "56px" : 0};
  margin-top: 12px;
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

const StyledTab = styled(Tab)`
  padding: 8px 16px;
`

const StyledSearchInput = styled(Input)`
  
  &::placeholder {
    color: ${({theme}) => theme.colors.textSubtle2};
    font-size: 14px;
  }
`

const StyledTr = styled.tr`
  &:hover {
    & > td {
      background-color: ${({theme}) => theme.colors.background};
      &:last-child {
        border-bottom-right-radius: 16px;
        border-top-right-radius: 16px;
      }

      &:first-child {
        border-bottom-left-radius: 16px;
        border-top-left-radius: 16px;
      }
    }
  }
`

const StyledTd = styled(Td)`
  padding: 0.75rem;
`


const TokenList = ({ tokens, matic, volume, fees, liquidity, apr }: { tokens: [Token, Token], matic: Currency, volume: number, fees: number, liquidity: number, apr: number }) => {

  const { isMobile } = useMatchBreakpoints()

  const [token1, token2] = tokens
  let currency1: Token | Currency = token1
  let currency2: Token | Currency = token2

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

  if (isMobile) {
    return (
      <tr>
        <a href={`/add/${address1}/${address2}`}>
          <Card mt="8px">
            <CardBody>
              <Flex mb="12px">
                <div>
                  <CurrencyLogo currency={currency1} />
                  <CurrencyLogo currency={currency2} />
                </div>
                <Text ml='10px'>{currency1?.symbol?.toUpperCase()} / {currency2?.symbol?.toUpperCase()}</Text>
              </Flex>
              <StyledDetailsWrapper>
                {[
                  { title: "volume", value: `$${volume}` },
                  { title: "liquidity", value: `$${liquidity}` },
                  { title: "fees", value: `$${fees}` },
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
          </Card>
        </a>
      </tr>
    )
  }

  return (
    <StyledTr>
      <StyledTd>
        <Button id={`pool-${address1}-${address2}`} as={Link} scale="xxs" variant='text' to={`/add/${address1}/${address2}`} pl="0">
          <div>
            <CurrencyLogo currency={currency1} />
            <CurrencyLogo currency={currency2} />
          </div>
          <Text ml='10px' fontSize="14px" fontWeight="bold">{currency1?.symbol?.toUpperCase()}-{currency2?.symbol?.toUpperCase()}</Text>
        </Button>
      </StyledTd>
      <StyledTd><Text fontSize="14px">${liquidity}</Text></StyledTd>
      <StyledTd><Text fontSize="14px">${volume}</Text></StyledTd>
      <StyledTd><Text fontSize="14px">${fees}</Text></StyledTd>
      <StyledTd><Text textAlign="right" fontSize="14px">{apr}%</Text></StyledTd>
    </StyledTr>
  )
}

export default function Pool() {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>("none")
  const [reverseOrder, setReversOrder] = useState<boolean>(false)
  const [tab, setTab] = useState<'all' | 'my'>('all')

  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
  }, [])

  const debouncedQuery = useDebounce(searchQuery, 200)

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens, index) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens, volume:  Math.floor(index * 1000) + 1, fees: Math.floor(index * 10) + 1, liquidity: Math.floor(index * 1000) + 1, apr: Math.floor(index * 10) + 1 }), ),
    [trackedTokenPairs],
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
      return ((pair1 && matchesSearch(pair1.symbol)) || (pair2 && matchesSearch(pair2.symbol))) && (tab === 'my' ? v2PairsBalances[pairss.liquidityToken.address]?.greaterThan('0') : true)
    })
  }, [tokenPairsWithLiquidityTokens, debouncedQuery, v2PairsBalances, tab])

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  // const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))
  const matic = useCurrency('matic')
  const renderTable = () => {
    if(tab === 'my') {
      if (!account) {
        return (
          <tr>
            <Td colSpan={4}>
              <Text color='textSubtle' textAlign='center'>
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
              <Text color='textSubtle' textAlign='center'>
                <Dots>{t('Loading')}</Dots>
              </Text>
            </Td>
          </tr>
        )
      }
    }
    if (filteredPairs?.length > 0) {

      let sortedOrder = [...filteredPairs]

      if(sortBy !== "none")  {
        sortedOrder.sort((a, b) => a[sortBy] > b[sortBy] ? 1 : b[sortBy] > a[sortBy] ? -1 : 0);
      }

      sortedOrder = reverseOrder ? [...sortedOrder].reverse() : sortedOrder

      return sortedOrder.map((arr) => <TokenList tokens={arr.tokens} matic={matic} {...arr}/>)
    }
    return (
      <tr>
        <Td colSpan={4}>
          <Text color='textSubtle' textAlign='center'>
            {t('No liquidity found.')}
          </Text>
        </Td>
      </tr>
    )
  }


  const handleHeaderClick = (key: string) => {
    if (key !== sortBy) {
      setSortBy(key);
      setReversOrder(false)
    } else if (key === sortBy && !reverseOrder) {
      setReversOrder(true)
    } else {
      setSortBy("none");
      setReversOrder(false)
    }
  };

  const getHeaders = () => {

    if (isMobile) {
      return []
    }

    return [
      {
        id: 'name',
        title: "name",
      },
      {
        id: 'liquidity',
        title: "liquidity",
      },
      {
        id: 'volume',
        title: "volume",
      },
      {
        id: 'fees',
        title: "fees",
      },
      {
        id: 'apr',
        title: "APR",
      },
    ]
  }

  return (
    <Page>
      {/* @ts-ignore */}
      <SubMenuItems items={config(t)[0].items} mt={`${56 + 1}px`} activeItem='/liquidity' />
      <AppBody>
        <Header>
          <PoolContainer>
            <Heading>Pool</Heading>
            <Button id='import-pool-link' variant='text' scale='sm' as={Link} to='/find'>
              {t('Import')}
            </Button>
          </PoolContainer>
          <Button id='join-pool-button' as={Link} to='/add'>
            {t('Create a Pool')}
          </Button>
        </Header>
        {/* <AppHeader title={t('Your Liquidity')} subtitle={t('Remove liquidity to receive tokens back')} /> */}
        <Body>
          {/* {renderBody()} */}
          <StyledTabContainer>
            <TabMenu
              activeIndex={tab === 'all' ? 0 : 1} onItemClick={(index) => {
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
                id='token-search-input'
                placeholder={t('Search name or paste address')}
                scale='lg'
                autoComplete='off'
                value={searchQuery}
                onChange={handleInput}
              />
              <SearchIcon />
            </InputWrapper>
          </StyledTabContainer>
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
            <tbody>
            {renderTable()}
            </tbody>
          </StyledTable>
        </Body>
      </AppBody>
    </Page>
  )
}
