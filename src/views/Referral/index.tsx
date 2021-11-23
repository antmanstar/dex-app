import React from 'react'
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
  useWalletModal
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
  width: 580px;
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
`

const Referral: React.FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { isTablet, isMobile } = useMatchBreakpoints()
  const dispatch = useDispatch()
  const { theme, isDark } = useTheme()
  const location = useLocation()
  const width = useWidth()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout, t, "", width < 481)


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
                  <StyledInput noBorder/>
                  <StyledButton>{t('Copy')}</StyledButton>
                </Flex>
                <Text>{t('(Your code')}: 26qyaqyk)</Text>
              </ShareLinkSection>
            </Flex>
            }
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
            <Flex justifyContent="center" flexDirection="column" mt="40px" mb={isMobile ? "20px" : account? "40px" : "80px"} alignItems="center">
              {!account && <Button onClick={onPresentConnectModal} variant="primary" scale="xs" width="130px" height="38px" padding="10px 0px">{t('Connect Wallet')}</Button>}
            </Flex>
          </ReferralContainer>
        </Body>
      </StyledPage>
    </Page >
  )
}

export default Referral
