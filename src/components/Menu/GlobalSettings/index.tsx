import React from 'react'
import { Flex, IconButton, CogIcon, useModal } from '@pancakeswap/uikit'
import SettingsModal from './SettingsModal'

interface IGlobalSettingsInterface {
  isPopUp?: boolean
}

const GlobalSettings = (props: IGlobalSettingsInterface) => {

  const { isPopUp } = props

  const [onPresentSettingsModal] = useModal(
    <SettingsModal isPopUp={isPopUp} />,
    false,
    true,
    "global-settings-modal",
    isPopUp
  )

  return (
    <Flex>
      <IconButton onClick={onPresentSettingsModal} variant="text" scale="md" id="open-settings-dialog-button">
        <CogIcon height={26} width={26} color="text" />
      </IconButton>
    </Flex>
  )
}

export default GlobalSettings
