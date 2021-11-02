import React from 'react'
import styled from 'styled-components'
import { Tag, Flex, Heading, Skeleton } from '@pancakeswap/uikit'
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

const StyledHeading = styled(Heading)<{ isCardActive?: boolean }>`
  font-size: 20px;
  //color: ${({ theme, isCardActive }) => (isCardActive ? theme.colors.primaryButtonText : theme.colors.text)};
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
    <Wrapper justifyContent="space-between" alignItems="center" mb="4px">
      <Flex flexDirection="column" alignItems="flex-start">
        <StyledHeading mb="4px" scale="sm" isCardActive={isCardActive}>
          {lpLabel.split(' ')[0]}
        </StyledHeading>
        {/* <Flex justifyContent="center"> */}
        {/*  {isCommunityFarm ? <CommunityTag /> : <CoreTag />} */}
        {/*  {multiplier ? ( */}
        {/*    <MultiplierTag variant="secondary">{multiplier}</MultiplierTag> */}
        {/*  ) : ( */}
        {/*    <Skeleton ml="4px" width={42} height={28} /> */}
        {/*  )} */}
        {/* </Flex> */}
      </Flex>
      <Flex>
        <CurrencyLogo currency={token} size="30px" style={{ marginRight: '-8px' }} />
        <CurrencyLogo currency={quoteToken} size="30px" style={{ marginRight: '0' }} />
      </Flex>
      {/* <TokenPairImage variant="inverted" primaryToken={token} secondaryToken={quoteToken} width={64} height={64} /> */}
    </Wrapper>
  )
}

export default CardHeading
