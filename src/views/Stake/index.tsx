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
  Table,
  Td,
  Th,
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
import { CurrencyLogo } from 'components/Logo'
import pools from 'config/constants/pools'
import StakedAction from 'views/Farms/components/FarmTable/Actions/StakedAction'
import { useFarmFromPid } from 'state/farms/hooks'
import stake from '../../config/constants/stake'
import { Input as NumericalInput } from '../../components/CurrencyInputPanel/NumericalInput'
import useTheme from '../../hooks/useTheme'
import { useWidth } from '../../hooks/useWidth'

const StyledPage = styled(`div`)`
  max-width: 1024px;
  width: 100%;
  z-index: 1;
  padding-top: 27px;
  margin-bottom: 100px;

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

const StyledAPRCard = styled.div`
  padding: 23px;
  display: grid;
  margin-bottom: 23px;
  
  grid-template-columns: 0.3fr 0.3fr 0.3fr;
  grid-column-gap: 34px;
  grid-row-gap: 34px;
  
  @media screen and (max-width: 763px) {
    display: flex;
    flex-direction: column;
  }

  @media screen and (max-width: 410px) {
    grid-template-columns: 1fr;
  }
   
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 10px;
  & > div {
    width: 100%;
  }
`

const TVLCSFlex = styled(Flex)`
  justify-content: flex-start; 
  flex-direction: column;   

  @media screen and (max-width: 410px) {
    justify-content: flex-start; 
    flex-direction: column;
  }
`

const TVLFlex = styled(Flex)`
  margin-top: 14px;
  flex-direction: column;
  width: 100%;

  @media screen and (max-width: 763px) {
    margin-top: 0;
    margin-bottom: 10px;
  }
