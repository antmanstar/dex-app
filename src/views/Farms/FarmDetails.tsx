import React, { useCallback } from 'react'
import { Flex, Heading, Skeleton, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import CardHeading from './components/FarmCard/CardHeading'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { getBalanceAmount } from '../../utils/formatBalance'
import { useFarmUser, usePriceCakeBusd } from '../../state/farms/hooks'
import StakedAction from './components/FarmTable/Actions/StakedAction'
import HarvestAction from './components/FarmTable/Actions/HarvestAction'
import { BIG_ZERO } from '../../utils/bigNumber'

interface IFarmDetails {
  data: any
  hideDetailsHeading?: boolean
  location?: any
  userDataReady: boolean
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
  border-bottom: 2px solid ${({ theme }) => theme.colors.cardBorder};
  & > div {
    width: 100%;
  }
`

const StyledDetailsWrapper = styled(Flex)`
  padding: 18px;
`

export const FarmDetails: React.FC<IFarmDetails> = (props: IFarmDetails) => {
  const { t } = useTranslation()
  const { data, hideDetailsHeading, location, userDataReady } = props
  const { account } = useActiveWeb3React()
  const { stakedBalance } = useFarmUser(data.pid)

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
      <StyledSingleRow justifyContent="center" flexDirection="column">
        <StakedAction location={location} {...data} displayApr={data.apr?.value} />
        {account && <HarvestAction {...data} userDataReady={userDataReady} />}
      </StyledSingleRow>
    )
  }

  return (
    <Flex flexDirection="column">
      {!hideDetailsHeading && <StyledPoolName>
        <CardHeading
          token={data.token}
          quoteToken={data.quoteToken}
          lpLabel={data.lpSymbol && data.lpSymbol.toUpperCase().replace('ECO', 'ECO')}
        />
      </StyledPoolName>}
      <StyledDetailsWrapper flexDirection="column">
        <StyledHeading mb="24px" fontSize="20px">
          {t('Pool Info')}
        </StyledHeading>
        <StyledSingleRow justifyContent="space-between">
          <StyledValue textAlign="left">{t('Total Staked')}:</StyledValue>
          {totalValueFormatted ? (
            <Flex flexDirection="column">
              <StyledValue textAlign="right">
                {totalValueFormatted ?
                  `${(Number(totalValueFormatted) / 2) || '0.00000000'  } ${data.token}`
                  : <Skeleton height={24} width={80} />
                }
              </StyledValue>
              <StyledValue textAlign="right">
                {
                  // TODO: Convert into ECO
                  totalValueFormatted ?
                    `${(Number(totalValueFormatted) / 2) || '0.00000000'  } ${data.quoteToken}`
                    : <Skeleton height={24} width={80} />
                }
              </StyledValue>
              <StyledValue textAlign="right">
                {
                  // TODO: Convert into USDT
                  totalValueFormatted ?
                  `≅ ${totalValueFormatted || '0.00000000'} USDT`
                  : <Skeleton height={24} width={80} />
                }
              </StyledValue>
            </Flex>
          ) : <Flex flexDirection="column">
            <StyledValue textAlign="right">
              <Skeleton height={24} width={80} />
            </StyledValue>
          </Flex>}
        </StyledSingleRow>
        <StyledSingleRow justifyContent="space-between">
          <StyledValue textAlign="left">{t('Staked')}:</StyledValue>
          <Flex flexDirection="column">
            {
              // TODO: Convert tokens
              displayBalance() ? (
              <>
                <StyledValue textAlign="right">≅ {displayBalance()} {t("LP")} {t("Tokens")}</StyledValue>
              </>
            ) : (
              <StyledValue textAlign="right">
                <Skeleton height={24} width={80} />
              </StyledValue>
            )}
          </Flex>
        </StyledSingleRow>
        <StyledSingleRow justifyContent="space-between">
          <StyledValue textAlign="left">{t('Pool Share')}:</StyledValue>
          <StyledValue textAlign="right">
            {
              totalValueFormatted && displayBalance() ?
                `${(Number(displayBalance()) / Number(totalValueFormatted)).toFixed(8)} %`
                : <Skeleton height={24} width={80} />
            }
          </StyledValue>
        </StyledSingleRow>
        <StyledSingleRow justifyContent="space-between">
        <StyledValue textAlign="left">{t('Earnings')}:</StyledValue>
          <Flex flexDirection="column">
            <StyledValue textAlign="right">{displayEarnings}</StyledValue>
          </Flex>
        </StyledSingleRow>
        {renderButtons()}
      </StyledDetailsWrapper>
    </Flex>
  )
}
