import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import { CurrencyLogo } from '../../../../components/Logo'

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
          <Text ml="13px" mb="4px" fontSize="18px" fontWeight="600" >
            {lpLabel.split('-')[0]} / {lpLabel.split('-')[1]}
          </Text>
        </Flex>
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
