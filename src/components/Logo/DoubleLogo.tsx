import { Currency } from '@pancakeswap/sdk'
import React from 'react'
import styled from 'styled-components'
import { Text } from '@pancakeswap/uikit'
import CurrencyLogo from './CurrencyLogo'

const Wrapper = styled.div<{ margin: boolean, alignment: string }>`
  display: flex;
  flex-direction: row;
  justify-content: ${({alignment}) => alignment || 'center'};
  align-items: center;
  margin-right: ${({ margin }) => margin && '4px'};
`

interface DoubleCurrencyLogoProps {
  margin?: boolean
  overlap?: boolean
  size?: number
  alignment?: string
  currency0?: Currency
  currency1?: Currency
  withSymbol?: boolean
}

export default function DoubleCurrencyLogo({
  currency0,
  currency1,
  size = 20,
  margin = false,
  alignment = 'center',
  overlap = false, withSymbol = false,
}: DoubleCurrencyLogoProps) {
  return (
    <Wrapper margin={margin} alignment={alignment}>
      {currency0 && <CurrencyLogo currency={currency0} size={`${size.toString()}px`} style={{ marginRight: '4px' }} />}
      <Text ml='2' fontSize='1.2rem' bold>
        {currency0 && withSymbol && `${currency0.name.toUpperCase()} /`}
      </Text>
      {currency1 && (
        <CurrencyLogo
          currency={currency1}
          size={`${size.toString()}px`}
          style={overlap ? { marginLeft: '-20px' } : {}}
        />
      )}
      <Text ml='2' fontSize='1.2rem' bold>
        {currency1 && withSymbol && `${currency1.name.toUpperCase()}`}
      </Text>
    </Wrapper>
  )
}
