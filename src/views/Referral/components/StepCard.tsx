import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Card, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useWidth } from 'hooks/useWidth'
import useTheme from 'hooks/useTheme'

const StyledCard = styled(Card) <{ isActive?: boolean }>`
  justify-content: flex-start;
  align-self: baseline;
  align-self: center;
  margin-top: 20px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid #131823;
  border-radius: 5px;
  background-color: ${({ isActive, theme }) => theme.colors.backgroundAlt};

  @media screen and (max-width: 763px) {
    width: 360px;
  }

  @media screen and (max-width: 400px) {
    width: 300px;
  }

  @media screen and (max-width: 320px) {
    width: auto;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 5px 12px rgb(126 142 177 / 20%);
    border-color: ${({ theme }) => theme.colors.primary};
        
    h2 {
      color: ${({ theme }) => theme.colors.primaryButtonText};
    }
    
    svg {
      fill: ${({ theme }) => theme.colors.primaryButtonText};
    }
  }
  
  svg {
    fill: ${({ theme, isActive }) => isActive ? theme.colors.primaryButtonText : theme.colors.text};
  }
`

const ImageWrapperFlex = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const StyledImage = styled.img<{swidth: number}>`
  height: 260px;
  width: auto;

  @media screen and (max-width: 1180px) {    
    height: calc(260px - 5vw);
  } 

  @media screen and (max-width: 1000px) {    
    height: calc(240px - 5vw);
  } 

  @media screen and (max-width: 850px) {    
    height: calc(220px - 5vw);
  }
  
  @media screen and (max-width: 280px) {    
    height: calc(200px - 5vw);
  } 
`

const StyledText = styled(Text)`
  height: 40px;
  @media screen and (max-width: 980px) {    
    height: 60px;
  } 
`

interface StepDataProps {
  step: string,
  title: string,
  content: string,
  img: string
}

interface StepCardProps {
  step: StepDataProps,
  onClick?: () => void
  isCardActive?: boolean
}

const StepCard: React.FC<StepCardProps> = ({
  step,
  onClick,
  isCardActive,
}) => {
  const { t } = useTranslation()
  const width = useWidth()
  const { theme } = useTheme()

  return (
    <StyledCard isActive={isCardActive} onClick={onClick} padding="20px">
      <ImageWrapperFlex>
        <StyledImage
          swidth={width}
          src={step.img}
          alt={t(step.title)}
          height="100px"
        />
      </ImageWrapperFlex>
      <Flex flexDirection="column" mt='10px'>
        <Text mb="5px" fontSize="16px" fontWeight="700" color={theme.colors.primary}>{t(step.step)}</Text>
        <Text mb="5px" fontSize="18px" fontWeight="700">{t(step.title)}</Text>
        <StyledText fontSize="14px" fontWeight="400" height="30px">{t(step.content)}</StyledText>
      </Flex>
    </StyledCard>
  )
}

export default StepCard
