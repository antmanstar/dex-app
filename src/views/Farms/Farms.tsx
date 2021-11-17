import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { Route, useRouteMatch, useLocation, NavLink, Link } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import {
  Image,
  Heading,
  RowType,
  Toggle,
  Text,
  Button,
  ArrowForwardIcon,
  Flex,
  Card,
  SearchIcon,
  SubMenuItems,
  Tab,
  TabMenu,
  Input,
  useMatchBreakpoints, useModal,
} from '@pancakeswap/uikit'
import { ChainId } from '@pancakeswap/sdk'
import styled from 'styled-components'
import FlexLayout from 'components/Layout/Flex'
import Page from 'views/Page'
// import Page from 'components/Layout/Page'
import { useFarms, usePollFarmsWithUserData, usePriceCakeBusd } from 'state/farms/hooks'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { DeserializedFarm } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { getFarmApr } from 'utils/apr'
import { orderBy } from 'lodash'
import isArchivedPid from 'utils/farmHelpers'
import { latinise } from 'utils/latinise'
import { useUserFarmStakedOnly, useUserFarmsViewMode } from 'state/user/hooks'
import { ViewMode } from 'state/user/actions'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import Loading from 'components/Loading'
import { useDispatch } from 'react-redux'
import FarmCard, { FarmWithStakedValue } from './components/FarmCard/FarmCard'
import Table from './components/FarmTable/FarmTable'
import FarmTabButtons from './components/FarmTabButtons'
import { RowProps } from './components/FarmTable/Row'
import ToggleView from './components/ToggleView/ToggleView'
import { DesktopColumnSchema } from './components/types'
import useTheme from '../../hooks/useTheme'
import config from '../../components/Menu/config/config'
import RowDataJSON from '../../config/constants/DummyFarmsData.json'
import { setActiveBodyType } from '../../state/farms'
import { useWidth } from '../../hooks/useWidth'

const StyledPage = styled(`div`)`
  max-width: 1024px;
  width: 100%;
  z-index: 1;
  padding-top: 57px;
`

const Header = styled(`div`)`
  margin-top: 8px;
  background-color: ${({theme}) => theme.colors.backgroundAlt};
  border: 1px solid ${({theme}) => theme.colors.backgroundAlt};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 27px;
  padding-top: 7px;
  border-radius: 10px;
  padding-bottom: 7px;
  flex-direction: column;
  
  ${({theme}) => theme.mediaQueries.sm} {
    flex-direction: row;
  } 
`

const InfoContainer = styled(`div`)`
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

const StyledLabelCard = styled(Flex)`
  width: 100%;
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 10px;
  
  ${Text}:first-child {
    color: ${({theme}) => theme.colors.headerSubtleText}
  }

  @media screen and (max-width: 576px) {
    background: transparent;
    padding-left: 0;
    padding-right: 0;
    align-items: center;
    margin-top: 5px;
    margin-bottom: 5px;
  }
`

const StyledButtonCard = styled(Flex)`
  width: 100%;
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 10px;
  
  ${Text}:first-child {
    color: ${({theme}) => theme.colors.headerSubtleText}
  }
  
  @media screen and (max-width: 576px) {
    background: transparent;
    padding-left: 0;
    padding-right: 0;
    align-items: center;
    margin-top: 5px;
    margin-bottom: 5px;
  }
`

const TotalFarmContainer = styled(`div`)`
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

const Body = styled(`div`)`
  border-radius: 10px;
  margin-top: 55px;

  @media screen and (max-width: 576px) {
    margin-top: 30px;
  }
`

const TabContainer = styled(`div`)`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const StyledSortTabContainer = styled(TabContainer)`
  display: flex;
  justify-content: center;

  & > div {
    margin-top: 16px;
    padding-left: 0;
    
    button:first-child {
      padding-left: 0;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 30px;
    justify-content: flex-start;
    & > div {
      margin-top: 0;
    }
  }
`

const StyledTab = styled(Tab)`
  padding: 8px 16px;
`

const InputWrapper = styled(`div`)`
  width: 100%;
  max-width: 400px;
  position: relative;
  border: 1px solid #131823;
  border-radius: 5px;

  & > svg {
    position: absolute;
    right: 12px;
    top: 14px;
  }
`

const StyledSearchInput = styled(Input)`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle2};
    font-size: 14px;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
  
  @media screen and (min-width: 480px) {
    ${LabelWrapper}:nth-child(2) {
      margin-left: 16px;
    }
  }
