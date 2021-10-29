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
  useMatchBreakpoints, useModal,
} from '@pancakeswap/uikit'
import { ChainId } from '@pancakeswap/sdk'
import styled from 'styled-components'
import FlexLayout from 'components/Layout/Flex'
import Page from 'components/Layout/Page'
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
import RowDataJSON from '../../config/constants/DummyFarmsData.json'
import { FarmDetailsCard } from './FarmDetailsCard'
import { DetailsModal } from './DetailsModal'
import { setActiveBodyType } from '../../state/farms'
import { useWidth } from '../../hooks/useWidth'

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 12px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 8px;
    margin-bottom: 0;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 16px 32px;
  }
`

const HeaderWrapper = styled(Flex)`
  margin-bottom: 12px;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
    width: auto;
    margin-bottom: 0;
  }
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
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

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`

const Header = styled(`div`)`
  background: ${({ theme }) => theme.colors.backgroundAlt3};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
`

const StyledImage = styled(Image)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 58px;
`

const FarmsContainer = styled(Card)`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  padding: 12px 8px;
  width: 100%;
  //min-height: calc(100vh - 500px);
`

const StyledFlexLayout = styled(FlexLayout)`
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
  }
  
  & > * {
    max-width: 240px;
    min-width: 0;
    margin: 12px 8px;
    //max-width: 31.5%;
  }
`

const FarmsWithDetailsContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  margin-top: 24px;
  grid-column-gap: 24px;
  
  @media screen and (max-width: 1024px) {
    grid-column-gap: 16px;
  }

  @media screen and (max-width: 968px) {
    //grid-template-columns: 1fr 1fr;
    padding-left: 8px;
    padding-right: 8px;

    display: flex;
    width: 100%;
    //flex-direction: column;
  }
`

const StyledPage = styled(Page)`
  padding: 16px 0;
