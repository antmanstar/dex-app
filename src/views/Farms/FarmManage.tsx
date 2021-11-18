import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { Route, useRouteMatch, useLocation, NavLink, useParams } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import {
  Image,
  Heading,
  RowType,
  Toggle,
  Text,
  Button,
  ArrowBackIcon,
  Flex,
  Card,
  SearchIcon,
  useWalletModal,
  Tab,
  TabMenu,
  Link,
  useMatchBreakpoints, useModal, LinkExternal,
} from '@pancakeswap/uikit'
import { ChainId } from '@pancakeswap/sdk'
import styled from 'styled-components'
import FlexLayout from 'components/Layout/Flex'
import Page from 'views/Page'
// import Page from 'components/Layout/Page'
import { useFarms, usePollFarmsWithUserData, usePriceCakeBusd, useFarmFromPid } from 'state/farms/hooks'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { DeserializedFarm } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import useAuth from 'hooks/useAuth'
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
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import history from 'routerHistory'
import { Input as NumericalInput } from '../../components/CurrencyInputPanel/NumericalInput'
import FarmCard, { FarmWithStakedValue } from './components/FarmCard/FarmCard'
import Table from './components/FarmTable/FarmTable'
import FarmTabButtons from './components/FarmTabButtons'
import { RowProps } from './components/FarmTable/Row'
import ToggleView from './components/ToggleView/ToggleView'
import { DesktopColumnSchema } from './components/types'
import useTheme from '../../hooks/useTheme'
import config from '../../components/Menu/config/config'
import RowDataJSON from '../../config/constants/DummyFarmsData.json'
import { FarmDetails } from './FarmDetails'
import { setActiveBodyType } from '../../state/farms'
import { useWidth } from '../../hooks/useWidth'
import { BASE_ADD_LIQUIDITY_URL } from '../../config'
import getLiquidityUrlPathParts from '../../utils/getLiquidityUrlPathParts'

const StyledPage = styled(`div`)`
  max-width: 1024px;
  width: 100%;
  z-index: 1;
  padding-top: 57px;

  @media screen and (max-width: 968px) {
    padding-top: 27px;
  }
`

const Header = styled(`div`)`
  margin-top: 40px;
  background-color: ${({theme}) => theme.colors.backgroundAlt};
  border: 1px solid ${({theme}) => theme.colors.backgroundAlt};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 18px;
  padding-top:25px;
  border-radius: 10px;
  padding-bottom: 25px;
  padding-right: 18px;

  @media screen and (max-width: 968px) {
    margin-top: 0;
    padding: 5px 10px 10px 5px
  }
`

const StyledHeaderButton = styled(Button)`
  padding: 0px;
  margin-right: 20px;

  @media screen and (max-width: 576px) {
    margin-right: 5px;
  }
`

const Body = styled(`div`)`
  border-radius: 10px;
  margin-top: 55px;

  @media screen and (max-width: 576px) {
    margin-top: 30px;
  }
`
const StyledDtailFlex = styled(Flex)`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #131823;
   
  background-color: ${({theme}) => theme.colors.backgroundAlt};
  border-radius: 10px;
  & > div {
    width: 100%;
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

const StyledTab = styled(Tab)`
  padding: 4px 8px;
  font-size: 16px;
`

const StyledSelect = styled(Select)`
  & > div:first-child {
    background-color: ${({theme}) => theme.colors.headerInputBg};
    box-shadow: none;
  }
`

const StyledFlexLayout = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
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

const InputWrapper = styled.div`
  height: 60px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  background: ${({ theme }) => theme.colors.input};
  border-radius: 5px;
  padding-left: 10px;
  padding-right: 10px;

  @media screen and (max-width: 763px) {
    margin-bottom: 80px;
  }

  border: 1px solid #131823;