`

const StyledImage = styled(Image)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 58px;
`

const StyledFlexLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 34px;
  grid-row-gap: 34px;
  padding-top: 5px;
  
   @media screen and (max-width: 763px) {
    grid-template-columns: 1fr;
  }
`

const FarmsContainer = styled(Card)`
  background: #00000000;
  width: 100%;
`

const DesktopFarmsDetails = styled.div`
  @media screen and (max-width: 968px) {
    display: none;
  }
`

const StyledSelect = styled(Select)`
  & > div:first-child {
    background-color: ${({theme}) => theme.colors.headerInputBg};
    box-shadow: none;
  }
`

const StyledSortSelect = styled(Select)`
  & > div:first-child {
    background-color: ${({theme}) => theme.colors.headerInputBg};
    box-shadow: none;
  }
`

const NUMBER_OF_FARMS_VISIBLE = 12

const getDisplayApr = (cakeRewardsApr?: number, lpRewardsApr?: number) => {
  if (cakeRewardsApr && lpRewardsApr) {
    return (cakeRewardsApr + lpRewardsApr).toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  if (cakeRewardsApr) {
    return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  return null
}

const Farms: React.FC = () => {
  const { path } = useRouteMatch()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const { data: farmsLP, userDataLoaded } = useFarms()
  const cakePrice = usePriceCakeBusd()
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = useUserFarmsViewMode()
  const { account } = useWeb3React()
  const [sortOption, setSortOption] = useState('liquidity')
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const chosenFarmsLength = useRef(0)
  const { isTablet, isMobile } = useMatchBreakpoints()
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const location = useLocation()
  const [activeFarmCard, setActiveFarmCard] = useState<any>(undefined)
  const width = useWidth()
  const shouldRenderModal = width < 969
  const [tab, setTab] = useState<string>('all')

  const isArchived = pathname.includes('archived')
  const isInactive = pathname.includes('history')
  const isActive = !isInactive && !isArchived

  usePollFarmsWithUserData(isArchived)

  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
  const userDataReady = !account || (!!account && userDataLoaded)

  const [stakedOnly, setStakedOnly] = useUserFarmStakedOnly(isActive)

  // const activeFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier !== '0X' && !isArchivedPid(farm.pid))
  const activeFarms = farmsLP
  const inactiveFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier === '0X' && !isArchivedPid(farm.pid))
  const archivedFarms = farmsLP.filter((farm) => isArchivedPid(farm.pid))

  const stakedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const stakedInactiveFarms = inactiveFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const stakedArchivedFarms = archivedFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const farmsList = useCallback(
    (farmsToDisplay: DeserializedFarm[]): FarmWithStakedValue[] => {
      let farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteTokenPriceBusd) {
          return farm
        }
        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteTokenPriceBusd)
        const { cakeRewardsApr, lpRewardsApr } = isActive
          ? getFarmApr(new BigNumber(farm.poolWeight), cakePrice, totalLiquidity, farm.lpAddresses[ChainId.MAINNET])
          : { cakeRewardsApr: 0, lpRewardsApr: 0 }

        return { ...farm, apr: cakeRewardsApr, lpRewardsApr, liquidity: totalLiquidity }
      })

      if (query) {
        const lowercaseQuery = latinise(query.toLowerCase())
        farmsToDisplayWithAPR = farmsToDisplayWithAPR.filter((farm: FarmWithStakedValue) => {
          return latinise(farm.lpSymbol.toLowerCase()).includes(lowercaseQuery)
        })
      }
      return farmsToDisplayWithAPR
    },
    [cakePrice, query, isActive],
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const getFarmsTypeTabs = () => {
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

  const getSortByTabs = () => {
    return [
      {
        value: 'liquidity',
        label: 'Liquidity',
      },
      {
        value: 'pool',
        label: 'Pool',
      },
      {
        value: 'weight',
        label: 'Weight',
      },
      {
        value: 'apr',
        label: 'APR',
      }
    ]
  }

  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)

  const chosenFarmsMemoized = useMemo(() => {
    let chosenFarms = []

    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case 'apr':
          return orderBy(farms, (farm: FarmWithStakedValue) => farm.apr + farm.lpRewardsApr, 'desc')
        case 'pool':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0),
            'desc',
          )
        case 'weight':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.userData ? Number(farm.userData.earnings) : 0),
            'desc',
          )
        case 'liquidity':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), 'desc')
        default:
          return farms
      }
    }

    if (isActive) {
      chosenFarms = stakedOnly ? farmsList(stakedOnlyFarms) : farmsList(activeFarms)
    }
    if (isInactive) {
      chosenFarms = stakedOnly ? farmsList(stakedInactiveFarms) : farmsList(inactiveFarms)
    }
    if (isArchived) {
      chosenFarms = stakedOnly ? farmsList(stakedArchivedFarms) : farmsList(archivedFarms)
    }

    return sortFarms(chosenFarms).slice(0, numberOfFarmsVisible)
  }, [
    sortOption,
    activeFarms,
    farmsList,
    inactiveFarms,
    archivedFarms,
    isActive,
    isInactive,
    isArchived,
    stakedArchivedFarms,
    stakedInactiveFarms,
    stakedOnly,
    stakedOnlyFarms,
    numberOfFarmsVisible,
  ])

  chosenFarmsLength.current = chosenFarmsMemoized.length

  useEffect(() => {
    if (isIntersecting) {
      setNumberOfFarmsVisible((farmsCurrentlyVisible) => {
        if (farmsCurrentlyVisible <= chosenFarmsLength.current) {
          return farmsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE
        }
        return farmsCurrentlyVisible
      })
    }
  }, [isIntersecting])

  const rowData = chosenFarmsMemoized.map((farm) => {
    const { token, quoteToken } = farm
    const tokenAddress = token.address
    const quoteTokenAddress = quoteToken.address
    const lpLabel = farm.lpSymbol && farm.lpSymbol.split(' ')[0].toUpperCase().replace('PANCAKE', '')

    const row: RowProps = {
      apr: {
        value: getDisplayApr(farm.apr, farm.lpRewardsApr),
        pid: farm.pid,
        multiplier: farm.multiplier,
        lpLabel,
        lpSymbol: farm.lpSymbol,
        tokenAddress,
        quoteTokenAddress,
        cakePrice,
        originalValue: farm.apr,
      },
      farm: {
        label: lpLabel,
        pid: farm.pid,
        token: farm.token,
        quoteToken: farm.quoteToken,
      },
      earned: {
        earnings: getBalanceNumber(new BigNumber(farm.userData.earnings)),
        pid: farm.pid,
      },
      liquidity: {
        liquidity: farm.liquidity,
      },
      multiplier: {
        multiplier: farm.multiplier,
      },
      details: farm,
    }

    return row
  })

  useEffect(() => {
    if (chosenFarmsMemoized && !shouldRenderModal) {
      setActiveFarmCard(chosenFarmsMemoized[0])
    }

    if (shouldRenderModal) {
      setActiveFarmCard(undefined)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRenderModal])

  const updatedData = activeFarmCard && chosenFarmsMemoized?.filter(single => single?.pid === activeFarmCard?.pid)[0]

  useEffect(() => {
    /*
    * TODO: Because of this 5 seconds when you open the stake or unstake modal it
    * disappears. Need a efficient way to handle the selected pool update
    * */

    const intervalId = setInterval(() => {
      if (updatedData && activeFarmCard && activeFarmCard !== updatedData) {
        setActiveFarmCard(updatedData)
      }
    }, 5000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedData, activeFarmCard])

  const renderNoDataFound = () => {
    return (
      <Flex justifyContent="center" alignItems="center" width="100%" height="120px">
        <Text>
          {t('No farms to show')}
        </Text>
      </Flex>
    )
  }

  const renderFarmsTab = (): JSX.Element => {
    return (
      <StyledTabContainer>
        {width > 768 ? <TabMenu
          activeIndex={getFarmsTypeTabs().map( (tt) => { return tt.value; }).indexOf(tab)}
          onItemClick={(index) => {
            setTab(getFarmsTypeTabs()[index].value)
          }}
          normalVariant
        >
          {getFarmsTypeTabs().map((singleTab, index) => {
            return (
              <StyledTab color={tab === singleTab.value ? 'primary' : ''} onClick={() => setTab(singleTab.value)}>
                {singleTab.label}
              </StyledTab>
            )
          })}
        </TabMenu> : <Flex width="150px">
          <StyledSelect
            options={getFarmsTypeTabs()}
            onOptionChange={handleSortOptionChange}
          />
        </Flex>}
        <InputWrapper>
          <StyledSearchInput
            id="token-search-input"
            placeholder={t('Search by Name')}
            scale="md"
            autoComplete="off"
            onChange={handleChangeQuery}
          />
          <SearchIcon width="20px" />
        </InputWrapper>
      </StyledTabContainer>
    )
  }

  const renderSortByTab = (): JSX.Element => {
    return (
        <StyledSortTabContainer>        
        <Text mr="2">{t('Sort by :')}</Text>
          {width > 768 ? <TabMenu
            activeIndex={getSortByTabs().map( (tt) => { return tt.value; }).indexOf(sortOption)}
            onItemClick={(index) => {
              setSortOption(getSortByTabs()[index].value)
            }}
            normalVariant
          >
            {getSortByTabs().map((singleTab, index) => {
              return (
                <StyledTab color={sortOption === singleTab.value ? 'primary' : ''} onClick={() => setSortOption(singleTab.value)}>
                  {singleTab.label}
                </StyledTab>
              )
            })}
          </TabMenu> : <Flex width="150px">
            <StyledSortSelect
              options={getSortByTabs()}
              onOptionChange={handleSortOptionChange}
              zindex="10"
            />
          </Flex>}
        </StyledSortTabContainer>
    )
  }

  const renderContent = (): JSX.Element => {
    return (
      <FarmsContainer>
        <StyledFlexLayout>
          {chosenFarmsMemoized?.length < 1 && renderNoDataFound()}
          <Route exact path={`${path}`}>
            {chosenFarmsMemoized.map((farm) => (
              <Link to={{
                pathname: `${path}/${farm.pid}`,
              }} >
                <FarmCard
                  isCardActive={activeFarmCard?.pid === farm.pid}
                  key={farm.pid}
                  farm={farm}
                  displayApr={getDisplayApr(farm.apr, farm.lpRewardsApr)}
                  cakePrice={cakePrice}
                  account={account}
                  removed={false}
                />
              </Link>
            ))}
          </Route>
        </StyledFlexLayout>
      </FarmsContainer>
    )
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  const renderFarmsTabButton = () => {
    return (
      <FarmTabButtons hasStakeInFinishedFarms={stakedInactiveFarms.length > 0} />
    )
  }

  return (
    <Page>
      <StyledPage>
        <Heading ml="1" mb="2">{t('Farms')}</Heading>
        <Header>
          <InfoContainer>
            <StyledLabelCard>
              <Text fontWeight="500" fontSize="14px">{t('Total Value Locked (USER)')}</Text>
              <Text color={theme.colors.green} fontSize="22px" fontWeight="700">31,787,112</Text>
            </StyledLabelCard>
            <StyledButtonCard>
              <Text fontWeight="500" fontSize="14px">{t('Eco to Harvest')}</Text>
              <Button variant="primary" scale="sm" width="125px" height="35px" mt="10px">{t('Harvest All')}</Button>
            </StyledButtonCard>
          </InfoContainer>
          <InfoContainer>
            <StyledLabelCard>
              <Text fontWeight="500" fontSize="14px">{t('Blockchain Price')}</Text>
              <Text color={theme.colors.yellow} fontSize="22px" fontWeight="700">31,787,112</Text>
            </StyledLabelCard>
            <StyledButtonCard>
              <Text fontWeight="500" fontSize="14px">{t('Farm with Highest APR')}</Text>
              <Button variant="primary" scale="sm" width="125px" height="35px" mt="10px">{t('Farm Now')}</Button>
            </StyledButtonCard>
          </InfoContainer>
          <TotalFarmContainer>
            <Text color={theme.colors.purple} fontSize="46px" fontWeight="700">{farmsLP.length}</Text>
            <Text fontSize="14px" fontWeight="500">{t('# of Farms')}</Text>
          </TotalFarmContainer>
        </Header>
        <Body>
          {renderFarmsTab()}
          {renderSortByTab()}
          {renderContent()}
          {account && !userDataLoaded && stakedOnly && (
            <Flex justifyContent="center">
              <Loading />
            </Flex>
          )}
          <div ref={observerRef} />
        </Body>
      </StyledPage>
    </Page>
  )
}

export default Farms
