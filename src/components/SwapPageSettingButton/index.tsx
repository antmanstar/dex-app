import React from 'react'
import { Flex, IconButton, CogIcon } from '@pancakeswap/uikit'
import { useDispatch } from 'react-redux'
import { setShowSettings } from '../../state/swap/actions'

const SwapPageSettingsButton = () => {
  const dispatch = useDispatch()

  const handleSettingsClick = () => {
    dispatch(setShowSettings({ showSettings: true }))
  }

  return (
    <Flex>
      <IconButton
        onClick={() => handleSettingsClick()}
        variant="text"
        scale="md"
        mr="8px"
        id="open-settings-dialog-button"
      >
        <CogIcon height={26} width={26} color="textSubtle" />
      </IconButton>
    </Flex>
  )
}

export default SwapPageSettingsButton
