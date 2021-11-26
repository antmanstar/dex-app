import { Currency, Token } from '@pancakeswap/sdk'
import {
  CalculatorIcon,
  Button,
  Card,
  Flex,  
  Text,
  ChevronDownIcon,
  ChevronUpIcon,
  Slider,
  useMatchBreakpoints,
  useModal
} from '@pancakeswap/uikit'
import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import styled from 'styled-components'
import { useFarms, usePollFarmsWithUserData, usePriceCakeBusd } from 'state/farms/hooks'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import { Input as NumericalInput } from 'components/CurrencyInputPanel/NumericalInput'
import { useTranslation } from '../../../contexts/Localization'
import useTheme from '../../../hooks/useTheme'
import { CurrencyLogo } from '../../../components/Logo'

const StyledDetailsWrapper = styled.div`
  padding: 15px;
  display: grid;
  justify-content: space-between;
  align-items: center;

  grid-template-columns: 20% 15% 15% 12% 12% 16%;
  grid-column-gap: 2%;
  grid-row-gap: 30px;

  @media screen and (max-width: 763px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media screen and (max-width: 576px) {
    grid-template-columns: 1fr 1fr;
  }
`

const StyledCard = styled(Card)`
  background: ${({ theme }) => theme.colors.backgroundAlt};
`

const StyledIconWrapper = styled(Flex)`
  stroke: ${({ theme }) => theme.colors.backgroundAlt};
  stroke-width: 1.5;
`

const ExpandedBlockWrapper = styled(Flex)`
  flex-direction: column;
  border-top: 1px solid #363636;
  padding: 20px 20px;

  @media screen and (max-width: 320px) {
    padding: 20px 10px;
  }
`

const VisualCardWrapper = styled(Flex)`
  justify-content: space-between;
  align-items: center;

  @media screen and (max-width: 763px) {
    flex-direction: column;
  }
`

const VisualCard = styled(Card)<{type: string}>`
  background: ${({ theme }) => theme.colors.background};
  max-width: 475px;
  padding: 15px;
  width: 100%;

  margin: 0 ${({type}) => type==='withdraw' ? '0px' : '10px'} 0 ${({type}) => type==='deposit' ? '0px' : '10px'};

  @media screen and (max-width: 763px) {
    margin: ${({type}) => type==='deposit' ? '0px' : '10px'} 0 ${({type}) => type==='withdraw' ? '0px' : '10px'} 0;
  }
`

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 10px;
  padding-left: 10px;
  padding-right: 10px;
`

const StyledSlider = styled(Slider)`
  width: 100%;
`

const TokenNameWrapper = styled(Flex)`
  display: block;

  @media screen and (max-width: 320px) {
    display: none
  }
