import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Flex, Modal } from '@pancakeswap/uikit'
import { ModalActions, ModalInput } from 'components/Modal'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance } from 'utils/formatBalance'
import useToast from 'hooks/useToast'
import { Token } from '@pancakeswap/sdk'

interface WithdrawModalProps {
  max: BigNumber
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  isPopUp?: boolean
  isCard?: boolean
  tokens?: Token[]
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onConfirm, onDismiss, max, tokenName = '', isPopUp, isCard, tokens }) => {
  const [val, setVal] = useState('')
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const valNumber = new BigNumber(val)
  const fullBalanceNumber = new BigNumber(fullBalance)

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  const renderConfirmAction = () => {
    return (
      <Button
        disabled={pendingTx || !valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalanceNumber)}
        onClick={async () => {
          setPendingTx(true)
          try {
            await onConfirm(val)
            toastSuccess(t('Unstaked!'), t('Your earnings have also been harvested to your wallet'))
            onDismiss()
          } catch (e) {
            toastError(
              t('Error'),
              t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
            )
            console.error(e)
          } finally {
            setPendingTx(false)
          }
        }}
        width="100%"
      >
        {pendingTx ? t('Confirming') : t('Confirm')}
      </Button>
    )
  }

  const renderContent = () => {
    return (
      <ModalInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
        inputTitle={t('Unstake')}
        tokens={tokens}
      />
    )
  }

  if (isCard) {
    return <Flex flexDirection="column" height="100%" justifyContent="space-between">
      {renderContent()}
      {renderConfirmAction()}
    </Flex>
  }

  return (
    <Modal title={t('Unstake LP tokens')} onDismiss={onDismiss} isPopUp={isPopUp}>
      {renderContent()}
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss} width="100%" disabled={pendingTx}>
          {t('Cancel')}
        </Button>
        {renderConfirmAction()}
      </ModalActions>
    </Modal>
  )
}

export default WithdrawModal
