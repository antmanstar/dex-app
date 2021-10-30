import React from 'react'
import { HistoryIcon, Button, useModal } from '@pancakeswap/uikit'
import TransactionsModal from './TransactionsModal'

const Transactions = () => {
  const [onPresentTransactionsModal] = useModal(<TransactionsModal />)
  return (
    <>
      <Button variant="text" p={0} onClick={onPresentTransactionsModal} ml="12px" height="40px">
        <HistoryIcon color="textSubtle" width="22px" height="22px" />
      </Button>
    </>
  )
}

export default Transactions
