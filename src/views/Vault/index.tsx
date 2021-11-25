import React, {useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  Text,
  Flex,
  Button,
  CustomCheckbox,
  useMatchBreakpoints,
  Card  
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
import Select, { OptionProps } from '../../components/Select/Select'
import { useWidth } from '../../hooks/useWidth'
import useTheme from '../../hooks/useTheme'
import VaultCard from './components/VaultCard'

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
  padding-left: 6px;
  padding-top: 16px;
  border-radius: 10px;
  padding-bottom: 16px;
  flex-direction: column;
  margin-top: 50px;

  @media screen and (max-width: 576px) {
    margin-top: 0px;
  }
  
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }  
`

const LockedValueContainer = styled(`div`)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;
  
  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    justify-content: center;
    align-items: center;
  }

  @media screen and (max-width: 576px) {
    flex-direction: row;
    margin-top: 20px;
    margin-bottom: 10px;
  }
`

const NoteCard = styled(Card)`
  padding: 16px;
  max-width: 331px;
  justify-content: space-between;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};


  @media screen and (max-width: 670px) {
    max-width: 280px;
  }

  @media screen and (max-width: 610px) {
    max-width: 250px;
  }

  @media screen and (max-width: 576px) {
    text-align: center;
    max-width: 331px;
  }
`

const LockedValueCard = styled(Flex)`
  width: 100%;
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 20px 0px 20px 0px
  
  margin-top: ${props => (props.id === "eco_loc" ? `0` : `18px`)};
  margin-bottom: ${props => (props.id === "user_loc" ? `0` : `18px`)};

  @media screen and (max-width: 576px) {
    background: transparent;
    padding-left: 0;
    padding-right: 0;
    align-items: left;
    margin-top: 5px;
    margin-bottom: 5px;
    text-align: ${props => (props.id === "eco_loc" ? `left` : `right`)}
  }
`

const TotalVaultCard= styled(Flex)`
  width: 100%;
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 20px 0px 20px 0px
  
  margin-top: 18px
  margin-bottom: 0px;

  @media screen and (max-width: 576px) {
    background: transparent;
    padding-left: 0;
    padding-right: 0;
    align-items: left;
    margin-top: 5px;
    margin-bottom: 5px;
    flex-direction: column-reverse;
    text-align: right;
  }
`

const ControlPanelWrapper = styled(Flex)`
  padding: 5px 25px 20px 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`

const ControlPanel = styled(Flex)`
  display: grid;
  grid-template-columns: 22% 22% 22% 22%;
  grid-column-gap: 4%;
  grid-row-gap: 40px;
  justify-content: space-between;

  @media screen and (max-width: 950px) {
    grid-template-columns: 48% 48%;
  }

  @media screen and (max-width: 763px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;    
  }
`

const StyledControlFlex = styled(Flex)`
  height: 100px;
  width: 100%;
  @media screen and (max-width: 763px) {
    margin-bottom: 20px;  
  }
`

const StyledCheckbox = styled(CustomCheckbox)`
  margin-left: 0px;
  margin-right: 8px;
`

const StyledP = styled.p`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.headerSubtleText};
  line-height: 1.2
`

const DecoPText = styled.a`
  font-size: 18px;
  font-weight: 500;
  display: inline-block;
  color: ${({ theme }) => theme.colors.headerSubtleText};
  border-bottom: 2px solid #979797;
`

const DecoText = styled(Text)`
  text-decoration: underline;  
  text-underline-offset: 3px;
`

const VaultsContainer = styled(Flex)`
  flex-direction: column;
`

const StyledSelect = styled(Select)`
  border-bottom: 1px solid #ffffff
  & > div:first-child {
    background-color: ${({ theme }) => theme.colors.headerInputBg};
    box-shadow: none;
  }
  margin-bottom: 5px;
`

