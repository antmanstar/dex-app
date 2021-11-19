import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { CurrencyAmount, JSBI, Token, Trade } from '@pancakeswap/sdk'
import {
  Button,
  Text,
  ArrowDownIcon,
  Box,
  useModal,
  ArrowUpDownIcon,
  Card,
  Flex,
  Tab,
  TabMenu,
  useMatchBreakpoints,
  useWalletModal,
} from '@pancakeswap/uikit'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import { useTranslation } from 'contexts/Localization'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import SwapWarningTokens from 'config/constants/swapWarningTokens'
import { useDispatch } from 'react-redux'
import history from 'routerHistory'
import Loading from 'components/Loading'
import useAuth from 'hooks/useAuth'
import AddressInputPanel from '../Swap/components/AddressInputPanel'
import { LightGreyCard } from '../../components/Card'
import Column, { AutoColumn } from '../../components/Layout/Column'
import ConfirmSwapModal from '../Swap/components/ConfirmSwapModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel/BridgeInput'
import { Input as NumericalInput } from '../../components/CurrencyInputPanel/NumericalInput'
import { AutoRow, RowBetween } from '../../components/Layout/Row'
import confirmPriceImpactWithoutFee from '../Swap/components/confirmPriceImpactWithoutFee'
import {
  ArrowWrapper,
  SwapCallbackError,
  Wrapper,
} from '../Swap/components/styleds'
import TradePrice from '../Swap/components/TradePrice'
import ImportTokenWarningModal from '../Swap/components/ImportTokenWarningModal'
import ProgressSteps from '../Swap/components/ProgressSteps'
import { INITIAL_ALLOWED_SLIPPAGE } from '../../config/constants'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useCurrency, useAllTokens } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { Field } from '../../state/swap/actions'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/swap/hooks'
import { useExpertModeManager, useUserSlippageTolerance, useUserSingleHopOnly } from '../../state/user/hooks'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import CircleLoader from '../../components/Loader/CircleLoader'
import Page from '../Page'
import SwapWarningModal from '../Swap/components/SwapWarningModal'
import { PoolUpdater, ProtocolUpdater, TokenUpdater } from '../../state/info/updaters'
import { useWidth } from '../../hooks/useWidth'
import useTheme from '../../hooks/useTheme'


const StyledPage = styled(`div`)`
  max-width: 539px;
  width: 100%;
  z-index: 1;
  padding-top: 57px;

  @media screen and (max-width: 968px) {
    padding-top: 27px;
  }
`

const Body = styled(`div`)`
  border-radius: 10px;
`

const BridgeContainer = styled(Card)`
  background: #00000000;
  width: 100%;
`

const BridgeCardWrapper = styled(Flex)`
  min-height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder2};
   
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 10px;
  & > div {
    width: 100%;
  }
`

const BridgeCardHeader = styled(Flex)`
  padding-top: 15px;
  display: flex;
   
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  & > div {
    width: 100%;
  }
`

const StyledTab = styled(Flex)<{ isActive?: boolean }>`
  font-size: 24px;
  border-bottom: 2px solid ${({ theme, isActive }) => isActive ? theme.colors.primary : theme.colors.cardBorder2};
  padding-bottom: 15px;
  border-radius: 0;
  width: 100%;
  alignItems: center;
  justify-content: center;
  cursor: pointer;
`

const TabText = styled(Text)<{ isActive?: boolean, isMobile?: boolean }>`
  font-size: ${({ isMobile }) => isMobile ? '18px' : '24px'};
  font-weight: 600;
  text-align: center;
  color: ${({ theme, isActive }) => isActive ? theme.colors.text : 'grey'};
`

const Label = styled(Text)`
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
`

const AddSendButton = styled(Button)`
  font-size: 14px;
  padding-right: 0;
  margin-right: -8px;
`

const RemoveSendButton = styled(Button)`
  font-size: 14px;
  padding-right: 0;
  margin-right: -8px;
`