`

const getDisplayApr = (cakeRewardsApr?: number, lpRewardsApr?: number) => {
  if (cakeRewardsApr && lpRewardsApr) {
    return (cakeRewardsApr + lpRewardsApr).toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  if (cakeRewardsApr) {
    return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  return null
}

const FarmManage: React.FC = () => {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const farm = useFarmFromPid(parseInt(pathname.split('/')[2]))
  const { data } = useFarms()
  const { account } = useWeb3React()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const { isTablet, isMobile } = useMatchBreakpoints()
  const dispatch = useDispatch()
  const { theme, isDark } = useTheme()
  const location = useLocation()
  const { login, logout } = useAuth()
  const width = useWidth()
  const { onPresentConnectModal } = useWalletModal(login, logout, t, "", width < 481)
  const [sortOption, setSortOption] = useState('stake')
  const [value, setValue] = useState('0.0')

  usePollFarmsWithUserData(false)

  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
  const userDataReady = !account || (!!account && !!farm)

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: farm.quoteToken.address,
    tokenAddress: farm.token.address,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('ECO', 'ECO')

  const getSortByTabs = () => {
    return [
      {
        value: 'stake',
        label: 'Stake',
      },
      {
        value: 'unstake',
        label: 'Unstake',
      },
      {
        value: 'analytics',
        label: 'Analytics',
      }
    ]
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  const handleInputChange = (val: string) => {
    setValue(val)
  }

  const renderSortByTab = (): JSX.Element => {
    return (
        <StyledTabContainer>        
          {width > 576 ? <TabMenu
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
            <StyledSelect
              options={getSortByTabs()}
              onOptionChange={handleSortOptionChange}
              zindex="10"
            />
          </Flex>}
        </StyledTabContainer>
    )
  }

  const renderInput = (): JSX.Element => {
    return (
      <Flex flexDirection="column" mt="40px">
        <Text mb="5px">{t('LP Token Balance')}</Text>
        <InputWrapper>
          <NumericalInput
            value={value}
            onUserInput={(val) => handleInputChange(val)}
          />
          <Flex height="48px" alignItems="center" borderRight="1px solid #363636">
            <Button onClick={()=>handleInputChange('1000')} scale="sm" variant="text">
            <Text textAlign="center" fontSize="14px" fontWeight="400" color={theme.colors.textDisabled}>{t('Max')}</Text>
            </Button>
          </Flex>
          <Flex flexDirection="column" ml="10px">
            <Text>{farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('LP', '')}</Text>
          </Flex>
        </InputWrapper>
      </Flex>
    )
  }

  const renderContent = (): JSX.Element => {
    return (
        <FarmsContainer>
          <StyledFlexLayout>
          {farm && <FarmDetails userDataReady={userDataReady} location={location} data={farm} addLiquidityUrl={addLiquidityUrl} lpLabel={lpLabel}/>}
          <StyledDtailFlex>
            <Flex justifyContent="space-between" flexDirection="column" mt="3px" mb="3px">
            {renderSortByTab()}
            {renderInput()}
            </Flex>
            <Flex justifyContent="center" flexDirection="column" mt="3px" mb="3px" alignItems="center">
              <Button onClick={onPresentConnectModal} variant="primary" scale="sm" width="100%" height="50px" mt="10px">{t('Connect Wallet')}</Button>
            </Flex>
          </StyledDtailFlex>
          </StyledFlexLayout>
        </FarmsContainer>
    )
  }

  return (
    <Page>
      <StyledPage>
        <Header>
          <Flex alignItems="center">
            <StyledHeaderButton variant="text" onClick={() => history.push('/farms')}><ArrowBackIcon /></StyledHeaderButton>
            <StyledHeaderButton variant="text" onClick={() => history.push('/farms')}><Text fontWeight="500" fontSize="14px">{t('Manage Farm')}</Text></StyledHeaderButton>            
          </Flex>
          <LinkExternal href={addLiquidityUrl} style={{ alignSelf: 'center' }}>
            {t('Get %symbol%', { symbol: lpLabel })}
          </LinkExternal>
        </Header>
        <Body>
          {renderContent()}
          {account && !farm && (
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

export default FarmManage
