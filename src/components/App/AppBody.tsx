import React from 'react'
import styled from 'styled-components'
import { Card } from '@pancakeswap/uikit'

export const BodyWrapper = styled(Card)<{maxWidth?: string}>`
  border-radius: 10px;
  max-width: 736px;
  width: 100%;
  z-index: 1;

  @media screen and (max-width: 968px) {
    max-width: ${({maxWidth}) => maxWidth || '100%'};
  }
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children, maxWidth }: { children: React.ReactNode, maxWidth?: string }) {
  return <BodyWrapper maxWidth={maxWidth}>{children}</BodyWrapper>
}
