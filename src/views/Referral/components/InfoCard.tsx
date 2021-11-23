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

interface InfoData {
  data: any
}

const InfoCard: React.FC<InfoData> = ({
  data
}) => {
  const { t } = useTranslation()
  const width = useWidth()
  const { theme } = useTheme()

  return (
    <StyledCard padding="25px">
      <Text mb="5px" fontSize="16px" fontWeight="700" color={theme.colors.primary}>{t(data.title)}</Text>
      <Text mb="5px" fontSize="18px" fontWeight="700">{t(data.value)}</Text>
    </StyledCard>
  )
}

export default InfoCard
