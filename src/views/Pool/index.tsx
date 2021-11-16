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
import Select, { OptionProps } from '../../components/Select/Select'
import { useWidth } from '../../hooks/useWidth'
import useTheme from '../../hooks/useTheme'

const AppBody = styled(`div`)`
  max-width: 1024px;
  width: 100%;
  z-index: 1;
`

const Body = styled(`div`)`
  border-radius: 10px;
  margin-top: 55px;

  @media screen and (max-width: 576px) {
    margin-top: 30px;
  }
`

const Header = styled(`div`)`
  background-color: ${({theme}) => theme.colors.backgroundAlt};
  border: 1px solid #131823;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 6px;
  padding-top: 16px;
  border-radius: 10px;
  padding-bottom: 16px;
  flex-direction: column;
  
  ${({theme}) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const PoolContainer = styled(`div`)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;
  
  ${({theme}) => theme.mediaQueries.sm} {
    width: auto;
    justify-content: center;
    align-items: center;
  }
`

const LockedValueContainer = styled(`div`)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;
  
  ${({theme}) => theme.mediaQueries.sm} {
    width: auto;
    justify-content: center;
    align-items: center;
  }

  @media screen and (max-width: 576px) {
    margin-top: 20px;
    margin-bottom: 10px;
  }
`

const LockedValueCard = styled(Flex)`
  width: 100%;
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 10px;
  
  ${Text}:first-child {
    color: ${({theme}) => theme.colors.headerSubtleText}
  }

  margin-top: ${props => (props.id === "eco_loc" ? `0` : `18px`)};
  margin-bottom: ${props => (props.id === "user_loc" ? `0` : `18px`)};

  @media screen and (max-width: 576px) {
    background: transparent;
    padding-left: 0;
    padding-right: 0;
    align-items: center;
    margin-top: 5px;
    margin-bottom: 5px;
  }
`

const TotalPoolContainer = styled(`div`)`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding-right: 50px;
  
  ${({theme}) => theme.mediaQueries.sm} {
    width: auto;
  }
  
  ${Text}:last-child {
    color: ${({theme}) => theme.colors.headerSubtleText}
  }

  @media screen and (max-width: 576px) {
    padding-right: 0;
    align-items: center;
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
  grid-row-gap: 20px;

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
    padding-left: 0;
    
    button:first-child {
      padding-left: 0;
    }
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
  // padding-left: 8px;
  // padding-right: 8px;
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
  background: ${({ theme }) => theme.colors.backgroundAlt};
  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle2};
    font-size: 14px;
  }
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
  border-radius: 10px;

  &:hover {
    & > td {
      background-color: ${({ theme }) => theme.colors.backgroundAlt2};
      ${StyledDetailsContainer} {
        background: rgba(3, 3, 3, 0.2);
      }

      &:last-child {
        border-bottom-right-radius: 10px;
        border-top-right-radius: 10px;
      }

      &:first-child {
        border-bottom-left-radius: 10px;
        border-top-left-radius: 10px;
      }
    }
  }
`

const StyledTd = styled(Td)`
  padding-top: 10px;
  padding-right: 16px;
  padding-bottom: 10px;
  padding-left: 16px;
  border-bottom: 1px solid #1c1f2b;
`

const StyledMobileCard = styled(Card)`
  background: ${({theme}) => theme.colors.background};
`

const StyledSelect = styled(Select)`
  & > div:first-child {
    background-color: ${({theme}) => theme.colors.headerInputBg};
    box-shadow: none;
  }
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
  const { theme } = useTheme()

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
                  { title: "apr", value: `${apr}%` }
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
                <Flex alignItems="start" flexDirection="column">
                  <Text color="textSubtle2" textTransform="capitalize" fontSize="12px" mb="2px">
                    {t('my liquidity')}:
                  </Text>
                  <Flex justifyContent="flex-end" alignItems="center">
                    <Text fontSize="16px" mr="10px">${volume}</Text>
                    <IconButton
                      scale="sm"
                      variant="secondary"
                      size="16px"
                      borderColor="#28d250"
                      borderRadius="50%"
                      borderWidth="1px"
                      // onClick={() => handleAddClick(address1, address2)}
                    >
                      <AddIcon color="#28d250" />
                    </IconButton>
                    <IconButton 
                      scale="sm"
                      size="16px" 
                      variant="secondary"
                      borderColor="#fb8e8e"
                      borderRadius="50%"
                      borderWidth="1px" 
                      marginLeft="8px">
                      <MinusIcon color="#fb8e8e" />
                    </IconButton>
                  </Flex>
                </Flex>
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
          <Flex>
            <CurrencyLogo currency={currency1} />
            <Flex marginLeft="-8px">
              <CurrencyLogo currency={currency2} />
            </Flex>
          </Flex>
          <Text ml="10px" fontSize="12px">
            {currency1?.symbol?.toUpperCase()} / {currency2?.symbol?.toUpperCase()}
          </Text>
        </Button>
      </StyledTd>
      <StyledTd>
        <Text fontSize="12px">${liquidity}</Text>
      </StyledTd>
      <StyledTd>
        <Text fontSize="12px">${volume}</Text>
      </StyledTd>
      <StyledTd>
        <Text fontSize="12px">${fees}</Text>
      </StyledTd>
      <StyledTd>
        <Flex background={theme.colors.green} display="flex" justifyContent="center" borderRadius="5px" width="52px">
          <Text color="white" fontSize="12px" mt="4px" mb="4px" textAlign="center" fontWeight="600">
            {apr}%
          </Text>
        </Flex>
      </StyledTd>
      <StyledTd>
        <Flex justifyContent="flex-end" alignItems="center">
          <Text fontSize="12px" mr="10px">${volume}</Text>
          <IconButton
            scale="sm"
            variant="secondary"
            size="16px"
            borderColor="#28d250"
            borderRadius="50%"
            borderWidth="1px"
            // onClick={() => handleAddClick(address1, address2)}
          >
            <AddIcon color="#28d250" />
          </IconButton>
          <IconButton 
            scale="sm"
            size="16px" 
            variant="secondary"
            borderColor="#fb8e8e"
            borderRadius="50%"
            borderWidth="1px" 
            marginLeft="8px">
            <MinusIcon color="#fb8e8e" />
          </IconButton>
        </Flex>
      </StyledTd>
    </StyledTr>
  )
}

