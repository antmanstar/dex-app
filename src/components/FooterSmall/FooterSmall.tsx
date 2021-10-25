import React from 'react'
import styled from 'styled-components'
import { Button, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { ISmallFooterLinks } from './types'

const StyledLinks = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);

  ${({ theme }) => theme.mediaQueries.xs} {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`

const StyledSocial = styled(StyledLinks)`
  grid-template-columns: minmax(0, 1fr 1fr);

  ${({ theme }) => theme.mediaQueries.xs} {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-column-gap: 12px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-column-gap: 12px;
  }
`

const StyledAudit = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledContainer = styled(Flex)`
  height: 56px;
  border-top: 1px solid ${({ theme }) => theme.colors.tertiary};
  padding: 0 16px;
`

const StyledImages = styled.img`
  width: 24px;
  height: 24px;
  & > svg {
    color: ${({ theme }) => theme.colors.text};
  }
`

const StyledAuditButton = styled(Button)`
  padding: 4px;
  color: ${({ theme }) => theme.colors.text};
`

const StyledSocialButton = styled(Button)`
  color: ${({ theme }) => theme.colors.text};
`

const FooterSmall: React.FC<ISmallFooterLinks> = (props: ISmallFooterLinks) => {
  const { links, socialMedia, audit } = props

  const { isMobile, isTablet } = useMatchBreakpoints()

  return (
    <StyledContainer justifyContent="space-between" alignItems="center" width="100%">
      <StyledLinks>
        {links.map((singleLink) => {
          return (
            <Button as="a" variant="text" scale="xxs" href={singleLink.url}>
              {singleLink.title}
            </Button>
          )
        })}
      </StyledLinks>
      {!isMobile && !isTablet && (
        <StyledAudit>
          <Text fontSize="14px" mr="4px">
            Audited By:
          </Text>
          {audit.map((singleLink) => {
            return (
              <StyledAuditButton as="a" variant="text" scale="xxs" href={singleLink.url}>
                <singleLink.icon />
              </StyledAuditButton>
            )
          })}
        </StyledAudit>
      )}
      <StyledSocial>
        {socialMedia.map((singleLink) => {
          return (
            <StyledSocialButton as="a" variant="text" scale="xxs" href={singleLink.url}>
              {!singleLink.isTsSvg ? (
                <StyledImages src={singleLink.icon} alt={singleLink.title} />
              ) : (
                <singleLink.icon />
              )}
            </StyledSocialButton>
          )
        })}
      </StyledSocial>
    </StyledContainer>
  )
}

export default FooterSmall
