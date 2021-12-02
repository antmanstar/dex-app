import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import {
  Text,
  Button,
  ArrowBackIcon,
  Flex,
  Card,
  Input,
  useMatchBreakpoints,
  useWalletModal,
  Th,
  Td,
  Table
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import Page from 'views/Page'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'
import { useDispatch } from 'react-redux'
import StepCard from './components/StepCard'
import InfoCard from './components/InfoCard'
import RoundInfoCard from './components/RoundInfoCard'
import useTheme from '../../hooks/useTheme'
import { useWidth } from '../../hooks/useWidth'
import config from '../../config/constants/referral'


const StyledPage = styled(`div`)`
  max-width: 1180px;
  width: 100%;
  z-index: 1;
  padding-top: 57px;

  @media screen and (max-width: 968px) {
    padding-top: 27px;
  }
`

const Header = styled(`div`)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media screen and (max-width: 968px) {
    margin-top: 0;
    padding: 5px 10px 10px 5px
  }
`

const Body = styled(`div`)`
  border-radius: 10px;
  margin-top: 30px;

  @media screen and (max-width: 576px) {
    margin-top: 30px;
  }
`

const ReferralContainer = styled(Card)`
  background: transparent;
  width: 100%;
`

const StyledFlexLayout = styled.div`
  display: grid;
  grid-template-columns: 30% 30% 30%;
  grid-column-gap: calc(5%);
  grid-auto-rows: 1fr;

  @media screen and (max-width: 763px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
`

const InviteSectionFlex = styled(Flex)`
  flex-direction: column;
  margin-top: 100px;
  @media screen and (max-width: 763px) {
    align-items: center;
    margin-top: 50px;
  }
`
const StyledBoldText = styled(Text)`
  font-size: 28px;
  font-weight: 700;

  @media screen and (max-width: 1180px) {
    align-items: center;
    font-size:calc(14px + 1.5vw);
  }  

  @media screen and (max-width: 400px) {
    align-items: center;
    font-size:calc(14px + 1vw);
  }

  @media screen and (max-width: 320px) {
    align-items: center;
    font-size:calc(12px + 1vw);
  }

  @media screen and (max-width: 325px) {
    align-items: center;
    font-size:calc(11px + 1vw);
  }

  @media screen and (max-width: 280px) {
    align-items: center;
    font-size:calc(10px + 1vw);
  }
`

const StyledRegularText = styled(Text)`
  font-size: 16px;
  font-weight: 400; 

  @media screen and (max-width: 400px) {
    align-items: center;
    font-size:calc(12px + 1vw);
  }

  @media screen and (max-width: 320px) {
    align-items: center;
    font-size:calc(10px + 1vw);
  }
`

const InfoCardsSection = styled(Flex)`
  display: grid;
  grid-template-columns: 30% 30% 30%;
  grid-column-gap: calc(5%);
  grid-auto-rows: 1fr;

  @media screen and (max-width: 763px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
`

const ShareLinkSection = styled(Card)`
  margin-top: 50px;
  margin-bottom: 70px;
  justify-content: space-between;
  text-align: center;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  max-width: 750px;
  padding: 30px;
`

const RoundInfoCardSection = styled(Flex)`
  display: grid;
  grid-template-columns: 22% 22% 22% 22%;
  grid-column-gap: calc(4%);
  grid-auto-rows: 1fr;

  @media screen and (max-width: 950px) {
    grid-template-columns: 48% 48%;
    grid-row-gap: 20px;
  }

  @media screen and (max-width: 763px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
`

const StyledInput = styled(Input)`
  width: 570px;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.bridgeInputBg};
  
  @media screen and (max-width: 420px) {
    width: 100%;
  }
`

const StyledButton = styled(Button)`
  height: 60px;
  background-color: ${({ theme }) => theme.colors.bridgeInputBg};
  border-radius: 10px;
  margin-left: 5px;
`

const StyledTabSection = styled(Flex)`
  justify-content: center;
  flex-direction: column;
  margin-bottom: 50px;
`

const StyledTab = styled(Flex) <{ isActive?: boolean }>`
  font-size: 24px;
  border-bottom: 2px solid ${({ theme, isActive }) => isActive ? theme.colors.primary : theme.colors.cardBorder2};
  padding-bottom: 15px;
  border-radius: 0;
  width: 100%;
  alignItems: center;
  justify-content: center;
  cursor: pointer;
`

const TabText = styled(Text) <{ isActive?: boolean, isMobile?: boolean }>`
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  color: ${({ theme, isActive }) => isActive ? theme.colors.text : 'grey'};
`

const StyledTable = styled(Table) <{ isMobile: boolean }>`
  margin-bottom: ${({ isMobile }) => (isMobile ? '56px' : '10px')};  
  background: transparent;
`

const StyledTableHeader = styled.thead`
  height: 25px;
  font-size: 12px;    
  box-sizing: border-box;
  border-bottom: 1px solid ${({theme}) => theme.isDark ? '#1c1f2b' : '#f2f2f2'};
`

const TableWrapperCard = styled(Card)`
  margin-top: 20px;
  background: 
  margin-bottom: 32px;
  padding: 10px;
  border: ${({ theme }) => !theme.isDark ? '1px solid rgba(223,226,231,.8)' : 'none'};
  border-radius: 5px;
  box-shadow: ${({ theme }) => !theme.isDark ? '0 6px 8px 0 rgb(47 76 116 / 8%)' : 'none'};
  background: ${({ theme }) => theme.isDark ? 'transparent' : 'white'};
  
  @media screen and (max-width: 576px) {
    background: transparent;
    padding-left: 0;
    padding-right: 0;
    border: none;
    box-shadow: none;
  }
`

const StyledTr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.isDark ? '#1c1f2b' : '#f2f2f2'};
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
  overflow-wrap: anywhere;
`

const StyledTh = styled(Th) <{ isXs: boolean }>`
  padding-left: ${({ isXs }) => isXs ? '12px' : '23px'};
  padding-right: ${({ isXs }) => isXs ? '12px' : '23px'};
  padding-bottom: 5px;
`

const Referral: React.FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { isTablet, isMobile, isXs } = useMatchBreakpoints()
  const dispatch = useDispatch()
  const { theme, isDark } = useTheme()
  const location = useLocation()
  const width = useWidth()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout, t, "", width < 481)
  const [tab, setTab] = useState<string>('commission')
  const [sortBy, setSortBy] = useState<string>('email')
  const [reverseOrder, setReversOrder] = useState<boolean>(false)
  const [sortReferredBy, setSortReferredBy] = useState<string>('email')
  const [reverseReferredOrder, setReversReferredOrder] = useState<boolean>(false)

  const getTabs = () => {
    return [
      {
        value: 'commission',
        label: 'Commission History',
      },
      {
        value: 'referred',
        label: 'Referred Friends',
      }
    ]
  }

  const renderTab = (): JSX.Element => {
    return (
      <Flex>
        {getTabs().map((singleTab, index) => {
          return (
            <StyledTab isActive={tab === singleTab.value} onClick={() => setTab(singleTab.value)}>
              <TabText isActive={tab === singleTab.value} isMobile={isMobile}>{singleTab.label}</TabText>
            </StyledTab>
          )
        })}
      </Flex>
    )
  }


  // Render Commision Table
  const getCommissionData = () => {
    return [
      {
        dates: "Wed, Dec, 01",
        email: "ab***@***.com",
        commission: "0.0063848348843ECO"
      },
      {
        dates: "Thu, Dec, 02",
        email: "ab***@***.com",
        commission: "0.0263847778843ECO"
      },
      {
        dates: "Thu, Dec, 02",
        email: "ab***@***.com",
        commission: "0.063458348865ECO"
      }
    ]
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

  const renderCommissionTable = () => {
    const filteredData = getCommissionData();

    if (filteredData?.length > 0) {
      let sortedOrder = [...filteredData]

      if (sortBy !== 'none') {
        sortedOrder.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : b[sortBy] > a[sortBy] ? -1 : 0))
      }

      sortedOrder = reverseOrder ? [...sortedOrder].reverse() : sortedOrder

      return sortedOrder.map((arr) => {
        return (
          <StyledTr>
            {
              ["dates", "email", "commission"].map((header) => {
                return (
                  <StyledTd isXs={isXs} >
                    <Text fontSize="14px" fontWeight="400">{`${arr[header]}`}</Text>
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
            {t('No Data found.')}
          </Text>
        </Td>
      </tr>
    )
  }


  // render referred table
  const getReferredData = () => {
    return [
      {
        dates: "Wed, Dec, 01",
        email: "ab***@***.com"
      },
      {
        dates: "Thu, Dec, 02",
        email: "ab***@***.com"
      },
      {
        dates: "Thu, Dec, 02",
        email: "ab***@***.com"
      }
    ]
  }

  const handleReferredHeaderClick = (key: string) => {
    if (key !== sortReferredBy) {
      setSortReferredBy(key)
      setReversReferredOrder(false)
    } else if (key === sortReferredBy && !reverseReferredOrder) {
      setReversReferredOrder(true)
    } else {
      setSortReferredBy('none')
      setReversReferredOrder(false)
    }
  }

  const renderReferredTable = () => {
    const filteredData = getReferredData();

    if (filteredData?.length > 0) {
      let sortedOrder = [...filteredData]

      if (sortReferredBy !== 'none') {
        sortedOrder.sort((a, b) => (a[sortReferredBy] > b[sortReferredBy] ? 1 : b[sortReferredBy] > a[sortReferredBy] ? -1 : 0))
      }

      sortedOrder = reverseReferredOrder ? [...sortedOrder].reverse() : sortedOrder

      return sortedOrder.map((arr) => {
        return (
          <StyledTr>
            {
              ["dates", "email"].map((header) => {
                return (
                  <StyledTd isXs={isXs} >
                    <Text fontSize="14px" fontWeight="400">{`${arr[header]}`}</Text>
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
            {t('No Data found.')}
          </Text>
        </Td>
      </tr>
    )
  }

  // render main
  return (
    <Page>
      <StyledPage>
        <Header>
          <Flex flexDirection="column">
            <Flex>
              <StyledBoldText>{t(config.header1)}</StyledBoldText>
              <StyledBoldText ml="5px" color={theme.colors.primary}>{t('ECOSWAP')}</StyledBoldText>
            </Flex>
            <StyledBoldText mt="-5px">{t(config.header2)}</StyledBoldText>
            <StyledRegularText mt="10px">{t(config.header3)}</StyledRegularText>
          </Flex>
        </Header>
        <Body>
          <ReferralContainer>
            {account && <InfoCardsSection>
              {
                config.headerLabels.map((label, index) => {
                  return (
                    <InfoCard data={{ title: label, value: ["50", "$0.00", "50%"][index] }} />
                  )
                })
              }
            </InfoCardsSection>
            }
            {account && <Flex justifyContent="center">
              <ShareLinkSection>
                <Text fontSize="22px" fontWeight="500">{config.shareLink}</Text>
                <Flex mt="20px" mb="30px">
                  <StyledInput noBorder />
                  <StyledButton>{t('Copy')}</StyledButton>
                </Flex>
                <Text>{t('(Your code')}: 26qyaqyk)</Text>
              </ShareLinkSection>
            </Flex>
            }
            <StyledTabSection>
              {renderTab()}
              {tab === 'commission' ?
                <TableWrapperCard>
                  <StyledTable isMobile={isMobile}>
                    <StyledTableHeader>
                      {["dates", "email", "commission"].map((singleHeader, index) => {
                        return (
                          <StyledTh
                            onClick={() => handleHeaderClick(singleHeader)}
                            isXs={isXs}
                          >
                            <Text fontSize="14px" color={theme.colors.headerSubtleText} fontWeight="400">{singleHeader}</Text>
                          </StyledTh>
                        )
                      })}
                    </StyledTableHeader>
                    <tbody>{renderCommissionTable()}</tbody>
                  </StyledTable>
                </TableWrapperCard>
                :
                <TableWrapperCard>
                  <StyledTable isMobile={isMobile}>
                    <StyledTableHeader>
                      {["dates", "email"].map((singleHeader, index) => {
                        return (
                          <StyledTh
                            onClick={() => handleReferredHeaderClick(singleHeader)}
                            isXs={isXs}
                          >
                            <Text fontSize="14px" color={theme.colors.headerSubtleText} fontWeight="400">{singleHeader}</Text>
                          </StyledTh>
                        )
                      })}
                    </StyledTableHeader>
                    <tbody>{renderReferredTable()}</tbody>
                  </StyledTable>
                </TableWrapperCard>
              }
            </StyledTabSection>
            <RoundInfoCardSection>
              {
                config.roundButtons.map((button, index) => {
                  return (
                    <Flex justifyContent="center">
                      <RoundInfoCard data={{ title: button.text, icon: button.iconPath }} />
                    </Flex>
                  )
                })
              }

            </RoundInfoCardSection>
            <InviteSectionFlex>
              <Text fontSize="22px" fontWeight="500">{t('How to invite friends')}</Text>
              <Text fontSize="14px" fontWeight="400">{t('Invite Your Friends & Earn')}</Text>
            </InviteSectionFlex>
            <StyledFlexLayout>
              {
                config.steps.map((step, index) => {
                  return (
                    <StepCard step={step} />
                  )
                })
              }
            </StyledFlexLayout>
            <Flex justifyContent="center" flexDirection="column" mt="40px" mb={isMobile ? "20px" : account ? "40px" : "80px"} alignItems="center">
              {!account && <Button onClick={onPresentConnectModal} variant="primary" scale="xs" width="130px" height="38px" padding="10px 0px">{t('Connect Wallet')}</Button>}
            </Flex>
          </ReferralContainer>
        </Body>
      </StyledPage>
    </Page >
  )
}

export default Referral
