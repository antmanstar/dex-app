import React, { useCallback } from 'react'
import { Modal } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { FarmDetailsCard } from './FarmDetailsCard'

interface IDetailsModal {
  data: any
  onDismiss?: () => void
  customOnDismiss?: () => void
  location?: any
  userDataReady: boolean
  isPopUp?: boolean
}

const StyledModal = styled(Modal)`
  & > div:last-child {
    padding: 0;
  }
  
  @media screen and (max-width: 1024px) {
    width: 500px;
    max-width: 100%;
  }
`

export const DetailsModal: React.FC<IDetailsModal> = (props: IDetailsModal) => {

  const { data, onDismiss, customOnDismiss, location, userDataReady, isPopUp } = props

  const handleDismiss = useCallback(() => {
    if (customOnDismiss) {
      customOnDismiss()
    }
    onDismiss()
  }, [customOnDismiss, onDismiss])

  return (
    <StyledModal title={data?.lpSymbol.toUpperCase()} onDismiss={handleDismiss} isPopUp={isPopUp}>
      <FarmDetailsCard userDataReady={userDataReady} data={data} location={location} hideDetailsHeading/>
    </StyledModal>
  )
}
