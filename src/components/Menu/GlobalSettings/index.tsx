import React from 'react'
import { Flex, IconButton, CogIcon, useModal } from '@pancakeswap/uikit'
import styled from 'styled-components'
import SettingsModal from './SettingsModal'

interface IGlobalSettingsInterface {
  isPopUp?: boolean
  modalId?: string
}

const StyledIconButton = styled(Flex)`
  button {
    width: 30px;
  }
`

const GlobalSettings = (props: IGlobalSettingsInterface) => {

  const { isPopUp, modalId } = props

  const [onPresentSettingsModal] = useModal(
    <SettingsModal isPopUp={isPopUp} />,
    false,
    true,
    modalId || "global-settings-modal",
    isPopUp
  )

  return (
    <StyledIconButton>
      <IconButton onClick={onPresentSettingsModal} variant="text" scale="md" id="open-settings-dialog-button">
        <CogIcon height={22} width={22} color="text" />
      </IconButton>
    </StyledIconButton>
  )
}

export default GlobalSettings
