import React, { useCallback, useState } from 'react'
import { Flex, Heading, Skeleton, Text, Button, Link } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import { Link as RouterLink } from 'react-router-dom'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import CardHeading from './components/FarmCard/CardHeading'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { getBalanceAmount, getBalanceNumber } from '../../utils/formatBalance'
import { useFarmUser, usePriceCakeBusd } from '../../state/farms/hooks'
import StakedAction from './components/FarmTable/Actions/StakedAction'
import HarvestAction from './components/FarmTable/Actions/HarvestAction'
import { BIG_TEN, BIG_ZERO } from '../../utils/bigNumber'
import Earned from './components/FarmTable/Earned'
import useTheme from '../../hooks/useTheme'
import ApyButton from './components/FarmCard/ApyButton'
import getLiquidityUrlPathParts from '../../utils/getLiquidityUrlPathParts'
import { BASE_ADD_LIQUIDITY_URL } from '../../config'
import { getDisplayApr } from './hooks/getDisplayApr'

interface IFarmDetails {
  data: any
  hideDetailsHeading?: boolean
  location?: any
  userDataReady: boolean
  addLiquidityUrl: string
  lpLabel: string
}

const StyledFarmName = styled(Flex)`
  display: flex;
  justifyContent: space-between;
  padding: 20px;

  & > div {
    width: 100%;
  }
`

const StyledDtailFlex = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 10px;

  & > div {
    width: 100%;
  }
`

const StyledCardSummary = styled.div`
  padding: 25px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-column-gap: 34px;
  grid-row-gap: 10px;
  padding-top: 10px;

  @media screen and (max-width: 1024px) {
    grid-column-gap: 26px;
  }

  @media screen and (max-width: 567px) {
    grid-column-gap: 26px;
    grid-template-columns: 1fr 1fr;
  }
  border-bottom: 1px solid ${({ theme }) => theme.colors.background};
`

const StyledCardInfoWrapper = styled(Flex)`
  padding: 16px;
  display: flex;
  flex-direction: column;
`

const StyledCardInfo = styled(Flex)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 8px;
  padding-top: 16px;
  justify-content: center;
  justify-items: center;

  //@media screen and (max-width: 567px) {
  //  grid-template-columns: 1fr;
  //}
`

