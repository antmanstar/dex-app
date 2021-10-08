import React from 'react'
import Select from '../Select/Select'
import { useTranslation } from '../../contexts/Localization'
import useTheme from '../../hooks/useTheme'

export const NetworkSelectDropdown: React.FC = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const handleSortOptionChange = (value) => {
    console.log('selected value', value)
  }

  return (
    <Select
      maxWidth="175px"
      mr="24px"
      background={theme.colors.tertiary}
      options={[
        {
          label: t('Polygon'),
          value: 'polygon',
        },
      ]}
      onOptionChange={handleSortOptionChange}
    />
  )
}