const Bridge: React.FC = () => {
  const loadedUrlParams = useDefaultsFromURLSearch()
  const { theme, isDark } = useTheme()
  const { observerRef } = useIntersectionObserver()
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const [tab, setTab] = useState<string>('bridge')
  const width = useWidth()
  const { onPresentConnectModal } = useWalletModal(login, logout, t, "", width < 481)
  const { isTablet, isMobile, isXs } = useMatchBreakpoints()

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  )

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens()
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !(token.address in defaultTokens)
    })

  const { account, chainId } = useActiveWeb3React()

  const dispatch = useDispatch()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo()

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade

  const parsedAmounts = showWrap
    ? {
      [Field.INPUT]: parsedAmount,
      [Field.OUTPUT]: parsedAmount,
    }
    : {
      [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
      [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
    }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput],
  )

  // modal and loading
  const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0)),
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const [singleHopOnly] = useUserSingleHopOnly()

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee, t)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: hash })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm, t])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn })
  }, [attemptingTxn, swapErrorMessage, trade, txHash])

  // swap warning state
  const [swapWarningCurrency, setSwapWarningCurrency] = useState(null)
  const [onPresentSwapWarningModal] = useModal(<SwapWarningModal swapCurrency={swapWarningCurrency} />)

  const shouldShowSwapWarning = (swapCurrency) => {
    if (!swapCurrency) return false
    const isWarningToken = Object.entries(SwapWarningTokens).find((warningTokenConfig) => {
      const warningTokenData = warningTokenConfig[1]
      if (!warningTokenData) return false
      return swapCurrency.address === warningTokenData.address
    })
    return Boolean(isWarningToken)
  }

  useEffect(() => {
    if (swapWarningCurrency) {
      onPresentSwapWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapWarningCurrency])

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
      const showSwapWarning = shouldShowSwapWarning(inputCurrency)
      if (showSwapWarning) {
        setSwapWarningCurrency(inputCurrency)
      } else {
        setSwapWarningCurrency(null)
      }
    },
    [onCurrencySelection],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
      const showSwapWarning = shouldShowSwapWarning(outputCurrency)
      if (showSwapWarning) {
        setSwapWarningCurrency(outputCurrency)
      } else {
        setSwapWarningCurrency(null)
      }
    },

    [onCurrencySelection],
  )

  const allTokens = useAllTokens()
  const defaultSecondToken = Object.values(allTokens).filter(single => single.symbol.toLowerCase() === "weth")[0]

  useEffect(() => {
    if (defaultSecondToken) {
      handleOutputSelect(defaultSecondToken)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSecondToken])

  const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  const [onPresentImportTokenWarningModal] = useModal(
    <ImportTokenWarningModal tokens={importTokensNotInDefault} onCancel={() => history.push('/swap/')} />,
  )

  useEffect(() => {
    if (importTokensNotInDefault.length > 0) {
      onPresentImportTokenWarningModal()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importTokensNotInDefault.length])

  const [onPresentConfirmModal] = useModal(
    <ConfirmSwapModal
      trade={trade}
      originalTrade={tradeToConfirm}
      onAcceptChanges={handleAcceptChanges}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      recipient={recipient}
      allowedSlippage={allowedSlippage}
      onConfirm={handleSwap}
      swapErrorMessage={swapErrorMessage}
      customOnDismiss={handleConfirmDismiss}
    />,
    true,
    true,
    'confirmSwapModal',
  )

  const getFarmsTypeTabs = () => {
    return [
      {
        value: 'bridge',
        label: 'Bridge',
      },
      {
        value: 'history',
        label: 'History',
      }
    ]
  }

  const renderTab = (): JSX.Element => {
    return (
      <Flex>
          {getFarmsTypeTabs().map((singleTab, index) => {
            return (
              <StyledTab isActive={tab===singleTab.value} onClick={() => setTab(singleTab.value)}>
                <TabText isActive={tab===singleTab.value} isMobile={isMobile}>{singleTab.label}</TabText>
              </StyledTab>
            )
          })}
      </Flex>
    )
  }

  const renderContent = (): JSX.Element => {
    return (
      <BridgeContainer>
        <BridgeCardWrapper>
          <BridgeCardHeader>
            {renderTab()}
          </BridgeCardHeader>
          {tab === 'bridge' ?
            <Wrapper id="swap-page" padding="20px">
              <Flex flexDirection="column">
                <CurrencyInputPanel
                  label={
                    independentField === Field.OUTPUT && !showWrap && trade ? t('From (estimated)') : t('From')
                  }
                  value={formattedAmounts[Field.INPUT]}
                  showMaxButton={!atMaxAmountInput}
                  currency={currencies[Field.INPUT]}
                  onUserInput={handleTypeInput}
                  onMax={handleMaxInput}
                  onCurrencySelect={handleInputSelect}
                  otherCurrency={currencies[Field.OUTPUT]}
                  id="bridge-currency-input"
                />
                <AutoColumn justify="space-between">
                  <AutoRow
                    justify={isExpertMode ? 'space-between' : 'center'}
                    style={{ padding: '0 1rem' }}
                  >
                    <Button
                      // onClick={() => {
                      //   setApprovalSubmitted(false) // reset 2 step UI for approvals
                      //   onSwitchTokens()
                      // }}
                      scale="sm"
                      variant="text"
                      mb="15px"
                    >
                      <ArrowUpDownIcon
                        width="25px"
                        color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? 'primary' : 'text'}
                      />
                    </Button>
                    {recipient === null && !showWrap && isExpertMode ? (
                      <AddSendButton variant="text" id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                        {t('+ Add a send (optional)')}
                      </AddSendButton>
                    ) : null}
                  </AutoRow>
                </AutoColumn>
                {/* TODO: This input field is not required instead it will just render the information */}
                <CurrencyInputPanel
                  value={formattedAmounts[Field.OUTPUT]}
                  onUserInput={handleTypeOutput}
                  label={independentField === Field.INPUT && !showWrap && trade ? t('To (estimated)') : t('To')}
                  showMaxButton={false}
                  currency={currencies[Field.OUTPUT]}
                  onCurrencySelect={handleOutputSelect}
                  otherCurrency={currencies[Field.INPUT]}
                  id="bridge-currency-output"
                  secondInput
                />

                {isExpertMode && recipient !== null && !showWrap ? (
                  <>
                    <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                      <ArrowWrapper clickable={false}>
                        <ArrowDownIcon width="24px" />
                      </ArrowWrapper>
                      <RemoveSendButton variant="text" id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                        {t('- Remove send')}
                      </RemoveSendButton>
                    </AutoRow>
                    <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                  </>
                ) : null}

                {showWrap ? null : (
                  <AutoColumn gap="8px" style={{ padding: '0 16px' }}>
                    {Boolean(trade) && (
                      <RowBetween align="center">
                        <Label>{t('Price')}</Label>
                        <TradePrice
                          price={trade?.executionPrice}
                          showInverted={showInverted}
                          setShowInverted={setShowInverted}
                        />
                      </RowBetween>
                    )}
                    {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                      <RowBetween align="center">
                        <Label>{t('Slippage Tolerance')}</Label>
                        <Text bold color="primary">
                          {allowedSlippage / 100}%
                        </Text>
                      </RowBetween>
                    )}
                  </AutoColumn>
                )}
              </Flex>
              <Box mt="15px" mx="0.5rem">
                {swapIsUnsupported ? (
                  <Button width="100%" disabled mb="4px">
                    {t('Unsupported Asset')}
                  </Button>
                ) : !account ? (
                  <Flex justifyContent="center" flexDirection="column" alignItems="center">
                    <Button onClick={onPresentConnectModal} variant="primary" scale="sm" width="100%" height="50px" style={{borderRadius: '10px'}}>{t('Connect Wallet')}</Button>
                  </Flex>
                ) : showWrap ? (
                  <Button width="100%" disabled={Boolean(wrapInputError)} onClick={onWrap}>
                    {wrapInputError ??
                      (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                  </Button>
                ) : noRoute && userHasSpecifiedInputOutput ? (
                  <LightGreyCard
                    background={theme.colors.backgroundDisabled}
                    style={{ textAlign: 'center', padding: "10px 12px", fontSize: "16px", borderRadius: "10px" }}
                    noBorder
                  >
                    <Text color="textDisabled" mb={singleHopOnly && '4px'} fontWeight="500">
                      {t('Insufficient liquidity')}
                    </Text>
                    {singleHopOnly && (
                      <Text color="textDisabled" fontWeight="500">
                        {t('Try enabling multi-hop trades.')}
                      </Text>
                    )}
                  </LightGreyCard>
                ) : showApproveFlow ? (
                  <RowBetween>
                    <Button
                      variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
                      onClick={approveCallback}
                      disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                      width="48%"
                    >
                      {approval === ApprovalState.PENDING ? (
                        <AutoRow gap="6px" justify="center">
                          {t('Enabling')} <CircleLoader stroke="white" />
                        </AutoRow>
                      ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                        t('Enabled')
                      ) : (
                        t('Enable %asset%', { asset: currencies[Field.INPUT]?.symbol ?? '' })
                      )}
                    </Button>
                    <Button
                      variant={isValid && priceImpactSeverity > 2 ? 'danger' : 'primary'}
                      onClick={() => {
                        if (isExpertMode) {
                          handleSwap()
                        } else {
                          setSwapState({
                            tradeToConfirm: trade,
                            attemptingTxn: false,
                            swapErrorMessage: undefined,
                            txHash: undefined,
                          })
                          onPresentConfirmModal()
                        }
                      }}
                      width="48%"
                      id="swap-button"
                      disabled={
                        !isValid ||
                        approval !== ApprovalState.APPROVED ||
                        (priceImpactSeverity > 3 && !isExpertMode)
                      }
                    >
                      {priceImpactSeverity > 3 && !isExpertMode
                        ? t('Price Impact High')
                        : priceImpactSeverity > 2
                          ? t('Swap Anyway')
                          : t('Swap')}
                    </Button>
                  </RowBetween>
                ) : (
                  <Button
                    variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'primary'}
                    onClick={() => {
                      if (isExpertMode) {
                        handleSwap()
                      } else {
                        setSwapState({
                          tradeToConfirm: trade,
                          attemptingTxn: false,
                          swapErrorMessage: undefined,
                          txHash: undefined,
                        })
                        onPresentConfirmModal()
                      }
                    }}
                    id="swap-button"
                    width="100%"
                    disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                  >
                    {swapInputError ||
                      (priceImpactSeverity > 3 && !isExpertMode
                        ? t('Price Impact Too High')
                        : priceImpactSeverity > 2
                          ? t('Swap Anyway')
                          : t('Swap'))}
                  </Button>
                )}
                {showApproveFlow && (
                  <Column style={{ marginTop: '1rem' }}>
                    <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                  </Column>
                )}
                {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
              </Box>
            </Wrapper> : <Text textAlign='center'>Coming Soon</Text>
          }
        </BridgeCardWrapper>
      </BridgeContainer>
    )
  }

  return (
    <Page>
      <ProtocolUpdater />
      <PoolUpdater />
      <TokenUpdater />
      <StyledPage>
        <Body>
          {renderContent()}
          <div ref={observerRef} />
        </Body>
      </StyledPage>
    </Page>
  )
}

export default Bridge