export const FarmDetails: React.FC<IFarmDetails> = (props: IFarmDetails) => {
  const { t } = useTranslation()
  const { data, hideDetailsHeading, location, userDataReady, lpLabel, addLiquidityUrl } = props
  const { stakedBalance } = useFarmUser(data.pid)
  const { theme } = useTheme()
  const [showRoiCalculator, setShowRoiCalculator] = useState(false)

  const displayBalance = useCallback(() => {
    const stakedBalanceBigNumber = getBalanceAmount(stakedBalance)
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0000001)) {
      return '<0.0000001'
    }
    if (stakedBalanceBigNumber.gt(0)) {
      return stakedBalanceBigNumber.toFixed(8, BigNumber.ROUND_DOWN)
    }
    return stakedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
  }, [stakedBalance])

  const liquidityNumber = !Number.isNaN(Number(data.liquidity)) ? data.liquidity : '0'
  const poolShare = parseFloat(stakedBalance.div(data.totalStakedTokenInLp).div(BIG_TEN.pow(Number(data?.token?.decimals) - 2)).toFixed(2))

  const earningsBigNumber = new BigNumber(data?.userData.earnings)
  const cakePrice = usePriceCakeBusd()
  let earnings = BIG_ZERO
  let earningsBusd = 0
  let displayEarnings = userDataReady ? earnings.toLocaleString() : <Skeleton width={60} />

  // If user didn't connect wallet default balance will be 0
  if (!earningsBigNumber.isZero()) {
    earnings = getBalanceAmount(earningsBigNumber)
    earningsBusd = earnings.multipliedBy(cakePrice).toNumber()
    displayEarnings = earnings.toFixed(3, BigNumber.ROUND_DOWN)
  }

  const showCalc = () => {
    setShowRoiCalculator(true)
  }

  return (
    <StyledDtailFlex flexDirection='column'>
      {!hideDetailsHeading && <StyledFarmName>
        <CardHeading
          token={data.token}
          quoteToken={data.quoteToken}
          lpLabel={data.lpSymbol && data.lpSymbol.toUpperCase().replace('LP', '')}
        />
        <Flex onClick={showCalc} justifyContent="flex-end">
          <img
            width="30px"
            src='/images/math.png'
            alt='Caculator'
          />
        </Flex>
      </StyledFarmName>}
      <StyledCardSummary>
        <Flex justifyContent='flex-start' flexDirection='column'>
          <Text
            fontSize='14px'
            fontWeight='500'
            color={theme.colors.headerSubtleText}
            mt='3px'
            mb='3px'
          >
            {t('Liquidity')}
          </Text>
          <Text fontSize='18px' fontWeight='700' mt='3px' mb='3px'>${liquidityNumber}</Text>
        </Flex>
        <Flex justifyContent='flex-start' flexDirection='column'>
          <Text
            fontSize='14px'
            fontWeight='500'
            color={theme.colors.headerSubtleText}
            mt='3px'
            mb='3px'
          >
            {t('Rewards')}
          </Text>
          {displayEarnings ? (
            <Text
              fontSize='18px'
              fontWeight='700'
              mt='3px'
              mb='3px'
            >
              {displayEarnings} ECO
            </Text>
          ) : (<Skeleton height={24} width={80} mt="3px" mb="3px"/>)}
        </Flex>
        <Flex justifyContent='flex-start' flexDirection='column'>
          <Text fontSize='14px' fontWeight='500' color={theme.colors.headerSubtleText} mt='3px'
                mb='3px'>{t('Daily ROI')}</Text>
          <Text fontSize='18px' fontWeight='700' mt='3px' mb='3px'>2.586%</Text>
        </Flex>
        <Flex justifyContent='flex-start' flexDirection='column'>
          <Text fontSize='14px' fontWeight='500' color={theme.colors.headerSubtleText} mt='3px'
                mb='3px'>{t('APR')}</Text>
          <Text mt='3px' mb='3px'>
            {(data.apr || data.apr === 0) ? (
              <ApyButton
                variant="text-and-button"
                pid={data.pid}
                lpSymbol={data.lpSymbol}
                multiplier={data.multiplier}
                lpLabel={lpLabel}
                addLiquidityUrl={addLiquidityUrl}
                cakePrice={cakePrice}
                apr={data.apr}
                displayApr={getDisplayApr(data.apr, data.lpRewardsApr)}
                fontSize="18px"
              />
            ) : (
              <Skeleton height={24} width={80} />
            )}
          </Text>
        </Flex>
      </ StyledCardSummary>
      <StyledCardInfoWrapper>
        <Flex justifyContent='flex-end' alignItems="end">
          <Button
            as={RouterLink}
            variant="active-text"
            scale="xs"
            to={`/add/${data.token.address}/${data.quoteToken.address}`}
            px="4px"
          >
            {t('Add Liquidity')}
          </Button>
          <Button
            as={RouterLink}
            variant="active-text"
            scale="xs"
            to={`/remove/${data.token.address}/${data.quoteToken.address}`}
            px="4px"
          >
            {t('Remove Liquidity')}
          </Button>
        </Flex>
        <Flex flexDirection="column">
          <StyledCardInfo>
            <Flex justifyContent='flex-start' flexDirection='column' mb='20px' alignItems='center'>
              <Text
                fontSize='14px'
                fontWeight='500'
                color={theme.colors.headerSubtleText}
              >
                {t('Staked')}
              </Text>
              {
                displayBalance() ?
                  <Text fontSize='18px' fontWeight='700' mt='3px' mb='3px'>{parseFloat(displayBalance())} LP</Text> :
                  <Skeleton height={24} width={80} mt='3px' mb='3px' />
              }
            </Flex>
            <Flex justifyContent='flex-start' flexDirection='column' mb='20px' alignItems='center'>
              <Text
                fontSize='14px'
                fontWeight='500'
                color={theme.colors.headerSubtleText}
              >
                {t('Pending Rewards')}
              </Text>
              {
                displayBalance() ?
                  <Text fontSize='18px' fontWeight='700' mt='3px' mb='3px'>0 ECO</Text> :
                  <Skeleton height={24} width={80} mt='3px' mb='3px' />
              }
            </Flex>
            <Flex justifyContent='flex-start' flexDirection='column' alignItems='center'>
              <Text fontSize='14px' fontWeight='700' color={theme.colors.headerSubtleText} mt='3px'
                    mb='3px'>{t('Your Share')}</Text>
              {poolShare || 0}%
            </Flex>
            <Flex justifyContent='center' flexDirection='column' mt='3px' mb='3px' alignItems='center' width="108px">
              <HarvestAction {...data} userDataReady={userDataReady} />
            </Flex>
          </StyledCardInfo>
        </Flex>
      </StyledCardInfoWrapper>
    </StyledDtailFlex>
  )
}