export default function Vault() {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const { isMobile, isTablet, isDesktop } = useMatchBreakpoints()
  const width = useWidth()
  const { theme } = useTheme()
  const location = useLocation()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [reverseOrder, setReversOrder] = useState<boolean>(false)

  // control panel - checkboxes
  const [hideZeroValue, setHideZeroValue] = useState(false)
  const [deposited, setDepositied] = useState(false)
  const [retired, setRetired] = useState(false)
  const [boost, setBoost] = useState(true)

  // control panel - dropdowns
  const [sortByOption, setSortByOption] = useState('all')
  const [vaultTypesOption, setVaultTypesOption] = useState('all')
  const [platformOption, setPlatformOption] = useState('all')

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

      switch (vaultTypesOption) {
        case 'single_asset': return (
          ((pair1 && matchesSearch(pair1.symbol)) || (pair2 && matchesSearch(pair2.symbol))) &&
          (v2PairsBalances[pairss.liquidityToken.address]?.greaterThan('0'))
        )
        case 'stable_asset': return (
          ((pair1 && matchesSearch(pair1.symbol)) || (pair2 && matchesSearch(pair2.symbol))) &&
          (v2PairsBalances[pairss.liquidityToken.address]?.greaterThan('0'))
        )
        case 'lp_tokens': return (
          ((pair1 && matchesSearch(pair1.symbol)) || (pair2 && matchesSearch(pair2.symbol))) &&
          (v2PairsBalances[pairss.liquidityToken.address]?.greaterThan('0'))
        )
        case 'stable_lps': return (
          ((pair1 && matchesSearch(pair1.symbol)) || (pair2 && matchesSearch(pair2.symbol))) &&
          (pair1.symbol.toLowerCase() === 'eco' || pair2.symbol.toLowerCase() === 'eco')
        )
        default: return (
          ((pair1 && matchesSearch(pair1.symbol)) || (pair2 && matchesSearch(pair2.symbol)))
        )
      }
    })
  }, [tokenPairsWithLiquidityTokens, debouncedQuery, v2PairsBalances, vaultTypesOption])

  const matic = useCurrency('matic')

  const renderVaults = () => {
    if (filteredPairs?.length > 0) {
      let sortedOrder = [...filteredPairs]

      if (sortByOption !== 'none') {
        sortedOrder.sort((a, b) => (a[sortByOption] > b[sortByOption] ? 1 : b[sortByOption] > a[sortByOption] ? -1 : 0))
      }

      sortedOrder = reverseOrder ? [...sortedOrder].reverse() : sortedOrder

      return sortedOrder.map((arr) => {
        const userLiquidity = v2PairsBalances[arr.liquidityToken.address]?.toFixed(3)

        return (
          <VaultCard
            tokens={arr.tokens}
            matic={matic}
            userLiquidity={userLiquidity}
            {...arr}
          />
        )
      })
    }

    return (
      <Text color="textSubtle" textAlign="center">
        {t('No liquidity found.')}
      </Text>
    )
  }

  const getPlatformTypes = () => {
    return [
      {
        value: 'all',
        label: 'All',
      }
    ]
  }
  
  const getSortBy = () => {
    return [
      {
        value: 'all',
        label: 'All',
      },
      {
        value: 'apy',
        label: 'APY',
      },
      {
        value: 'tvl',
        label: 'TVL',
      },
      {
        value: 'newest',
        label: 'Newest',
      },
      {
        value: 'deposited',
        label: 'Deposited',
      },
      {
        value: 'name',
        label: 'Name',
      }
    ]
  }

  const getVaultTypes = () => {
    return [
      {
        value: 'all',
        label: 'All',
      },
      {
        value: 'single_asset',
        label: 'Single Asset',
      },
      {
        value: 'stable_asset',
        label: 'Stable Asset',
      },
      {
        value: 'lp_tokens',
        label: 'LP Tokens',
      },
      {
        value: 'stable_lps',
        label: 'Stable LPs',
      },
    ]
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortByOption(option.value)
  }

  return (
    <Page>
      <PoolUpdater />
      <TokenUpdater />
      <AppBody>
        <Header>
          <LockedValueContainer>
            <LockedValueCard id="eco_loc">
              <Text color={theme.colors.headerSubtleText} fontWeight="500" fontSize="14px">{t('Performance Fee')}</Text>
              <Text color={theme.colors.primary} fontSize="22px" fontWeight="700" glow>1%</Text>
            </LockedValueCard>
            <TotalVaultCard>
              <Text color={theme.colors.primary} fontSize="22px" fontWeight="700" glow>20</Text>
              <Text color={theme.colors.headerSubtleText} fontSize="14px" fontWeight="500">{width<=576 ? t('Vaults') : t('# of Vaults')}</Text>
            </TotalVaultCard>
          </LockedValueContainer>
          <NoteCard>
            <Text fontWeight="500" fontSize="28px" mb="10px">{t('Note')}</Text>
            <StyledP>No deposit of withdrawl fees on any vault. Performace fee only on <DecoPText>non-native</DecoPText> vaults</StyledP>            
          </NoteCard>
          <LockedValueContainer>
            <LockedValueCard id="eco_loc">
              <Text color={theme.colors.headerSubtleText} fontWeight="500" fontSize="14px">{width<=280 ? t('TVL') : t('Total Value Locked')}</Text>
              <Text color={theme.colors.primary} fontSize="22px" fontWeight="700" glow>31,787,112</Text>
            </LockedValueCard>
            <LockedValueCard id="user_loc">
              <Text color={theme.colors.headerSubtleText} fontWeight="500" fontSize="14px">{t('Deposit')}</Text>
              <Text color={theme.colors.primary} fontSize="22px" fontWeight="700" glow>31,787,112</Text>
            </LockedValueCard>
          </LockedValueContainer>
        </Header>
        <Body>
          <ControlPanelWrapper>
            <Flex justifyContent="flex-end">
              <Button onClick={() => console.log("clear all")} scale="sm" variant="text" padding="0px">
                <DecoText textAlign="center" fontSize="14px" fontWeight="500" color={theme.colors.primary}>{t('Clear all')}</DecoText>
              </Button>
            </Flex>
            <ControlPanel>
              <StyledControlFlex flexDirection="column" width="100%">
                <Flex mb="10px" alignItems="center">
                  <StyledCheckbox
                    name="confirmed"
                    type="checkbox"
                    checked={hideZeroValue}
                    onChange={() => setHideZeroValue(!hideZeroValue)}
                    scale="xs"
                  />
                  <Text fontSize="14px" fontWeight="500">{t('Hide Zero Balances')}</Text>
                </Flex>
                <Text mt="10px" fontSize="14px" fontWeight="500" color={theme.colors.textSubtle2}>{t('Platfom')}</Text>
                <StyledSelect
                  options={getPlatformTypes()}
                  onOptionChange={() => console.log("AAA")}
                  bottomBorder
                  zindex="50"
                />
              </StyledControlFlex>
              <StyledControlFlex flexDirection="column" width="100%">
                <Flex mb="10px" alignItems="center">
                  <StyledCheckbox
                    name="confirmed"
                    type="checkbox"
                    checked={deposited}
                    onChange={() => setDepositied(!deposited)}
                    scale="xs"
                  />
                  <Text fontSize="14px" fontWeight="500">{t('Deposited Vaults')}</Text>
                </Flex>
                <Text mt="10px" fontSize="14px" fontWeight="500" color={theme.colors.textSubtle2}>{t('Vault Type')}</Text>
                <StyledSelect
                  options={getVaultTypes()}
                  onOptionChange={() => console.log("AAA")}
                  bottomBorder
                  zindex="40"
                />
              </StyledControlFlex>
              <StyledControlFlex flexDirection="column" width="100%">
                <Flex mb="10px" alignItems="center">
                  <StyledCheckbox
                    name="confirmed"
                    type="checkbox"
                    checked={retired}
                    onChange={() => setRetired(!retired)}
                    scale="xs"
                  />
                  <Text fontSize="14px" fontWeight="500">{t('Retired Vaults')}</Text>
                </Flex>
                <Text mt="10px" fontSize="14px" fontWeight="500" color={theme.colors.textSubtle2}>{t('Asset')}</Text>
                <StyledSelect
                  options={getPlatformTypes()}
                  onOptionChange={() => console.log("AAA")}
                  bottomBorder
                  zindex="30"
                />
              </StyledControlFlex>
              <StyledControlFlex flexDirection="column" width="100%">
                <Flex mb="10px" alignItems="center">
                  <StyledCheckbox
                    name="confirmed"
                    type="checkbox"
                    checked={boost}
                    onChange={() => setBoost(!boost)}
                    scale="xs"
                  />
                  <Text fontSize="14px" fontWeight="500">{t('Boost')}</Text>
                </Flex>
                <Text mt="10px" fontSize="14px" fontWeight="500" color={theme.colors.textSubtle2}>{t('Sort by')}</Text>
                <Flex>
                <StyledSelect
                  options={getSortBy()}
                  onOptionChange={handleSortOptionChange}
                  bottomBorder
                  zindex="20"
                />
                </Flex>
              </StyledControlFlex>
            </ControlPanel>
          </ControlPanelWrapper>
          <VaultsContainer>
            {renderVaults()}
          </VaultsContainer>
        </Body>
      </AppBody>
    </Page>
  )
}
