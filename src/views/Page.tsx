import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import Footer from 'components/Menu/Footer'
import { PageMeta } from 'components/Layout/Page'

const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 16px;
  padding-bottom: 56px;
  padding-top: 0;
  min-height: calc(100vh - 56px);
  // background: ${({ theme }) => theme.colors.background};
  //background: url('/bg_eco.svg') no-repeat center center;
  background-size: cover;
  ${({ theme }) => theme.mediaQueries.xs} {
    background-size: auto;
  }

  @media screen and (min-width: 577px) {
    min-height: calc(100vh - 112px);
    padding-bottom: 0;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    //padding-top: 32px;
    min-height: calc(100vh - 112px);
  }

  @media screen and (max-width: 360px) {
    padding-left: 8px;
    padding-right: 8px;
  }
`

const Page: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <>
      <PageMeta />
      <StyledPage {...props}>
        {children}
        <Flex flexGrow={1} />
        {/* <Footer /> */}
      </StyledPage>
    </>
  )
}

export default Page
