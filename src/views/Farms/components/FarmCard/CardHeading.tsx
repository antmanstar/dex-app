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
      <Flex>
        <Flex>
          <CurrencyLogo currency={token} size="28px" style={{ marginRight: '-8px' }} />
          <CurrencyLogo currency={quoteToken} size="28px" style={{ marginRight: '0' }} />
        </Flex>
        <Flex flexDirection="column" alignItems="flex-start" mt="2px">
          <StyledHeading ml="13px" mb="4px" scale="sm" fontSize="18px" fontWeight="600" isCardActive={isCardActive}>
            {lpLabel.split('-')[0]} / {lpLabel.split('-')[1]}
          </StyledHeading>
        </Flex>
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
