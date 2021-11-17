import React from 'react'
import styled from 'styled-components'
import { Tag, Flex, Heading, Skeleton, Link } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import { CommunityTag, CoreTag } from 'components/Tags'
import { TokenPairImage } from 'components/TokenImage'
import { CurrencyLogo, DoubleCurrencyLogo } from '../../../../components/Logo'
import { Field } from '../../../../state/mint/actions'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  isCommunityFarm?: boolean
  token: Token
  quoteToken: Token
  isCardActive?: boolean
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

const StyledHeading = styled(Heading) <{ isCardActive?: boolean }>`
  color: ${({ theme, isCardActive }) => (isCardActive ? theme.colors.primaryButtonText : theme.colors.text)};
`

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  multiplier,
  isCommunityFarm,
  token,
  quoteToken,
  isCardActive,
}) => {
  return (
    <Wrapper alignItems="center" mb="4px">
      <Link href="localhost:3000" fontSize="18px" fontWeight="600" >
        <Flex>
          <CurrencyLogo currency={token} size="28px" style={{ marginRight: '-8px' }} />
          <CurrencyLogo currency={quoteToken} size="28px" style={{ marginRight: '0' }} />
        </Flex>
        <Flex flexDirection="column" alignItems="flex-start">
          <StyledHeading ml="13px" mb="4px" scale="sm" isCardActive={isCardActive}>
            {lpLabel.split('-')[0]} / {lpLabel.split('-')[1]}
          </StyledHeading>
        </Flex>
      </Link>
    </Wrapper>
  )
}

export default CardHeading
