import React, { useState } from 'react'
import Select from '../Select/Select'
import { useTranslation } from '../../contexts/Localization'

export const NetworkSelectDropdown: React.FC = () => {
  const { t } = useTranslation()
  const [network, setNetwork] = useState('polygon')

  const handleSortOptionChange = (value) => {
    setNetwork(value)
    console.log('selected value', value)
  }

  const getSelectedBG = (value: string) => {
    switch (value) {
      // TODO: Add these colors in toolkit
      case 'polygon':
        return 'linear-gradient(73.28deg,#8247e5 6.51%,#6027c0 88.45%)'
      default:
        return 'linear-gradient(73.28deg,#8247e5 6.51%,#6027c0 88.45%)'
    }
  }

  return (
    <Select
      maxWidth="175px"
      mr="24px"
      selectedBackgroundColor={getSelectedBG(network)}
      selectedTextColor="white"
      options={[
        {
          label: t('Polygon'),
          icon: '/images/tokens/matic.png',
          value: 'polygon',
        },
      ]}
      onOptionChange={handleSortOptionChange}
    />
  )
}