`

const CSFlex = styled(Flex)`
  margin-top: 14px;
  flex-direction: column;
  width: 100%;

  @media screen and (max-width: 410px) {
    margin-top: 24px;
    margin-left: 0;
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
   
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 10px;
  & > div {
    width: 100%;
  }
`

const StyledPoolInfoWrapper = styled(Flex)`
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
   
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

const BorderedText = styled(Text)`
  border: 1px solid;
  width: max-content;
  padding: 1px 3px;
`

const StyledTableHeader = styled.thead`
  height: 25px;
  font-size: 12px;    
  box-sizing: border-box;
  border-bottom: 1px solid ${({theme}) => theme.isDark ? '#1c1f2b' : '#f2f2f2'};
`

const StyledTr = styled.tr`
  border-bottom: 1px solid ${({theme}) => theme.isDark ? '#1c1f2b' : '#f2f2f2'};
  line-height: 18px;
  transition: all .3s cubic-bezier(.15,1,.22,1) 0s;
  transition: all .3s;

  &:hover{
    z-index: 100;
    box-shadow: 0 8px 12px 0 rgb(49 103 180 / 10%);
    transform: scale(1.02);
    border-radius: 10px;
}
`

const StyledTd = styled(Td) <{ isXs: boolean }>`
  padding-left: ${({ isXs }) => isXs ? '12px' : '23px'};
  padding-right: ${({ isXs }) => isXs ? '12px' : '23px'};
  padding-top: 10px;
  padding-bottom: 10px;
`

const StyledTh = styled(Th) <{ isXs: boolean }>`
  padding-left: ${({ isXs }) => isXs ? '12px' : '23px'};
  padding-right: ${({ isXs }) => isXs ? '12px' : '23px'};
  padding-bottom: 5px;
`

const Stake: React.FC = () => {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const farm = useFarmFromPid(0)
  const { account } = useWeb3React()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const { isTablet, isMobile, isXs } = useMatchBreakpoints()
  const dispatch = useDispatch()
  const { theme, isDark } = useTheme()
  const { login, logout } = useAuth()
  const width = useWidth()
  const { onPresentConnectModal } = useWalletModal(login, logout, t, "", width < 481)
  const [sortOption, setSortOption] = useState('stake')
  const [value, setValue] = useState('0.0')
  const [sortBy, setSortBy] = useState<string>('all')
  const [reverseOrder, setReversOrder] = useState<boolean>(false)

  const userDataReady = !account || (!!account && !!farm)
  const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('ECO', 'ECO')

  const getSortByTabs = () => {
    return [
      {
        value: 'deposit',
        label: 'Stake ECO',
      },
      {
        value: 'withdraw',
        label: 'Unstake',
      }
    ]
  }

  const getSampleData = () => {
    return [
      {
        pools: {
          "decimals": 18,
          "symbol": "SPELL",
          "name": "SPELL",
          "chainId": 80001,
          "address": "0x6726ba83CD463dc3a2118Ab2C6E553E2c8a9F2d8",
          "tokenInfo": {
            "name": "SPELL",
            "symbol": "SPELL",
            "address": "0x6726ba83CD463dc3a2118Ab2C6E553E2c8a9F2d8",
            "chainId": 80001,
            "decimals": 18,
            "logoURI": "/images/tokens/0x6726ba83CD463dc3a2118Ab2C6E553E2c8a9F2d8.png"
          },
          "tags": [],
        },
        apr: 36.71,
        tvl: '4M',
        earnings: 0
      },
      {
        pools: {
          "decimals": 18,
          "symbol": "FONT",
          "name": "FONT",
          "chainId": 80002,
          "address": "0x6726ba83CD463dc3a2118Ab2C6E553E2c8a9F2d8",
          "tokenInfo": {
            "name": "FONT",
            "symbol": "FONT",
            "address": "0x6726ba83CD463dc3a2118Ab2C6E553E2c8a9F2d8",
            "chainId": 80002,
            "decimals": 18,
            "logoURI": "/images/tokens/0x6726ba83CD463dc3a2118Ab2C6E553E2c8a9F2d8.png"
          },
          "tags": []
        },
        apr: 2.33,
        tvl: '2',
        earnings: 2712
      },
      {
        pools: {
          "decimals": 18,
          "symbol": "LQDR",
          "name": "LQDR",
          "chainId": 80003,
          "address": "0x6726ba83CD463dc3a2118Ab2C6E553E2c8a9F2d8",
          "tokenInfo": {
            "name": "LQDR",
            "symbol": "LQDR",
            "address": "0x6726ba83CD463dc3a2118Ab2C6E553E2c8a9F2d8",
            "chainId": 80003,
            "decimals": 18,
            "logoURI": "/images/tokens/0x6726ba83CD463dc3a2118Ab2C6E553E2c8a9F2d8.png"
          },
          "tags": []
        },
        apr: 11.11,
        tvl: '1',
        earnings: 100
      }
    ]
  }

  const renderTable = () => {
    const filteredPairs = getSampleData();

    if (filteredPairs?.length > 0) {
      let sortedOrder = [...filteredPairs]

      if (sortBy !== 'none') {
        sortedOrder.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : b[sortBy] > a[sortBy] ? -1 : 0))
      }

      sortedOrder = reverseOrder ? [...sortedOrder].reverse() : sortedOrder

      return sortedOrder.map((arr) => {
        return (
          <StyledTr>
            {
              getHeaders().map((header, index) => {
                const prefix = header.id === 'tvl' ? '$' : '';
                if (header.id === "pools") return (
                  <StyledTd isXs={isXs} >
                    <Flex justifyContent='flex-start' flexDirection="row" alignItems="center">
                      <CurrencyLogo currency={arr[header.id]} />
                      <Text fontSize="14px" fontWeight="400" ml="5px" display={isXs ? 'none' : 'block'}>{`Earn ${arr[header.id].name}`}</Text>
                    </Flex>
                  </StyledTd>
                )
                return (
                  <StyledTd isXs={isXs} >
                    <Text fontSize="14px" fontWeight="400">{`${prefix}${arr[header.id]}`}</Text>
                  </StyledTd>
                )
              })
            }
          </StyledTr>)
      })
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
    return [
      {
        id: 'pools',
        title: 'Pools',
      },
      {
        id: 'apr',
        title: 'APR',
      },
      {
        id: 'tvl',
        title: 'TVL',
      },
      {
        id: 'earnings',
        title: 'Earnings',
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
        <Flex mb="5px" justifyContent="space-between" padding="0px 5px 0px 5px">
          <Text>{t('Balance')}</Text>
          <Text>0</Text>
        </Flex>
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
            <CurrencyLogo currency={getSampleData()[0].pools} />
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
            <StyledAPRCard>
              <Flex justifyContent="center" flexDirection="column" mr="10px" flexGrow={1} >
                <Text fontWeight="700" fontSize="18px">{t('Staking')}</Text>
                <Button variant="primary" scale="sm" width="110px" height="35px" mt="10px" padding="0" onClick={() => history.push('/dashboard')}>{t('View Stats')}</Button>
              </Flex>
              <Flex justifyContent="flex-start" flexDirection="column" alignSelf="center">
                <Text fontWeight="400" fontSize="14px" color={theme.colors.headerSubtleText}>{t('APR')}</Text>
                <Text fontWeight="700" fontSize="18px">2.33%</Text>
                <BorderedText fontWeight="400" fontSize="14px" color={theme.colors.headerSubtleText}>1bECO = 1.15 ECO</BorderedText>
              </Flex>
              <TVLCSFlex>
                <TVLFlex>
                  <Text fontWeight="400" fontSize="14px" color={theme.colors.headerSubtleText}>{t('TVL')}</Text>
                  <Text fontWeight="700" fontSize="18px">$455,255</Text>
                </TVLFlex>
                <CSFlex>
                  <Text fontWeight="400" fontSize="14px" color={theme.colors.headerSubtleText}>{t('Circulating Supply')}</Text>
                  <Text fontWeight="700" fontSize="18px">$455,255</Text>
                </CSFlex>
              </TVLCSFlex>
            </StyledAPRCard>
            <StyledECOReportWrapper>
              <StyledECOReportCard>
                <Flex justifyContent="flex-start" flexDirection="column">
                  <Flex mt="10px" mb="10px"><ESIcon color={theme.colors.primary} width="40px" /></Flex>
                  <Text fontSize="14px" fontWeight="500" color={theme.colors.headerSubtleText} mt="5px" mb="5px">{t('XECO Balance')}</Text>
                  <Text fontSize="18px" fontWeight="700" mt="5px" mb="5px">$35,256</Text>
                </Flex>
                <Flex justifyContent="flex-start" flexDirection="column">
                  <Flex mb="10px"><StakeIcon color={theme.colors.primary} width="40px" /></Flex>
                  <Text fontSize="14px" fontWeight="500" color={theme.colors.headerSubtleText} mt="5px" mb="5px">{t('Staked ECO')}</Text>
                  <Text fontSize="18px" fontWeight="700" mt="5px" mb="5px">$35,256</Text>
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
            <Flex justifyContent="space-between" flexDirection="column" height="100%" minHeight="320px">
              {renderSortByTab()}
              {/* {renderInput()} */}
              <StakedAction userDataReady={userDataReady} token={farm.token} quoteToken={farm.quoteToken} pid={0} lpSymbol={lpLabel} lpAddresses={farm.lpAddresses} location={pathname} contentType={sortOption} isCard/>
            </Flex>
            {/* <Flex justifyContent="center" flexDirection="column" alignItems="center">
              <Button onClick={onPresentConnectModal} variant="primary" scale="sm" width="100%" height="50px" mt="10px">{t('Connect Wallet')}</Button>
            </Flex> */}
          </StyledDetailFlex>
        </StyledFlexLayout>
        <StyledPoolInfoWrapper>
          <Table>
            <StyledTableHeader>
              {getHeaders().map((singleHeader, index) => {
                return (
                  <StyledTh
                    onClick={() => handleHeaderClick(singleHeader.id)}
                    isXs={isXs}
                  >
                    <Text fontSize="14px" color={theme.colors.headerSubtleText} fontWeight="400">{singleHeader.title}</Text>
                  </StyledTh>
                )
              })}
            </StyledTableHeader>
            <tbody>{renderTable()}</tbody>
          </Table>
        </StyledPoolInfoWrapper>
      </StakeContainer>
    )
  }

  return (
    <Page>
      <StyledPage>
        <Flex justifyContent="flex-start" flexDirection="column">
          <Text fontSize="18px" mb="5px">{t(`Earn more ECO`)}</Text>
          <Text fontSize="14px" fontWeight="500" color={theme.colors.headerSubtleText} mt="5px" mb="5px">{t(stake[0].text1)}</Text>
          <Text fontSize="14px" fontWeight="500" mt="5px" mb="5px">{t(stake[0].text2)}</Text>
        </Flex>
        <Body>
          {renderContent()}
          {/* {account && ( */}
          {/*  <Flex justifyContent="center"> */}
          {/*    <Loading /> */}
          {/*  </Flex> */}
          {/* )} */}
          <div ref={observerRef} />
        </Body>
      </StyledPage>
    </Page>
  )
}

export default Stake
