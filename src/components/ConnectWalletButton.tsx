import React from 'react'
import { Button, useWalletModal, WalletFilledIcon } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'
import { useWidth } from '../hooks/useWidth'

const ConnectWalletButton = (props) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const width = useWidth()
  const { onPresentConnectModal } = useWalletModal(login, logout, t, "", width < 481)
  const { onHeader } = props

  return (
    <Button onClick={onPresentConnectModal} {...props} scale="md">
      {!onHeader && <WalletFilledIcon width='24px' color='currentColor' mr='4px' />}
      {t(onHeader ? 'Wallet' : 'Connect Wallet')}
    </Button>
  )
}

export default ConnectWalletButton