`

const percentShortcuts = [0, 25, 50, 75, 100];
const initialDepositBalance = 1795394;
const maxDepositBalance = initialDepositBalance - 1000;

const initialWithdrawBalance = 3435345;
const maxWithdrawBalance = initialWithdrawBalance - 100;

const VaultCard = ({
  tokens,
  matic,
  data,
  handleClick
}: {
  tokens: [Token, Token]
  matic: Currency
  data: any
  handleClick: () => void,
}) => {
  const { isMobile, isXs} = useMatchBreakpoints()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [expanded, SetExpanded] = useState<boolean>(false)
  const [depositBalance, setDepositBalance] = useState(0)
  const [withdrawBalance, setWithdrawBalance] = useState(0)
  const cakePrice = usePriceCakeBusd()

  const [showRoiCalculator, setShowRoiCalculator] = useState(false)

  const [token1, token2] = tokens
  let currency1: Token | Currency = token1
  let currency2: Token | Currency = token2

  let address1 = token1.address
  let address2 = token2.address

  if (currency1.symbol.toLowerCase() === 'wmatic') {
    address1 = 'MATIC'
    currency1 = matic
  }
  if (currency2.symbol.toLowerCase() === 'wmatic') {
    address2 = address1
    currency2 = currency1
    address1 = 'MATIC'
    currency1 = matic
  }

  const [onPresentROICaculator] = useModal(
    <RoiCalculatorModal
      linkLabel={`${currency1?.symbol?.toUpperCase()} - ${currency2?.symbol?.toUpperCase()}`}
      stakingTokenBalance={cakePrice}
      stakingTokenSymbol={currency1.symbol}
      stakingTokenPrice={cakePrice.toNumber()}
      earningTokenPrice={cakePrice.toNumber()}
      apr={currency1.decimals}
      multiplier="multiplier"
      displayApr="displayApr"
      linkHref="#"
      isFarm
    />,
  )

  const handleArrowClick = () => {
    SetExpanded(!expanded)
  }

  const handleDepositInputChange = (val: string) => {
    if (val === '' || !val) {
      setDepositBalance(0);
    } else {
      setDepositBalance(parseInt(val))
    }
  }

  const handleDepositChange = (val: number) => {
    setDepositBalance(val);
  };

  const handleDepositMax = () => {
    setDepositBalance(maxDepositBalance);
  }

  const renderDepositCard = (): JSX.Element => {
    return (
      <Flex flexDirection="column">
        <Flex mb="5px" justifyContent="space-between" padding="0px 5px 0px 5px">
          <Text fontSize="16px" fontWeight="400">{t('In Wallet')}</Text>
          <Text fontSize="14px" fontWeight="400" color={theme.colors.textSubtle2}>0.00(xxx)</Text>
        </Flex>
        <InputWrapper>
          <NumericalInput
            value={depositBalance}
            onUserInput={handleDepositInputChange}
          />
          <Flex height="48px" alignItems="center">
            <Button onClick={() => handleDepositMax()} scale="sm" variant="text" padding="0px">
              <Text textAlign="center" fontSize="14px" fontWeight="400" color={theme.colors.textDisabled}>{t('Max')}</Text>
            </Button>
          </Flex>
        </InputWrapper>
        <Flex flexDirection="column" padding="4px">
          <StyledSlider name="deposit_slider`" min={0} max={maxDepositBalance} value={depositBalance} onValueChanged={handleDepositChange} isNormal />
          <Flex justifyContent="space-between" width="100%">
            {percentShortcuts.map((percent, index) => {
              const handlePercentageClick = () => {
                setDepositBalance((percent / 100) * maxDepositBalance);
              };

              return <Button scale="sm" variant="text" onClick={handlePercentageClick} padding="0px" width="20px" mr={index === 4 ? '6px' : '0px'}>
                <Text fontSize="16px" fontWeight="400" fontFamily="Myriad Pro">{`${percent}%`}</Text>
              </Button>;
            })}
          </Flex>
        </Flex>
        <Flex alignItems="center" justifyContent="center">
          <Button scale="sm" margin="10px" onClick={handleClick} padding="18px 10px">
            <Text fontSize="14px" fontWeight="500" color="white">
              {t('Deposit')}
            </Text>
          </Button>
        </Flex>
      </Flex>
    )
  }

  const handleWithdrawInputChange = (val: string) => {
    if (val === '' || !val) {
      setWithdrawBalance(0);
    } else {
      setWithdrawBalance(parseInt(val))
    }
  }

  const handleWithdrawChange = (val: number) => {
    setWithdrawBalance(val);
  };

  const handleWithdrawMax = () => {
    setWithdrawBalance(maxWithdrawBalance);
  }

  const renderWithdrawCard = (): JSX.Element => {
    return (
      <Flex flexDirection="column">
        <Flex mb="5px" justifyContent="space-between" padding="0px 5px 0px 5px">
          <Text fontSize="16px" fontWeight="400">{t('Deposited')}</Text>
          <Text fontSize="14px" fontWeight="400" color={theme.colors.textSubtle2}>0.00(xxx)</Text>
        </Flex>
        <InputWrapper>
          <NumericalInput
            value={withdrawBalance}
            onUserInput={handleWithdrawInputChange}
          />
          <Flex height="48px" alignItems="center">
            <Button onClick={() => handleWithdrawMax()} scale="sm" variant="text" padding="0px">
              <Text textAlign="center" fontSize="14px" fontWeight="400" color={theme.colors.textDisabled}>{t('Max')}</Text>
            </Button>
          </Flex>
        </InputWrapper>
        <Flex flexDirection="column" padding="4px">
          <StyledSlider name="withdraw_slider`" min={0} max={maxWithdrawBalance} value={withdrawBalance} onValueChanged={handleWithdrawChange} isNormal />
          <Flex justifyContent="space-between" width="100%">
            {percentShortcuts.map((percent, index) => {
              const handlePercentageWClick = () => {
                setWithdrawBalance((percent / 100) * maxWithdrawBalance);
              };

              return <Button scale="sm" variant="text" onClick={handlePercentageWClick} padding="0px" width="20px" mr={index === 4 ? '6px' : '0px'}>
                <Text fontSize="16px" fontWeight="400" fontFamily="Myriad Pro">{`${percent}%`}</Text>
              </Button>;
            })}
          </Flex>
        </Flex>
        <Flex alignItems="center" justifyContent="center">
          <Button scale="sm" margin="10px" onClick={handleClick} padding="18px 10px">
            <Text fontSize="14px" fontWeight="500" color="white">
              {t('Withdraw')}
            </Text>
          </Button>
        </Flex>
      </Flex>
    )
  }

  return (
    <StyledCard mt="16px">
      <StyledDetailsWrapper>
        <Flex mb="12px" alignItems="center" width="100%">
          <Flex>
            <CurrencyLogo currency={currency1} size={isXs ? '40px': '20px'} />
            <Flex ml={isXs ? '-20px': '-10px'}>
              <CurrencyLogo currency={currency2} size={isXs ? '40px': '20px'} />
            </Flex>
          </Flex>
          <TokenNameWrapper ml="10px" flexDirection="column">
            <Text fontSize="14px" fontWeight="400">
              {currency1?.symbol?.toUpperCase()} / {currency2?.symbol?.toUpperCase()}
            </Text>
            <Flex>
              <Text fontSize="12px" fontWeight="400">Ecoswap</Text>
            </Flex>
          </TokenNameWrapper>
        </Flex>
        {[
          { title: 'APY', value: `31.88%`, value_sec: `0.08% (24hr)` },
          { title: 'Deposit', value: `$35,256,52`, value_sec: `0.0000` },
          { title: 'TVL', value: `$35,256,52` },
          { title: "Fee", value: `1%` }
        ].map(item => {
          return (
            <Flex flexDirection="column" justifyContent="space-between" width="100%">
              <Flex mb="10px" alignItems="center">
                <Text fontSize="14px" fontWeight="500" color={theme.colors.textSubtle2} mr="10px" lineHeight="1">
                  {item.title}
                </Text>
                {item.title === 'APY' && <Flex onClick={onPresentROICaculator} style={{cursor: "pointer"}}>
                  <CalculatorIcon color={theme.colors.primary}/>
                </Flex>}
              </Flex>
              <Flex flexDirection="column" height="42px" justifyContent="center">
              <Text fontSize="14px" fontWeight="500">
                {item.value}
              </Text>
              {
                item.value_sec && <Text fontSize="14px" fontWeight="500">
                  {item.value_sec}
                </Text>
              }
              </Flex>
            </Flex>
          )
        })}
        <Flex justifyContent="space-between">
          <Button scale="sm" width="75px" onClick={handleClick} padding="18px 0px">
            <Text fontSize="14px" fontWeight="500" color="white">
              {t('Get LP')}
            </Text>
          </Button>
          <Button scale="sm" onClick={handleArrowClick} variant="text" width="40px" padding="0px">
            <StyledIconWrapper>
              {expanded ? <ChevronUpIcon width="50px" fontWeight="400" /> : <ChevronDownIcon width="50px" fontWeight="400" />}
            </StyledIconWrapper>
          </Button>
        </Flex>
      </StyledDetailsWrapper>
      {
        expanded && <ExpandedBlockWrapper>
          <VisualCardWrapper>
            <VisualCard type="deposit">
              {renderDepositCard()}
            </VisualCard>
            <VisualCard type="withdraw">
              {renderWithdrawCard()}
            </VisualCard>
          </VisualCardWrapper>
          <Flex justifyContent="space-between" alignItems="center" mt="20px">
            <Button onClick={() => console.log("Vault Details")} scale="sm" variant="text" padding="0px">
              <Text textAlign="center" fontSize="14px" fontWeight="500" color={theme.colors.primary}>{t('Vault Details')}</Text>
            </Button>
            <Button onClick={() => console.log("Documentation")} scale="sm" variant="text" padding="0px">
              <Text textAlign="center" fontSize="14px" fontWeight="500" color={theme.colors.primary}>{t('Documentation')}</Text>
            </Button>
          </Flex>
        </ExpandedBlockWrapper>
      }
    </StyledCard>
  )
}

export default VaultCard;