import React from 'react'
import { Button, Flex, Heading, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { useDispatch, useSelector } from 'react-redux'
import CardHeading from './components/FarmCard/CardHeading'
import ConnectWalletButton from '../../components/ConnectWalletButton'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { setActiveBodyType } from '../../state/farms'

interface IFarmDetails {
  data: any
}

const StyledSingleRow = styled(Flex)`
  margin-bottom: 20px;
`

const StyledValue = styled(Text)`
  font-size: 14px;
`

const StyledHeading = styled(Heading)`
  font-size: 20px;
  font-weight: 500;
`

const StyledPoolName = styled(Flex)`
  padding: 18px;
  padding-bottom: 9px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderColor};
  & > div {
    width: 100%;
  }
`

const StyledDetailsWrapper = styled(Flex)`
  padding: 18px;
`

export const FarmDetails: React.FC<IFarmDetails> = (props: IFarmDetails) => {
  const { t } = useTranslation()
  const { data } = props
  const { account } = useActiveWeb3React()
  const dispatch = useDispatch()

  const renderButtons = () => {
    if (!account) {
      return (
        <StyledSingleRow justifyContent="center">{!account && <ConnectWalletButton width="100%" />}</StyledSingleRow>
      )
    }

    return (
      <StyledSingleRow justifyContent="center" flexDirection="column">
        <Flex justifyContent="space-evenly" mb="24px">
          <Button
            onClick={() => {
              dispatch(setActiveBodyType('stake'))
            }}
          >
            {t('Stake')}
          </Button>
          <Button onClick={() => dispatch(setActiveBodyType('unstake'))}>{t('Unstake')}</Button>
        </Flex>
        <Flex justifyContent="center">
          <Button onClick={() => dispatch(setActiveBodyType('claim'))}>{t('Claim')}</Button>
        </Flex>
      </StyledSingleRow>
    )
  }

  return (
    <Flex flexDirection="column">
      <StyledPoolName>
        <CardHeading
          token={data.token}
          quoteToken={data.quoteToken}
          lpLabel={data.lpSymbol && data.lpSymbol.toUpperCase().replace('ECO', 'ECO')}
        />
      </StyledPoolName>
      <StyledDetailsWrapper flexDirection="column">
        <StyledHeading mb="24px" fontSize="20px">
          {t('Pool Info')}
        </StyledHeading>
        <StyledSingleRow justifyContent="space-between">
          <StyledValue textAlign="left">{t('Total Staked')}:</StyledValue>
          <Flex flexDirection="column">
            <StyledValue textAlign="right">0.00000000 USDT</StyledValue>
            <StyledValue textAlign="right">0.00000000 ECO</StyledValue>
            <StyledValue textAlign="right">≅ 0.00000000 USDT</StyledValue>
          </Flex>
        </StyledSingleRow>
        <StyledSingleRow justifyContent="space-between">
          <StyledValue textAlign="left">{t('Staked')}:</StyledValue>
          <Flex flexDirection="column">
            <StyledValue textAlign="right">0 USDT</StyledValue>
            <StyledValue textAlign="right">0 ECO</StyledValue>
            <StyledValue textAlign="right">≅ 0.00000000 USDT</StyledValue>
          </Flex>
        </StyledSingleRow>
        <StyledSingleRow justifyContent="space-between">
          <StyledValue textAlign="left">{t('Pending Share')}:</StyledValue>
          <StyledValue textAlign="right">0 %</StyledValue>
        </StyledSingleRow>
        <StyledSingleRow justifyContent="space-between">
          <StyledValue textAlign="left">{t('Pending Claim')}:</StyledValue>
          <Flex flexDirection="column">
            <StyledValue textAlign="right">0.00000000 ECO</StyledValue>
            <StyledValue textAlign="right">≅ 0.00000000 USDT</StyledValue>
          </Flex>
        </StyledSingleRow>
        <StyledSingleRow justifyContent="space-between">
          <StyledValue textAlign="left">{t('Pending Affiliate Claim')}:</StyledValue>
          <Flex flexDirection="column">
            <StyledValue textAlign="right">0.00000000 ECO</StyledValue>
            <StyledValue textAlign="right">≅ 0.00000000 USDT</StyledValue>
          </Flex>
        </StyledSingleRow>
        {renderButtons()}
        <StyledSingleRow justifyContent="space-between">
          <StyledValue textAlign="left">{t('Staking Fee')}:</StyledValue>
          <StyledValue textAlign="right" color="green">
            0 %
          </StyledValue>
        </StyledSingleRow>
        <StyledSingleRow justifyContent="space-between">
          <StyledValue textAlign="left">{t('Referral Payments')}:</StyledValue>
          <StyledValue textAlign="right" color="red">
            0 %
          </StyledValue>
        </StyledSingleRow>
      </StyledDetailsWrapper>
    </Flex>
  )
}
