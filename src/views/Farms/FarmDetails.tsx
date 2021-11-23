import React, { useCallback, useState } from 'react'
import { Flex, Heading, Skeleton, Text, Button, Link } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import CardHeading from './components/FarmCard/CardHeading'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { getBalanceAmount, getBalanceNumber } from '../../utils/formatBalance'
import { useFarmUser, usePriceCakeBusd } from '../../state/farms/hooks'
import StakedAction from './components/FarmTable/Actions/StakedAction'
import HarvestAction from './components/FarmTable/Actions/HarvestAction'
import { BIG_ZERO } from '../../utils/bigNumber'
import Earned from './components/FarmTable/Earned'
import useTheme from '../../hooks/useTheme'

interface IFarmDetails {
  data: any
  hideDetailsHeading?: boolean
  location?: any
  userDataReady: boolean
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
  border: 1px solid #131823;
  border-radius: 10px;
  & > div {
    width: 100%;
  }
`

const StyledCardSummary = styled.div`
  padding:25px;
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
  border-bottom: 1px solid #363636;
`

const StyledCardInfoWrapper = styled(Flex)`
  padding:20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 10px;
  padding-top: 10px;

  @media screen and (max-width: 567px) {
    grid-template-columns: 1fr;
  }
`

const StyledCardInfo = styled(Flex)`  
  margin-top: 50px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const StyledControlFlex = styled(Flex)`  
  padding-left: 10px;
  flex-direction: column;
  justify-content: space-between;
`

export const FarmDetails: React.FC<IFarmDetails> = (props: IFarmDetails) => {
  const { t } = useTranslation()
  const { data, hideDetailsHeading, location, userDataReady } = props
  const { account } = useActiveWeb3React()
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

  const totalValueFormatted =
    data.liquidity && data.liquidity.gt(0)
      ? `$${data.liquidity.toNumber().toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      : ''

  const renderButtons = () => {
    return (
      <>
        <Flex justifyContent="center" flexDirection="column">
          <StakedAction location={location} {...data} displayApr={data.apr?.value} userDataReady={userDataReady} />
        </Flex>
        <Flex justifyContent="center" flexDirection="column">
          {account && <HarvestAction {...data} userDataReady={userDataReady} />}
        </Flex>
      </>
    )
  }

  const showCalc = () => {
    setShowRoiCalculator(true)
  }

  return (
    <StyledDtailFlex flexDirection="column" >
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
        <Flex justifyContent="flex-start" flexDirection="column">
          <Text fontSize="14px" fontWeight="500" color={theme.colors.headerSubtleText} mt="3px" mb="3px">{t('Liquidity')}</Text>
          <Text fontSize="18px" fontWeight="700" mt="3px" mb="3px">$35,256,822</Text>
        </Flex>
        <Flex justifyContent="flex-start" flexDirection="column">
          <Text fontSize="14px" fontWeight="500" color={theme.colors.headerSubtleText} mt="3px" mb="3px">{t('Rewards')}</Text>
          {
            getBalanceNumber(new BigNumber(data.userData.earnings)) ?
              <Text fontSize="18px" fontWeight="700" mt="3px" mb="3px">{getBalanceNumber(new BigNumber(data.userData.earnings))}</Text> : <Skeleton height={24} width={80} mt="3px" mb="3px" />
          }
        </Flex>
        <Flex justifyContent="flex-start" flexDirection="column">
          <Text fontSize="14px" fontWeight="500" color={theme.colors.headerSubtleText} mt="3px" mb="3px">{t('Daily ROI')}</Text>
          <Text fontSize="18px" fontWeight="700" mt="3px" mb="3px">2.586%</Text>
        </Flex>
        <Flex justifyContent="flex-start" flexDirection="column">
          <Text fontSize="14px" fontWeight="500" color={theme.colors.headerSubtleText} mt="3px" mb="3px">{t('APR')}</Text>
          <Text fontSize="18px" fontWeight="700" mt="3px" mb="3px">6.25%</Text>
        </Flex>
      </ StyledCardSummary>
      <StyledCardInfoWrapper>
        <StyledCardInfo>
          <Flex justifyContent="flex-start" flexDirection="column" mb="20px" alignItems="center">
            <Text fontSize="14px" fontWeight="500" color={theme.colors.headerSubtleText} mt="3px" mb="3px">{t('Staked')}</Text>
            {
              displayBalance() ?
                <Text fontSize="18px" fontWeight="700" mt="3px" mb="3px">{displayBalance()}</Text> : <Skeleton height={24} width={80} mt="3px" mb="3px" />
            }
            <Text fontSize="14px" fontWeight="500" color={theme.colors.headerSubtleText} mt="3px" mb="3px">{t('$USD')}</Text>
          </Flex>
          <Flex justifyContent="flex-start" flexDirection="column" alignItems="center">
            <Text fontSize="14px" fontWeight="500" color={theme.colors.headerSubtleText} mt="3px" mb="3px">{t('Your Share')}</Text>
            {
              totalValueFormatted && displayBalance() ?
                <Text fontSize="18px" fontWeight="700" mt="3px" mb="3px">{`${(Number(displayBalance()) / Number(totalValueFormatted)).toFixed(8)} %`}</Text> : <Skeleton height={24} width={80} mt="3px" mb="3px" />
            }
          </Flex>
        </StyledCardInfo>
        <StyledControlFlex>
          <Flex justifyContent="space-between">
            <Button variant="primary" scale="xs" width="100px" padding="0px"><Text fontSize="9px" fontWeight="500">{t('Add Liquidity')}</Text></Button>
            <Button variant="primary" scale="xs" width="100px" padding="0px"><Text fontSize="9px" fontWeight="500">{t('Remove Liquidity')}</Text></Button>
          </Flex>
          <Flex justifyContent="flex-start" flexDirection="column" mb="30px" mt="30px" alignItems="center">
            <Text fontSize="14px" fontWeight="500" color={theme.colors.headerSubtleText} mt="3px" mb="3px">{t('Pending Rewards')}</Text>
            {
              displayBalance() ?
                <Text fontSize="18px" fontWeight="700" mt="3px" mb="3px">0 ECO</Text> : <Skeleton height={24} width={80} mt="3px" mb="3px" />
            }
            <Text fontSize="14px" fontWeight="500" color={theme.colors.headerSubtleText} mt="3px" mb="3px">{t('$USD')}</Text>
          </Flex>
          <Flex justifyContent="center" flexDirection="column" alignItems="center">
            <Button variant="primary" scale="md" width="125px" height="35px" mt="10px">{t('Harvest')}</Button>
          </Flex>
        </StyledControlFlex>
      </StyledCardInfoWrapper>
      {/* {showRoiCalculator && <RoiCalculatorModal
        linkLabel={t('Get %symbol%', { symbol: data.lpSymbol })}
        stakingTokenBalance={new BigNumber(0)}
        stakingTokenSymbol={data.lpSymbol && data.lpSymbol.toUpperCase().replace('LP', '')}
        stakingTokenPrice={100}
        multiplier={data.multiplier}
        earningTokenPrice={cakePrice.toNumber()}
        apr={10}
        linkHref="#"
        isFarm
        initialValue='0'
        onBack={() => setShowRoiCalculator(false)}
      />} */}
    </StyledDtailFlex>
  )
}

