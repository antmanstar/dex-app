import React from 'react'
import { Currency, Pair } from '@pancakeswap/sdk'
import { Button, ChevronDownIcon, Text, useModal, Flex, LogoRoundIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { CurrencyLogo, DoubleCurrencyLogo } from '../Logo'

import { RowBetween } from '../Layout/Row'
import { Input as NumericalInput } from './NumericalInput'
import { useWidth } from '../../hooks/useWidth'

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  background: ${({ theme }) => theme.colors.input};
  //border: 1px solid ${({ theme }) => theme.colors.swapInputBorder};
  border-radius: 10px;
  padding: ${({ selected }) => (selected ? '1rem 0.5rem 1rem 1rem' : '1rem 0.75rem 1rem 1rem')};
`

const InputWrapper = styled(Flex)`
  flex-direction: column;
  width: 100%
`
const StyledNumericalInput = styled(NumericalInput)`
  width: 100%
`

const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })`
  padding: 0 0.5rem;
  border-left: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: 0;

  @media screen and (max-width: 360px) {
    padding-left: 0.5rem;
    padding-right: 0;
  }
`
const LabelRow = styled.div<{ secondInput?: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 0;
  ${({ secondInput }) => {
    if (secondInput) {
      return `
        padding-top: 0;
      `
    }
    return ''
  }}
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  // background-color: ${({ theme }) => theme.colors.background};
  z-index: 1;
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: 16px;
  //background-color: ${({ theme }) => theme.colors.input};
  // box-shadow: ${({ theme }) => theme.shadows.inset};
`

const NetworkSelector = styled(Flex)`
  background: ${({ theme }) => theme.colors.input};
  border-radius: 20px;
  height: 40px;
  padding: 5px;
  align-items: center;
`
const ChainSelectionButton = styled(Flex)`
  cursor: pointer;
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  secondInput?: boolean
}
export default function BridgeInput({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  secondInput,
}: CurrencyInputPanelProps) {
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const { t } = useTranslation()
  const translatedLabel = label || t('Input')
  const width = useWidth()

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
      isPopUp={width < 481}
    />,
    true,
    false,
    'currency-selector-modal',
    width < 481
  )
  return (
    <InputPanel id={id}>
      <Container hideInput={hideInput}>
        {!hideInput && (
          <LabelRow secondInput={secondInput}>
            <RowBetween>
              <ChainSelectionButton alignItems="center" onClick={() => console.log("Change Chain")}>
                <Text small mr="10px">{translatedLabel}</Text>
                <NetworkSelector>
                  <LogoRoundIcon width="24px" />
                  <Text fontSize="16px" ml="5px" mr="5px">Unknown Chain</Text>
                  <ChevronDownIcon width="24px" />              
                </NetworkSelector>
              </ChainSelectionButton>
              {account && (
                <Text onClick={onMax} style={{ display: 'inline', cursor: 'pointer' }} small>
                  {!hideBalance && !!currency
                    ? t('Balance: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
                    : ' -'}
                </Text>
              )}
            </RowBetween>
          </LabelRow>
        )}
        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
          {!hideInput && (
            <>
              <InputWrapper>
                <Text fontSize="12px" fontWeight="600" mb="10px">{translatedLabel === "From" ? t("Sending Amount") : t("Received Amount")}</Text>
                <StyledNumericalInput
                  value={value}
                  onUserInput={(val) => {
                    onUserInput(val)
                  }}
                />
              </InputWrapper>
              {/* {account && currency && showMaxButton && label !== 'To' && ( */}
              <Button onClick={onMax} scale="sm" variant="text">
                MAX
              </Button>
              {/* )} */}
            </>
          )}
          <CurrencySelectButton
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                onPresentCurrencyModal()
              }
            }}
          >
            <Flex alignItems="center" justifyContent="space-between">
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
              ) : currency ? (
                <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
              ) : null}
              {pair ? (
                <Text id="pair">
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </Text>
              ) : (
                <Text id="pair">
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                      currency.symbol.length - 5,
                      currency.symbol.length,
                    )}`
                    : currency?.symbol) || t('Select a currency')}
                </Text>
              )}
              {!disableCurrencySelect && <ChevronDownIcon />}
            </Flex>
          </CurrencySelectButton>
        </InputRow>
      </Container>
    </InputPanel>
  )
}
