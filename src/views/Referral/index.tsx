import React from 'react'
import { useLocation } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import {
  Text,
  Button,
  ArrowBackIcon,
  Flex,
  Card,
  useMatchBreakpoints,
  useWalletModal
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import Page from 'views/Page'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'
import { useDispatch } from 'react-redux'
import StepCard from './components/StepCard'
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
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid #131823;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 18px;
  padding-top:25px;
  border-radius: 5px;
  padding-bottom: 25px;
  padding-right: 18px;

  @media screen and (max-width: 968px) {
    margin-top: 0;
    padding: 5px 10px 10px 5px
  }
`

const Body = styled(`div`)`
  border-radius: 10px;
  margin-top: 50px;

  @media screen and (max-width: 576px) {
    margin-top: 30px;
  }
`

const ReferralContainer = styled(Card)`
  background: #00000000;
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
  @media screen and (max-width: 763px) {
    align-items: center;
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
            <InviteSectionFlex>
              <Text fontSize="22px" fontWeight="500">{t('How to invite friends')}</Text>
              <Text fontSize="14px" fontWeight="400">{t('Invite Your Friends & Earn')}</Text>
            </InviteSectionFlex>
            <StyledFlexLayout>
              {
                config.steps.map((step, index) => {
                  return (
                    <StepCard step={step}/>
                  )
                }) 
              }
            </StyledFlexLayout>
            <Flex justifyContent="center" flexDirection="column" mt="40px" mb={isMobile ? "20px" : "80px"} alignItems="center">
              <Button onClick={onPresentConnectModal} variant="primary" scale="xs" width="130px" height="38px" padding="10px 0px">{t('Connect Wallet')}</Button>
            </Flex>
          </ReferralContainer>
        </Body>
      </StyledPage>
    </Page>
  )
}

export default Referral
