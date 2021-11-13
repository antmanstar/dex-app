import React, { useState } from 'react'
import styled from 'styled-components'
import Select from '../Select/Select'
import { useTranslation } from '../../contexts/Localization'
import { useWidth } from '../../hooks/useWidth'
import useTheme from '../../hooks/useTheme'
import { networkList } from '../../config/constants/networks'

interface IActiveNetworkInterface {
  icon?: string,
  label: string,
  value: string
}

const StyledSelect = styled(Select)`
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  
  & > div:first-child {
    padding: 0 8px;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  
  & > div:last-child {
    min-width: 180px;
    margin-top: 4px;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
  }
`

export const NetworkSelectDropdown: React.FC = () => {
  const { t } = useTranslation()
  const width = useWidth()
  const { theme } = useTheme()
  const [network, setNetwork] = useState<IActiveNetworkInterface>(networkList(t)[0])

  const handleSortOptionChange = (value) => {
    setNetwork(value)
    console.log('selected value', value)
  }

  const getMaxWidth = (value: IActiveNetworkInterface) => {
    switch (value.value) {
      // case 'polygon':
      //   return '169px'
      // case 'ethereum':
      //   return '169px'
      // case 'bscMainnet':
      //   return '169px'
      default:
        return '168px'
    }
  }

  return (
    <StyledSelect
      maxWidth={getMaxWidth(network)}
      selectedBackgroundColor={theme.colors.networkGrad[network.value]}
      selectedTextColor="white"
      options={networkList(t)}
      onOptionChange={handleSortOptionChange}
      minWidth="168px"
      height={width < 768 ? "36px" : "30px"}
    />
  )
}
