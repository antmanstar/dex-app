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

export interface FarmWithStakedValue extends DeserializedFarm {
  apr?: number
  lpRewardsApr?: number
  liquidity?: BigNumber
}

const StyledCard = styled(Card)<{isActive?: boolean}>`
  align-self: baseline;
  max-height: 105px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 2px solid ${({isActive}) => isActive ? "transparent" : "#4c5969"};
  
  &:hover {
    background: ${({theme}) => theme.colors.primary};
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0px 5px 12px rgb(126 142 177 / 20%);
    border: 2px solid transparent;
  }
`

const FarmCardInnerContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-around;
  padding: 12px 16px;
`

const ExpandingWrapper = styled.div`
  padding: 24px;
  border-top: 2px solid ${({ theme }) => theme.colors.cardBorder};
  overflow: hidden;
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

const FarmCard: React.FC<FarmCardProps> = ({ farm, displayApr, removed, cakePrice, account, onClick, isCardActive }) => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()

  const [showExpandableSection, setShowExpandableSection] = useState(false)

  const totalValueFormatted =
    farm.liquidity && farm.liquidity.gt(0)
      ? `$${farm.liquidity.toNumber().toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      : ''

  const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('ECO', '')
  const earnLabel = farm.dual ? farm.dual.earnLabel : t('ECO + Fees')

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: farm.quoteToken.address,
    tokenAddress: farm.token.address,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  const lpAddress = getAddress(farm.lpAddresses)
  // const isPromotedFarm = farm.token.symbol === 'ECO'

  return (
    <StyledCard isActive={isCardActive} onClick={onClick}>
      <FarmCardInnerContainer>
        <CardHeading
          lpLabel={lpLabel}
          multiplier={farm.multiplier}
          isCommunityFarm={farm.isCommunity}
          token={farm.token}
          quoteToken={farm.quoteToken}
        />
        <Flex justifyContent="space-between">
          {!removed && (
            <Flex justifyContent="flex-start" alignItems="start" flexDirection="column">
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
            </Flex>
          )}
          <Flex justifyContent="flex-start" flexDirection="column">
            <Text fontWeight="400">{t('Earn')}:</Text>
            <Text fontWeight="400">{earnLabel}</Text>
          </Flex>
        </Flex>
        {/* <CardActionsContainer */}
        {/*  farm={farm} */}
        {/*  lpLabel={lpLabel} */}
        {/*  account={account} */}
        {/*  cakePrice={cakePrice} */}
        {/*  addLiquidityUrl={addLiquidityUrl} */}
        {/* /> */}
      </FarmCardInnerContainer>

      {isMobile && isTablet &&<ExpandingWrapper>
        <ExpandableSectionButton
          onClick={() => setShowExpandableSection(!showExpandableSection)}
          expanded={showExpandableSection}
        />
        {showExpandableSection && (
          <DetailsSection
            removed={removed}
            bscScanAddress={getBscScanLink(lpAddress, 'address')}
            infoAddress={`/info/pool/${lpAddress}`}
            totalValueFormatted={totalValueFormatted}
            lpLabel={lpLabel}
            addLiquidityUrl={addLiquidityUrl}
          />
        )}
      </ExpandingWrapper>}
    </StyledCard>
  )
}

export default FarmCard
