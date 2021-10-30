import React from 'react'
import { Flex, IconButton, CogIcon } from '@pancakeswap/uikit'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { setShowSettings } from '../../state/swap/actions'

const StyledIconButton = styled(IconButton)`
  width: 28px;
  height: 40px;
`

const SwapPageSettingsButton = () => {
  const dispatch = useDispatch()

  const handleSettingsClick = () => {
    dispatch(setShowSettings({ showSettings: true }))
  }

  return (
    <Flex>
      <StyledIconButton
        onClick={() => handleSettingsClick()}
        variant="text"
        scale="md"
        // mr="8px"
        id="open-settings-dialog-button"
      >
        <CogIcon height={22} width={22} color="textSubtle" />
      </StyledIconButton>
    </Flex>
  )
}

export default SwapPageSettingsButton
