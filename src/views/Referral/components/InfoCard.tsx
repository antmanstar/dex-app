import React from 'react'
import styled from 'styled-components'
import { Card, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useWidth } from 'hooks/useWidth'
import useTheme from 'hooks/useTheme'

const StyledCard = styled(Card)`
  justify-content: space-between;
  text-align: center;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};

  @media screen and (max-width: 763px) {
    width: 360px;
    margin-bottom: 20px;
  }

  @media screen and (max-width: 410px) {
    width: 100%;
    margin-bottom: 20px;
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
    <StyledCard padding="20px">
      <Text fontSize="22px" fontWeight="500" mb="30px">{t(data.title)}</Text>
      <Text fontSize="32px" fontWeight="700" mt="30px" lineHeight="1.0" color={theme.colors.orange}>{t(data.value)}</Text>
    </StyledCard>
  )
}

export default InfoCard