export default function Pool() {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const { isMobile, isTablet, isDesktop } = useMatchBreakpoints()
  const width = useWidth()
  const { theme } = useTheme()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('all')
  const [reverseOrder, setReversOrder] = useState<boolean>(false)
  const [tab, setTab] = useState<string>('all')

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

      switch (tab) {
        case 'my': return (
          ((pair1 && matchesSearch(pair1.symbol)) || (pair2 && matchesSearch(pair2.symbol))) &&
          (v2PairsBalances[pairss.liquidityToken.address]?.greaterThan('0'))
        )
        case 'eco': return (
          ((pair1 && matchesSearch(pair1.symbol)) || (pair2 && matchesSearch(pair2.symbol))) &&
          (pair1.symbol.toLowerCase() === 'eco' || pair2.symbol.toLowerCase() === 'eco')
        )
        default: return (
          ((pair1 && matchesSearch(pair1.symbol)) || (pair2 && matchesSearch(pair2.symbol)))
        )
      }

      // return (
      //   ((pair1 && matchesSearch(pair1.symbol)) || (pair2 && matchesSearch(pair2.symbol))) &&
      //   (tab === 'my' ? v2PairsBalances[pairss.liquidityToken.address]?.greaterThan('0') : true)
      // )
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
            <Td colSpan={6}>
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
            <Td colSpan={6}>
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
        <Td colSpan={6}>
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
        title: 'volume (24H)',
      },
      {
        id: 'fees',
        title: 'fees (24H)',
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

  const getPoolTypeTabs = () => {
    return [
      {
        value: 'all',
        label: 'All',
      },
      {
        value: 'top',
        label: 'Top',
      },
      {
        value: 'eco',
        label: 'Eco',
      },
      {
        value: 'block',
        label: 'Block',
      },
      {
        value: 'stable',
        label: 'Stable',
      },
      {
        value: 'my',
        label: 'My',
      },
    ]
  }

  const handleSortOptionChange = (option): void => {
    setTab(option.value)
  }

  return (
    <Page>
      <PoolUpdater />
      <TokenUpdater />
      {/* @ts-ignore */}
      <SubMenuItems items={config(t)[0].items} mt={`${56 + 1}px`} activeItem="/liquidity" />
      <AppBody>
        <Heading ml="1" mb="2">{t('Pools')}</Heading>
        <Header>
          <PoolContainer>
            <Button variant="primary" scale="sm" as={Link} to="/zap" width="93px" margin="10px">
              {t('Zap')}
            </Button>
            <Flex>
              <Button variant="light" scale="sm" as={Link} to="/add" width="93px" margin="10px">
                {t('Create')}
              </Button>
              <Button variant="light" scale="sm" as={Link} to="/find" width="93px" margin="10px">
                {t('Import')}
              </Button>
            </Flex>
            {/* <Button variant="primary" scale="sm" as={Link} to="/migrate" width="93px" height="35px" margin="10px">
              {t('Migrate')}
            </Button> */}
          </PoolContainer>
          <LockedValueContainer>
            <LockedValueCard id="eco_loc">
              <Text fontWeight="500" fontSize="14px">{t('Total Value Locked (ECOSWAP)')}</Text>
              <Text color={theme.colors.green} fontSize="22px" fontWeight="700">31,787,112</Text>
            </LockedValueCard>
            <LockedValueCard id="user_loc">
              <Text fontWeight="500" fontSize="14px">{t('Total Value Locked (User)')}</Text>
              <Text color={theme.colors.yellow} fontSize="22px" fontWeight="700">31,787,112</Text>
            </LockedValueCard>
          </LockedValueContainer>
          <TotalPoolContainer>
            <Text color={theme.colors.purple} fontSize="46px" fontWeight="700">{filteredPairs.length}</Text>
            <Text fontSize="14px" fontWeight="500">{t('# of Pools')}</Text>
          </TotalPoolContainer>
        </Header>
        {/* <AppHeader title={t('Your Liquidity')} subtitle={t('Remove liquidity to receive tokens back')} /> */}
        <Body>
          {/* {renderBody()} */}
          <StyledTabContainer>
            {width > 768 ? <TabMenu
              activeIndex={getPoolTypeTabs().map( (tt) => { return tt.value; }).indexOf(tab)}
              onItemClick={(index) => {
                setTab(getPoolTypeTabs()[index].value)
              }}
              normalVariant
            >
              {getPoolTypeTabs().map((singleTab, index) => {
                return (
                  <StyledTab color={tab === singleTab.value ? 'primary' : ''} onClick={() => setTab(singleTab.value)}>
                    {singleTab.label}
                  </StyledTab>
                )
              })}
            </TabMenu> : <Flex width="150px">
              <StyledSelect
                options={getPoolTypeTabs()}
                onOptionChange={handleSortOptionChange}
              />
            </Flex>}
            <InputWrapper>
              <StyledSearchInput
                id="token-search-input"
                placeholder={t('Search by Name')}
                scale="md"
                autoComplete="off"
                value={searchQuery}
                onChange={handleInput}
              />
              <SearchIcon width="20px" />
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
                    <Text fontSize="12px" color='grey'>{singleHeader.title}</Text>
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
