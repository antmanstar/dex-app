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
import useTheme from '../../../../hooks/useTheme'
import { TransparentCard } from '../../../../components/Card'
import { CurrencyLogo } from '../../../../components/Logo'

export interface FarmWithStakedValue extends DeserializedFarm {
  apr?: number
  lpRewardsApr?: number
  liquidity?: BigNumber
}

const StyledCard = styled(Card)<{ isActive?: boolean }>`
  align-self: baseline;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid #131823;
  background-color: ${({ isActive , theme }) => theme.colors.backgroundAlt};;

  &:hover {
    // background: ${({ theme }) => theme.colors.primary};
    transform: translateY(-5px);
    box-shadow: 0px 5px 12px rgb(126 142 177 / 20%);
    border-color: ${({ theme }) => theme.colors.primary};
        
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

const StyledCardSummary = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 34px;
  grid-row-gap: 26px;
  padding-top: 10px;
  margin-top: 10px;
  
  @media screen and (max-width: 1024px) {
    grid-column-gap: 26px;
  }

  @media screen and (max-width: 567px) {
    grid-column-gap: 26px;
    grid-template-columns: 1fr 1fr;
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
  const { theme } = useTheme()

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

  return (
    <StyledCard isActive={isCardActive} onClick={onClick}>
      <FarmCardInnerContainer>
        <CardHeading
          lpLabel={lpLabel.replace('LP', '')}
          multiplier={farm.multiplier}
          isCommunityFarm={farm.isCommunity}
          token={farm.token}
          quoteToken={farm.quoteToken}
          isCardActive={isCardActive}
        />
        <StyledCardSummary>
          <Flex justifyContent="flex-start" flexDirection="column">
            <Text fontSize="14px" fontWeight="400">{t('Daily ROI')}</Text>
            <Text fontSize="18px" fontWeight="700" color={theme.colors.purple}>2.53%</Text>
          </Flex>
          <Flex justifyContent="flex-start" flexDirection="column">
            <Text fontSize="14px" fontWeight="400">{t('Liquidity')}</Text>
            <Text fontSize="18px" fontWeight="700" color={theme.colors.green}>$35,256,822</Text>
          </Flex>
          <Flex justifyContent="flex-start" flexDirection="column">
            <Text fontSize="14px" fontWeight="400">{t('Rewards')}</Text>
            <Text fontSize="18px" fontWeight="700" color={theme.colors.yellow}>652 ECO</Text>
          </Flex>
          <Flex justifyContent="flex-start" flexDirection="column">
            <Text fontSize="14px" fontWeight="400">{t('APR')}</Text>
            <Text fontSize="22px" fontWeight="700" color={theme.colors.purple}>2.53%</Text>
          </Flex>
          <Flex justifyContent="flex-start" flexDirection="column">
            <Text fontSize="14px" fontWeight="400">{t('Staked')}</Text>
            <Text fontSize="18px" fontWeight="700" color={theme.colors.green}>$35,256,822</Text>
          </Flex>
          <Flex justifyContent="flex-start" flexDirection="column">
            <Text fontSize="14px" fontWeight="400">{t('Share')}</Text>
            <Text fontSize="18px" fontWeight="700" color={theme.colors.yellow}>5.3%</Text>
          </Flex>
        </StyledCardSummary>
      </FarmCardInnerContainer>
    </StyledCard>
  )
}

export default FarmCard
