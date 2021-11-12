import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Card, Flex, Text, Skeleton, useMatchBreakpoints } from '@pancakeswap/uikit'
import { DeserializedFarm } from 'state/types'
import { getBscScanLink } from 'utils'
import { useTranslation } from 'contexts/Localization'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { getAddress } from 'utils/addressHelpers'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import ApyButton from './ApyButton'
import { useWidth } from '../../../../hooks/useWidth'
import { TransparentCard } from '../../../../components/Card'
import { CurrencyLogo } from '../../../../components/Logo'

export interface FarmWithStakedValue extends DeserializedFarm {
  apr?: number
  lpRewardsApr?: number
  liquidity?: BigNumber
}

const StyledCardSummary = styled(Flex)``

const StyledCard = styled(Card)<{ isActive?: boolean }>`
  align-self: baseline;
  //max-height: 105px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 2px solid ${({ isActive , theme}) => (isActive ? 'transparent' : theme.colors.cardBorder)};
  background-color: ${({ isActive , theme }) => (isActive ? "#59F3" : 'transparent')};;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0px 5px 12px rgb(126 142 177 / 20%);
    border: 2px solid transparent;
    
    ${StyledCardSummary} {
      ${Text} {
        color: ${({ theme }) => theme.colors.primaryButtonText };
      }
    }
    
    h2 {
      color: ${({ theme }) => theme.colors.primaryButtonText };
    }
    
    svg {
      fill: ${({ theme }) => theme.colors.primaryButtonText };
    }
  }
  
  svg {
    fill: ${({ theme, isActive }) => isActive ? theme.colors.primaryButtonText : theme.colors.text };
  }

  ${StyledCardSummary} {
    ${Text} {
      //color: ${({ theme, isActive }) => (isActive ? theme.colors.primaryButtonText : theme.colors.text)};
    }
  }
`

const FarmCardInnerContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-around;
  padding: 12px 16px;
`

const ExpandingWrapper = styled.div<{ isCardActive?: boolean }>`
  padding: 12px 16px;
  border-top: 2px solid ${({ isCardActive, theme }) => (isCardActive ? theme.colors.text : '#4c5969')};
  overflow: hidden;
`

const StyledDetailsContainer = styled(Flex)`
  border-radius: 10px;
  padding: 12px;
  background-color: ${({theme}) => theme.colors.backgroundAlt};
  justify-content: space-between;
  min-width: 400px;
  ${({theme}) => theme.mediaQueries.md} {
    min-width: 500px;
  }
`

const SingleDetailWrapper = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  align-items: start;
  padding: 0px 24px;
`

const StyledDesktopCard = styled(TransparentCard)<{isActive?: boolean}>`
  padding: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-radius: 10px;
  margin-bottom: 24px;
  
  ${({isActive, theme}) => {
    if (isActive) {
      return `
        background: ${theme.colors.gradients.poolHover};
        
        ${StyledDetailsContainer} {
          background: rgba(3, 3, 3, 0.2);
        }
        ${Text} {
          color: white
        }
      `
    }
    
    return ''
  }}
  
  &:hover {
    background: ${({ theme }) => theme.colors.gradients.poolHover};
    ${StyledDetailsContainer} {
      background: rgba(3, 3, 3, 0.2);
    }
    ${Text} {
      color: white
    }
  }
`

interface FarmCardProps {
  farm: FarmWithStakedValue
  displayApr: string
  removed: boolean
  cakePrice?: BigNumber
  account?: string
  onClick?: () => void
  isCardActive?: boolean
}

