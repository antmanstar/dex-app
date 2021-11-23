import React from 'react'
import { useWeb3React } from '@web3-react/core'
import {
  Flex,
  LogoutIcon,
  useModal,
  UserMenu as UIKitUserMenu,
  UserMenuDivider,
  UserMenuItem,
} from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { useProfile } from 'state/profile/hooks'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { FetchStatus, useGetBnbBalance } from 'hooks/useTokenBalance'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import WalletModal, { WalletView, LOW_BNB_BALANCE } from './WalletModal'
import ProfileUserMenuItem from './ProfileUserMenutItem'
import WalletUserMenuItem from './WalletUserMenuItem'
import { useWidth } from '../../../hooks/useWidth'
import { formatBigNumber } from '../../../utils/formatBalance'

const StyledConnectWalletButton = styled(ConnectWalletButton)`
  height: 35px;
  width: 110px;
  padding: 0 8px;
`

const UserMenu = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { logout } = useAuth()
  const width = useWidth()
  const { balance, fetchStatus } = useGetBnbBalance()
  const { isInitialized, isLoading, profile } = useProfile()
  const [onPresentWalletModal] = useModal(<WalletModal initialView={WalletView.WALLET_INFO} isPopUp={width < 481} />, true, true,  'wallet-info-modal', width < 481)
  const [onPresentTransactionModal] = useModal(<WalletModal initialView={WalletView.TRANSACTIONS} isPopUp={width < 481} />, true, true,  'wallet-transaction-modal', width < 481)
  const hasProfile = isInitialized && !!profile
  const avatarSrc = profile && profile.nft ? `/images/nfts/${profile.nft.images.sm}` : undefined
  const hasLowBnbBalance = fetchStatus === FetchStatus.SUCCESS && balance.lte(LOW_BNB_BALANCE)

  if (!account) {
    return <StyledConnectWalletButton onHeader/>
  }

  return (
    <UIKitUserMenu account={account} avatarSrc={avatarSrc} balance={fetchStatus !== FetchStatus.SUCCESS ? '0.00' : `${formatBigNumber(balance, 3)}`}>
      <WalletUserMenuItem hasLowBnbBalance={hasLowBnbBalance} onPresentWalletModal={onPresentWalletModal} />
      <UserMenuItem as="button" onClick={onPresentTransactionModal}>
        {t('Transactions')}
      </UserMenuItem>
      <UserMenuDivider />
      <UserMenuItem as="button" onClick={logout}>
        <Flex alignItems="center" justifyContent="space-between" width="100%">
          {t('Disconnect')}
          <LogoutIcon />
        </Flex>
      </UserMenuItem>
    </UIKitUserMenu>
  )
}

export default UserMenu
