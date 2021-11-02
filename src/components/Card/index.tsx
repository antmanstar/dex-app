import styled, { css } from 'styled-components'
import { Box } from '@pancakeswap/uikit'

const Card = styled(Box)<{
  width?: string
  padding?: string
  border?: string
  borderRadius?: string
}>`
  width: ${({ width }) => width ?? '100%'};
  border-radius: 10px;
  padding: 1.25rem;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
  background-color: ${({ theme }) => theme.colors.background};
`
export default Card

export const LightCard = styled(Card)`
  //border: 1px solid ${({ theme }) => theme.colors.background};
  background-color: ${({ theme }) => theme.colors.cardBgAlt};
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

export const TransparentCard = styled(Card)<{noBorder?: boolean}>`
  background-color: transparent;
  border: ${({theme, noBorder}) => noBorder ? 'none' : css`1px solid ${theme.colors.cardBorder2}`};
`
