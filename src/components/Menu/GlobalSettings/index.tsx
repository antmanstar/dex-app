import React from 'react'
import { Flex, IconButton, CogIcon, useModal } from '@pancakeswap/uikit'
import SettingsModal from './SettingsModal'

const GlobalSettings = () => {
  const [onPresentSettingsModal] = useModal(<SettingsModal />)

  return (
    <Flex>
      <IconButton onClick={onPresentSettingsModal} variant="text" scale="md" id="open-settings-dialog-button">
        <CogIcon height={26} width={26} color="text" />
      </IconButton>
    </Flex>
  )
}

export default GlobalSettings
