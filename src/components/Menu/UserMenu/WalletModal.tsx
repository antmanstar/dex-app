import React, { useState } from 'react'
import {
  ButtonMenu,
  ButtonMenuItem,
  CloseIcon,
  Heading,
  IconButton,
  InjectedModalProps,
  ModalBody,
  ModalContainer,
  ModalHeader as UIKitModalHeader,
  ModalTitle,
} from '@pancakeswap/uikit'
import { parseUnits } from 'ethers/lib/utils'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { FetchStatus, useGetBnbBalance } from 'hooks/useTokenBalance'
import WalletInfo from './WalletInfo'
import WalletTransactions from './WalletTransactions'
import useTheme from '../../../hooks/useTheme'

export enum WalletView {
  WALLET_INFO,
  TRANSACTIONS,
}

interface WalletModalProps extends InjectedModalProps {
  initialView?: WalletView
}

export const LOW_BNB_BALANCE = parseUnits('2', 'gwei')

const ModalHeader = styled(UIKitModalHeader)`
  background: ${({ theme }) => theme.colors.background};
`

const Tabs = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  padding: 16px 24px;
`

const StyledButtonMenuContainer = styled(ButtonMenu)`
  border: none;
  background: ${({ theme }) => theme.colors.background};
`

const StyledButtonMenu = styled(ButtonMenuItem)`
  border-radius: 16px;
`

const WalletModal: React.FC<WalletModalProps> = ({ initialView = WalletView.WALLET_INFO, onDismiss }) => {
  const [view, setView] = useState(initialView)
  const { t } = useTranslation()
  const { balance, fetchStatus } = useGetBnbBalance()
  const { theme } = useTheme()
  const hasLowBnbBalance = fetchStatus === FetchStatus.SUCCESS && balance.lte(LOW_BNB_BALANCE)

  const handleClick = (newIndex: number) => {
    setView(newIndex)
  }

  return (
    <ModalContainer title={t('Welcome!')} minWidth="320px">
      <ModalHeader>
        <ModalTitle>
          <Heading fontSize="22px !important">{t('Your Wallet')}</Heading>
        </ModalTitle>
        <IconButton variant="text" onClick={onDismiss} scale="sm">
          <CloseIcon width="22px" color="text" />
        </IconButton>
      </ModalHeader>
      <Tabs>
        <StyledButtonMenuContainer scale="sm" variant="subtle" onItemClick={handleClick} activeIndex={view} fullWidth>
          <StyledButtonMenu>{t('Wallet')}</StyledButtonMenu>
          <StyledButtonMenu>{t('Transactions')}</StyledButtonMenu>
        </StyledButtonMenuContainer>
      </Tabs>
      <ModalBody p="24px" maxWidth="400px" width="100%" background={theme.colors.backgroundAlt}>
        {view === WalletView.WALLET_INFO && <WalletInfo hasLowBnbBalance={hasLowBnbBalance} onDismiss={onDismiss} />}
        {view === WalletView.TRANSACTIONS && <WalletTransactions />}
      </ModalBody>
    </ModalContainer>
  )
}

export default WalletModal
