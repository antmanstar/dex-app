import React from 'react'
import styled from 'styled-components'
import { Card, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useWidth } from 'hooks/useWidth'
import useTheme from 'hooks/useTheme'

const StyledCard = styled(Card)`
  justify-content: space-between;
  background-color: transparent;
  text-align: center;   
  max-width: 300px;
`

const StyledImage = styled.img`
  width: 188px;
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
    <StyledCard>      
      <StyledImage
        src={data.icon}
        alt={t(data.title)}
      />
      <Text mb="5px" fontSize="18px" fontWeight="500">{t(data.title)}</Text>
    </StyledCard>
  )
}

export default RoundInfoCard
