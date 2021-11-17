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
  ESIcon,
  StakeIcon,
  SubMenuItems,
  Svg,
  Tab,
  TabMenu,
  useWalletModal,
  useMatchBreakpoints, useModal,
} from '@pancakeswap/uikit'
import { ChainId } from '@pancakeswap/sdk'
import styled from 'styled-components'
import useAuth from 'hooks/useAuth'
import Page from 'views/Page'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { orderBy } from 'lodash'
import { latinise } from 'utils/latinise'
import Select, { OptionProps } from 'components/Select/Select'
import Loading from 'components/Loading'
import { useDispatch } from 'react-redux'
import history from 'routerHistory'
import { Input as NumericalInput } from '../../components/CurrencyInputPanel/NumericalInput'
import useTheme from '../../hooks/useTheme'
import { useWidth } from '../../hooks/useWidth'
import stake from '../../config/constants/stake'

const StyledPage = styled(`div`)`
  max-width: 1024px;
  width: 100%;
  z-index: 1;
  padding-top: 57px;

  @media screen and (max-width: 968px) {
    padding-top: 27px;
  }
`

const Body = styled(`div`)`
  border-radius: 10px;
  margin-top: 40px;

  @media screen and (max-width: 576px) {
    margin-top: 30px;
  }
`

const StakeContainer = styled(Card)`
  background: #00000000;
  width: 100%;
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

const StyledAPRCard = styled(Flex)`
  padding: 23px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: 1px solid #131823;
   
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 10px;
  & > div {
    width: 100%;
  }
`

const StyledECOReportCard = styled(Flex)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
   
  border-radius: 10px;
  & > div {
    width: 100%;
  }
`

const StyledECOReportWrapper = styled(Flex)`
  padding: 23px;
  padding-top: 18px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border: 1px solid #131823;
   
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 10px;
  & > div {
    width: 100%;
  }
`

const DecoText = styled(Text)`
  text-decoration: underline;  
`

const StyledDetailFlex = styled(Flex)`
  padding: 23px;
  padding-top: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #131823;
   
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
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
  font-size: 14px;
`

const StyledSelect = styled(Select)`
  & > div:first-child {
    background-color: ${({ theme }) => theme.colors.headerInputBg};
    box-shadow: none;
  }
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

const Stake: React.FC = () => {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const { isTablet, isMobile } = useMatchBreakpoints()
  const dispatch = useDispatch()
  const { theme, isDark } = useTheme()
  const { login, logout } = useAuth()
  const width = useWidth()
  const { onPresentConnectModal } = useWalletModal(login, logout, t, "", width < 481)
  const [sortOption, setSortOption] = useState('stake')
  const [value, setValue] = useState('0.0')

  const getSortByTabs = () => {
    return [
      {
        value: 'stake',
        label: 'Stake ECO',
      },
      {
        value: 'unstake',
        label: 'Unstake',
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
          activeIndex={getSortByTabs().map((tt) => { return tt.value; }).indexOf(sortOption)}
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
          />
        </Flex>}
      </StyledTabContainer>
    )
  }

  const renderInput = (): JSX.Element => {
    return (
      <Flex flexDirection="column" mt="40px">
        <Text mb="5px">{t('Balance')}</Text>
        <InputWrapper>
          <NumericalInput
            value={value}
            onUserInput={(val) => handleInputChange(val)}
          />
          <Flex height="48px" alignItems="center" borderRight="1px solid #363636">
            <Button onClick={() => handleInputChange('1000')} scale="sm" variant="text">
              <Text textAlign="center" fontSize="14px" fontWeight="400" color={theme.colors.textDisabled}>{t('Max')}</Text>
            </Button>
          </Flex>
          <Flex flexDirection="column" ml="10px">
            <Text>AVAX-JOE</Text>
          </Flex>
        </InputWrapper>
      </Flex>
    )
  }

  const renderContent = (): JSX.Element => {
    return (
      <StakeContainer>
        <StyledFlexLayout>
          <Flex justifyContent="flex-start" flexDirection="column">
            <StyledAPRCard mb="23px">
              <Flex justifyContent="flex-start" flexDirection="column">
                <Text fontWeight="700" fontSize="18px">{t('Staking APR')}</Text>
                <Button variant="primary" scale="sm" width="125px" height="35px" mt="10px"><Text fontSize="14px">{t('View Status')}</Text></Button>
              </Flex>
              <Flex justifyContent="center" flexDirection="column">
                <Text fontWeight="700" fontSize="18px" textAlign="right">28.33593%</Text>
                <Text fontWeight="500" fontSize="14px" textAlign="right">Last 7 days APR</Text>
              </Flex>
            </StyledAPRCard>
            <StyledECOReportWrapper>
              <StyledECOReportCard>
                <Flex justifyContent="flex-start" flexDirection="column">
                  <Flex mt="10px" mb="10px"><ESIcon color={theme.colors.primary} width="40px" /></Flex>
                  <Text fontSize="14px" fontWeight="500" color={theme.colors.headerSubtleText} mt="5px" mb="5px">{t('XECO Balance')}</Text>
                  <Text fontSize="18px" fontWeight="700" mt="5px" mb="5px">$35,256,822</Text>
                </Flex>
                <Flex justifyContent="flex-start" flexDirection="column">
                  <Flex mb="10px"><StakeIcon color={theme.colors.primary} width="40px" /></Flex>
                  <Text fontSize="14px" fontWeight="500" color={theme.colors.headerSubtleText} mt="5px" mb="5px">{t('Staked ECO')}</Text>
                  <Text fontSize="18px" fontWeight="700" mt="5px" mb="5px">$35,256,822</Text>
                </Flex>
              </StyledECOReportCard>
              <Flex justifyContent="flex-start" flexDirection="column" mt="30px">
                <Flex>
                  <Button variant="text" onClick={() => console.log("Add XECO to Wallet")} padding="0"><DecoText fontWeight="500" fontSize="14px">{t('Add XECO to Wallet')}</DecoText></Button>
                </Flex>
                <Text fontSize="12px" fontWeight="500" color={theme.colors.headerSubtleText}>{t(stake[0].text3)}</Text>
              </Flex>
            </StyledECOReportWrapper>
          </Flex>
          <StyledDetailFlex>
            <Flex justifyContent="space-between" flexDirection="column">
              {renderSortByTab()}
              {renderInput()}
            </Flex>
            <Flex justifyContent="center" flexDirection="column" alignItems="center">
              <Button onClick={onPresentConnectModal} variant="primary" scale="sm" width="100%" height="50px" mt="10px">{t('Connect Wallet')}</Button>
            </Flex>
          </StyledDetailFlex>
        </StyledFlexLayout>
      </StakeContainer>
    )
  }

  return (
    <Page>
      <StyledPage>
        <Flex justifyContent="flex-start" flexDirection="column">
          <Text fontSize="18px" mb="5px">{t(`Earn more EC0`)}</Text>
          <Text fontSize="14px" fontWeight="500" color={theme.colors.headerSubtleText} mt="5px" mb="5px">{t(stake[0].text1)}</Text>
          <Text fontSize="14px" fontWeight="500" mt="5px" mb="5px">{t(stake[0].text2)}</Text>
        </Flex>
        <Body>
          {renderContent()}
          {account && (
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

export default Stake
