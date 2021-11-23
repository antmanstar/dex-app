import React from 'react'
import styled from 'styled-components'
import { Card, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useWidth } from 'hooks/useWidth'
import useTheme from 'hooks/useTheme'

const StyledCard = styled(Card)`
  justify-content: space-between;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};

  @media screen and (max-width: 763px) {
    width: 360px;
  }
`

const StyledImage = styled.img`
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

interface InfoData {
  data: any
}

const RoundInfoCard: React.FC<InfoData> = ({
  data
}) => {
  const { t } = useTranslation()
  const width = useWidth()
  const { theme } = useTheme()

  return (
    <StyledCard padding="25px">
      <Text mb="5px" fontSize="16px" fontWeight="700" color={theme.colors.primary}>{t(data.title)}</Text>
      <StyledImage
          src={data.iconPath}
          alt={t(data.title)}
          height="128px"
        />
    </StyledCard>
  )
}

export default RoundInfoCard
