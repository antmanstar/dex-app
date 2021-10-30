import styled from 'styled-components'
import { Box } from '@pancakeswap/uikit'

const Card = styled(Box)<{
  width?: string
  padding?: string
  border?: string
  borderRadius?: string
}>`
  width: ${({ width }) => width ?? '100%'};
  border-radius: 16px;
  padding: 1.25rem;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
  background-color: ${({ theme }) => theme.colors.background};
`
export default Card

export const LightCard = styled(Card)`
  //border: 1px solid ${({ theme }) => theme.colors.background};
  background-color: rgba(75,96,126,.1);
`

export const BasicCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`

export const LightGreyCard = styled(Card)<{noBorder?: boolean, background?: string}>`
  border: ${({noBorder, theme}) => noBorder ? "none" : `1px solid ${theme.colors.cardBorder}`};
  background-color: ${({ theme, background }) => background || theme.colors.input};
`

export const GreyCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.dropdown};
`
