import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  Text,
  Flex,
  useMatchBreakpoints
} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useLocation } from 'react-router'
import { useTokenBalance, useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import Page from '../Page'
import { useCurrency } from '../../hooks/Tokens'
import useDebounce from '../../hooks/useDebounce'
import { PoolUpdater, TokenUpdater } from '../../state/info/updaters'
import { useAllPoolData } from '../../state/info/hooks'
import { useWidth } from '../../hooks/useWidth'
import useTheme from '../../hooks/useTheme'
import ActiveTankCard from './components/ActiveTankCard'
import InactiveTankCard from './components/InactiveTankCard'

const AppBody = styled(`div`)`
  max-width: 1185px;
  width: 100%;
  z-index: 1;
  margin-bottom: 100px;

  @media screen and (max-width: 763px) {
    margin-bottom: 50px;
  }
`

const Body = styled(`div`)`
  border-radius: 10px;
  margin-top: 10px;

  @media screen and (max-width: 576px) {
    margin-top: 30px;
  }
`

const Header = styled(`div`)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  padding-bottom: 16px;
  flex-direction: column;
  margin-top: 20px;

  @media screen and (max-width: 576px) {
    margin-top: 20px;
  }
  
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }  
`

const StyledTab = styled(Flex) <{ isActive?: boolean }>`
  font-size: 18px;
  color: ${({ theme, isActive }) => isActive ? theme.colors.text : theme.colors.textSubtle2};
  font-weight: 500;
  border-radius: 0;
  cursor: pointer;
`

const TanksContainer = styled.div`
display: grid;

grid-template-columns: 1fr 1fr 1fr;
grid-column-gap: 35px;
grid-row-gap: 30px;

@media screen and (max-width: 963px) {
  grid-template-columns: 1fr 1fr;
}

@media screen and (max-width: 660px) {
  grid-template-columns: 1fr;
}
`

const Tanks: React.FC = () => {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const { isMobile, isTablet, isDesktop } = useMatchBreakpoints()
  const width = useWidth()
  const { theme } = useTheme()
  const location = useLocation()
  const [tab, setTab] = useState<string>('active')

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [reverseOrder, setReversOrder] = useState<boolean>(false)

  // control panel - dropdowns
  const [sortByOption, setSortByOption] = useState('all')

  const debouncedQuery = useDebounce(searchQuery, 200)

  const allPoolData = useAllPoolData()

  // Get currency Id from the url if present
  const searchParams = new URLSearchParams(location.search)

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
        ((pair1 && matchesSearch(pair1.symbol)) || (pair2 && matchesSearch(pair2.symbol)))
      )
    })
  }, [tokenPairsWithLiquidityTokens, debouncedQuery])

  const matic = useCurrency('matic')

  // render active tanks
  const renderActiveTanks = () => {
    if (filteredPairs?.length > 0) {
      let sortedOrder = [...filteredPairs]

      if (sortByOption !== 'none') {
        sortedOrder.sort((a, b) => (a[sortByOption] > b[sortByOption] ? 1 : b[sortByOption] > a[sortByOption] ? -1 : 0))
      }

      sortedOrder = reverseOrder ? [...sortedOrder].reverse() : sortedOrder

      return sortedOrder.map((arr) => {
        const userLiquidity = v2PairsBalances[arr.liquidityToken.address]?.toFixed(3)

        return (
          <ActiveTankCard
            tokens={arr.tokens[0]}
            matic={matic}
            {...arr}
            isCardActive
          />
        )
      })
    }

    return (
      <Text color="textSubtle" textAlign="center">
        {t('No Active Tank found.')}
      </Text>
    )
  }

  // render inactive tanks
  const renderInactiveTanks = () => {
    if (filteredPairs?.length > 0) {
      let sortedOrder = [...filteredPairs]

      if (sortByOption !== 'none') {
        sortedOrder.sort((a, b) => (a[sortByOption] > b[sortByOption] ? 1 : b[sortByOption] > a[sortByOption] ? -1 : 0))
      }

      sortedOrder = reverseOrder ? [...sortedOrder].reverse() : sortedOrder

      return sortedOrder.map((arr) => {
        const userLiquidity = v2PairsBalances[arr.liquidityToken.address]?.toFixed(3)

        return (
          <InactiveTankCard
            tokens={arr.tokens[0]}
            matic={matic}
            {...arr}
          />
        )
      })
    }

    return (
      <Text color="textSubtle" textAlign="center">
        {t('No Tank found.')}
      </Text>
    )
  }

  const renderTab = (): JSX.Element => {
    return (
      <Flex alignItems="center">
        <StyledTab isActive={tab === 'active'} onClick={() => setTab('active')}>
          Active
        </StyledTab>
        <Text margin="5px"> | </Text>
        <StyledTab isActive={tab === 'inactive'} onClick={() => setTab('inactive')}>
          Inactive
        </StyledTab>
      </Flex>
    )
  }

  return (
    <Page>
      <PoolUpdater />
      <TokenUpdater />
      <AppBody>
        <Header>
          {renderTab()}
        </Header>
        <Body>
          <TanksContainer>
            {tab === 'inactive' && renderInactiveTanks()}
            {tab === 'active' && renderActiveTanks()}
          </TanksContainer>
        </Body>
      </AppBody>
    </Page>
  )
}

export default Tanks;