const FarmCard: React.FC<FarmCardProps> = ({
  farm,
  displayApr,
  removed,
  cakePrice,
  account,
  onClick,
  isCardActive,
}) => {
  const { t } = useTranslation()
  const width = useWidth()

  const [showExpandableSection, setShowExpandableSection] = useState(false)

  const totalValueFormatted =
    farm.liquidity && farm.liquidity.gt(0)
      ? `$${farm.liquidity.toNumber().toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      : ''

  const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('ECO', 'ECO')
  const earnLabel = farm.dual ? farm.dual.earnLabel : t('ECO + Fees')

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: farm.quoteToken.address,
    tokenAddress: farm.token.address,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  const lpAddress = getAddress(farm.lpAddresses)
  // const isPromotedFarm = farm.token.symbol === 'ECO'

  if (width > 968) {
    return (
      <StyledDesktopCard isActive={isCardActive} onClick={onClick}>
        <Flex flexDirection="column" justifyContent="center" alignItems="start" paddingLeft="12px">
          <div>
            <CurrencyLogo currency={farm.token} />
            <CurrencyLogo currency={farm.quoteToken} />
          </div>
          <Text fontSize="20px" fontWeight="600">
            {farm.token?.symbol?.toUpperCase()}-{farm.quoteToken?.symbol?.toUpperCase()}
          </Text>
          <Text fontSize="12px" color="textSubtle2" bold>
            {t('Farm')}
          </Text>
        </Flex>
        <StyledDetailsContainer>
          <SingleDetailWrapper>
            {totalValueFormatted ?
              <Text fontSize='20px' bold>${totalValueFormatted}</Text>
              : <Skeleton height={24} width={80} />
            }
            <Text fontSize="14px" mt="4px" bold>
              {t('Liquidity')}
            </Text>
          </SingleDetailWrapper>
          <SingleDetailWrapper>
            <Text fontSize="20px" bold>{earnLabel}</Text>
            <Text fontSize="14px" mt="2px" bold>{t('Earn')}:</Text>
          </SingleDetailWrapper>
          <SingleDetailWrapper>
            {farm.apr ? (
              <ApyButton
                variant="text-and-button"
                pid={farm.pid}
                lpSymbol={farm.lpSymbol}
                multiplier={farm.multiplier}
                lpLabel={lpLabel}
                addLiquidityUrl={addLiquidityUrl}
                cakePrice={cakePrice}
                apr={farm.apr}
                displayApr={displayApr}
              />
            ) : (
              <Skeleton height={24} width={80} />
            )}
            <Text fontSize="14px" mt="4px" bold>
              {t('APR')}
            </Text>
          </SingleDetailWrapper>
        </StyledDetailsContainer>
      </StyledDesktopCard>
    )
  }

  return (
    <StyledCard isActive={isCardActive} onClick={onClick}>
      <FarmCardInnerContainer>
        <CardHeading
          lpLabel={lpLabel}
          multiplier={farm.multiplier}
          isCommunityFarm={farm.isCommunity}
          token={farm.token}
          quoteToken={farm.quoteToken}
          isCardActive={isCardActive}
        />
        <Flex justifyContent="space-between">
          {!removed && (
            <StyledCardSummary justifyContent="flex-start" alignItems="start" flexDirection="column">
              <Text fontWeight="400">{t('APR')}:</Text>
              <Text fontWeight="400" style={{ display: 'flex', alignItems: 'center' }}>
                {farm.apr ? (
                  <ApyButton
                    variant="text-and-button"
                    pid={farm.pid}
                    lpSymbol={farm.lpSymbol}
                    multiplier={farm.multiplier}
                    lpLabel={lpLabel}
                    addLiquidityUrl={addLiquidityUrl}
                    cakePrice={cakePrice}
                    apr={farm.apr}
                    displayApr={displayApr}
                  />
                ) : (
                  <Skeleton height={24} width={80} />
                )}
              </Text>
            </StyledCardSummary>
          )}
          <StyledCardSummary justifyContent="flex-start" flexDirection="column">
            <Text fontWeight="400">{t('Earn')}:</Text>
            <Text fontWeight="400">{earnLabel}</Text>
          </StyledCardSummary>
        </Flex>
        {/* <CardActionsContainer */}
        {/*  farm={farm} */}
        {/*  lpLabel={lpLabel} */}
        {/*  account={account} */}
        {/*  cakePrice={cakePrice} */}
        {/*  addLiquidityUrl={addLiquidityUrl} */}
        {/* /> */}
      </FarmCardInnerContainer>

      {/* <ExpandingWrapper isCardActive={isCardActive}> */}
      {/*  <ExpandableSectionButton */}
      {/*    onClick={() => setShowExpandableSection(!showExpandableSection)} */}
      {/*    expanded={showExpandableSection} */}
      {/*    isCardActive={isCardActive} */}
      {/*  /> */}
      {/*  {showExpandableSection && ( */}
      {/*    <DetailsSection */}
      {/*      removed={removed} */}
      {/*      bscScanAddress={getBscScanLink(lpAddress, 'address')} */}
      {/*      infoAddress={`/info/pool/${lpAddress}`} */}
      {/*      totalValueFormatted={totalValueFormatted} */}
      {/*      lpLabel={lpLabel} */}
      {/*      addLiquidityUrl={addLiquidityUrl} */}
      {/*    /> */}
      {/*  )} */}
      {/* </ExpandingWrapper> */}
    </StyledCard>
  )
}

export default FarmCard