`

const DesktopFarmsDetails = styled.div`
  @media screen and (max-width: 968px) {
    display: none;
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
  const [sortOption, setSortOption] = useState('hot')
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const chosenFarmsLength = useRef(0)
  const { isTablet, isMobile } = useMatchBreakpoints()
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const location = useLocation()
  const [activeFarmCard, setActiveFarmCard] = useState<any>(undefined)
  const width = useWidth()
  const shouldRenderModal = width < 968

  const isArchived = pathname.includes('archived')
  const isInactive = pathname.includes('history')
  const isActive = !isInactive && !isArchived

  usePollFarmsWithUserData(isArchived)

  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
  const userDataReady = !account || (!!account && userDataLoaded)

  const [detailsModal, dismissDetailsModal] = useModal(
    <DetailsModal
      data={activeFarmCard}
      customOnDismiss={() => {
        setActiveFarmCard(undefined)
        dismissDetailsModal()
      }}
      location={location}
      userDataReady={userDataReady}
      isPopUp={width < 481}
    />,
    true,
    true,
    'farm-details-modal',
    width < 481
  )

  const [stakedOnly, setStakedOnly] = useUserFarmStakedOnly(isActive)

  const activeFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier !== '0X' && !isArchivedPid(farm.pid))
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

  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)

  const chosenFarmsMemoized = useMemo(() => {
    let chosenFarms = []

    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case 'apr':
          return orderBy(farms, (farm: FarmWithStakedValue) => farm.apr + farm.lpRewardsApr, 'desc')
        case 'multiplier':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0),
            'desc',
          )
        case 'earned':
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

  // const dummyRowData = RowDataJSON

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

  const handleSelectFarm = (data: any) => {
    setActiveFarmCard(data)
    if (shouldRenderModal) {
      detailsModal()
    }
    dispatch(setActiveBodyType('details'))
  }

  const renderContent = (): JSX.Element => {
    // if (viewMode === ViewMode.TABLE && rowData.length) {
    //   const columnSchema = DesktopColumnSchema
    //
    //   const columns = columnSchema.map((column) => ({
    //     id: column.id,
    //     name: column.name,
    //     label: column.label,
    //     sort: (a: RowType<RowProps>, b: RowType<RowProps>) => {
    //       switch (column.name) {
    //         case 'farm':
    //           return b.id - a.id
    //         case 'apr':
    //           if (a.original.apr.value && b.original.apr.value) {
    //             return Number(a.original.apr.value) - Number(b.original.apr.value)
    //           }
    //
    //           return 0
    //         case 'earned':
    //           return a.original.earned.earnings - b.original.earned.earnings
    //         default:
    //           return 1
    //       }
    //     },
    //     sortable: column.sortable,
    //   }))
    //
    //   return <Table data={rowData} columns={columns} userDataReady={userDataReady} />
    // }

    return (
      <FarmsWithDetailsContainer>
        <FarmsContainer>
          <StyledFlexLayout>
            <Route exact path={`${path}`}>
              {chosenFarmsMemoized.map((farm) => (
                <FarmCard
                  isCardActive={activeFarmCard?.pid === farm.pid}
                  key={farm.pid}
                  farm={farm}
                  displayApr={getDisplayApr(farm.apr, farm.lpRewardsApr)}
                  cakePrice={cakePrice}
                  account={account}
                  onClick={() => handleSelectFarm(farm)}
                  removed={false}
                />
              ))}
            </Route>
            <Route exact path={`${path}/history`}>
              {chosenFarmsMemoized.map((farm) => (
                <FarmCard
                  isCardActive={activeFarmCard?.pid === farm.pid}
                  key={farm.pid}
                  farm={farm}
                  displayApr={getDisplayApr(farm.apr, farm.lpRewardsApr)}
                  cakePrice={cakePrice}
                  account={account}
                  onClick={() => handleSelectFarm(farm)}
                  removed
                />
              ))}
            </Route>
            <Route exact path={`${path}/archived`}>
              {chosenFarmsMemoized.map((farm) => (
                <FarmCard
                  isCardActive={activeFarmCard?.pid === farm.pid}
                  key={farm.pid}
                  farm={farm}
                  displayApr={getDisplayApr(farm.apr, farm.lpRewardsApr)}
                  cakePrice={cakePrice}
                  account={account}
                  onClick={() => handleSelectFarm(farm)}
                  removed
                />
              ))}
            </Route>
          </StyledFlexLayout>
        </FarmsContainer>
        <DesktopFarmsDetails>{activeFarmCard && <FarmDetailsCard userDataReady={userDataReady} location={location} data={activeFarmCard} />}</DesktopFarmsDetails>
      </FarmsWithDetailsContainer>
    )
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  const renderSortDropdown = () => {
    return (
      <LabelWrapper>
        {/* <Text textTransform="uppercase">{t('Sort by')}</Text> */}
        <Select
          options={[
            {
              label: t('Hot'),
              value: 'hot',
            },
            {
              label: t('APR'),
              value: 'apr',
            },
            {
              label: t('Multiplier'),
              value: 'multiplier',
            },
            {
              label: t('Earned'),
              value: 'earned',
            },
            {
              label: t('Liquidity'),
              value: 'liquidity',
            },
          ]}
          onOptionChange={handleSortOptionChange}
        />
      </LabelWrapper>
    )
  }

  const renderFarmsTabButton = () => {
    return (
      <FarmTabButtons hasStakeInFinishedFarms={stakedInactiveFarms.length > 0} />
    )
  }

  return (
    <>
      <StyledPage>
        <Header>
          <ControlContainer>
            <HeaderWrapper justifyContent="space-between" alignItems="center" marginBottom="16px">
              <Heading>Farms</Heading>
               {width > 480 && width < 844 && renderFarmsTabButton()}
            </HeaderWrapper>
            <ViewControls>
              {/* <ToggleView viewMode={viewMode} onToggle={(mode: ViewMode) => setViewMode(mode)} /> */}
              {/* <ToggleWrapper> */}
              {/*  <Toggle */}
              {/*    id="staked-only-farms" */}
              {/*    checked={stakedOnly} */}
              {/*    onChange={() => setStakedOnly(!stakedOnly)} */}
              {/*    scale="sm" */}
              {/*  /> */}
              {/*  <Text> {t('Staked only')}</Text> */}
              {/* </ToggleWrapper> */}
              {(width < 481 || width > 843) && renderFarmsTabButton()}
              {width < 481 && renderSortDropdown()}
            </ViewControls>
            <FilterContainer>
              {width > 480 && renderSortDropdown()}
              <LabelWrapper style={{ width: "100%" }}>
                {/* <Text textTransform="uppercase">{t('Search')}</Text> */}
                <SearchInput onChange={handleChangeQuery} placeholder="Search Farms" background={theme.colors.backgroundAlt2} />
              </LabelWrapper>
            </FilterContainer>
          </ControlContainer>
        </Header>
        {renderContent()}
        {account && !userDataLoaded && stakedOnly && (
          <Flex justifyContent="center">
            <Loading />
          </Flex>
        )}
        <div ref={observerRef} />
      </StyledPage>
    </>
  )
}

export default Farms
