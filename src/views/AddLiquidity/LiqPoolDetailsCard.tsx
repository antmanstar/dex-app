import React from 'react'
import { Card, CardBody, Flex, Text } from '@pancakeswap/uikit'
import { Currency, Pair, Percent, Price } from '@pancakeswap/sdk'
import { AutoColumn } from 'components/Layout/Column'
import styled from 'styled-components'
import { Field } from '../../state/mint/actions'
import Row, { AutoRow } from '../../components/Layout/Row'
import { useTranslation } from '../../contexts/Localization'
import useTheme from '../../hooks/useTheme'
import { CurrencyLogo, DoubleCurrencyLogo } from '../../components/Logo'

interface ILiqPoolDetailsCardInterface {
  currencies: { [field in Field]?: Currency }
  totalPoolTokens: string
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price
  pair?: Pair
}

const StyledRow = styled.div`
  display: grid;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;

  grid-gap: 32px;
  grid-template-columns: 1fr 1fr;

  ${({ theme }) => theme.mediaQueries.xs} {
    grid-template-columns: 1fr 1fr;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`
const FlexContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  margin-bottom: 24px;
`

const AddressText = styled(Text)`
  @media screen and (max-width: 360px) {
    font-size: 11px;
  }
`

const StyledCardBody = styled(CardBody)`
  background: transparent;
  @media screen and (max-width: 360px) {
    padding: 16px;
  }
`

const StyledCard = styled(Card)`
  background: transparent;
`

const LiqPoolDetailsCard: React.FC<ILiqPoolDetailsCardInterface> = (props: ILiqPoolDetailsCardInterface) => {
  const { currencies, noLiquidity, poolTokenPercentage, price, pair, totalPoolTokens } = props
  const { t } = useTranslation()
  const { theme } = useTheme()

  const renderSingleData = (title: string, data: string) => {
    return (
      <>
        <Text color="textSubtle2" textTransform="capitalize" mb="12px">
          {title}
        </Text>
        <Text color="text" textTransform="capitalize" fontSize="16px">
          {data}
        </Text>
      </>
    )
  }

  return (
    <StyledCard background="transparent">
      <StyledCardBody>
        <div>
          <FlexContainer>
            <CurrencyLogo currency={currencies[Field.CURRENCY_A]} size="22px" />
            <Text fontSize="22px" mb="0" ml="10px">
              {currencies[Field.CURRENCY_A]?.symbol ?? ''}
            </Text>
            <Text fontSize="22px" mb="0" ml="10px" mx="15px">
              /
            </Text>
            <CurrencyLogo currency={currencies[Field.CURRENCY_B]} size="22px" />
            <Text fontSize="22px" mb="0" ml="10px">
              {currencies[Field.CURRENCY_B]?.symbol ?? ''}
            </Text>
          </FlexContainer>
        </div>
        <AddressText fontSize="12px" color="subtle" mb="24px">
          {pair?.liquidityToken?.address
            ? `(${pair?.liquidityToken?.address})`
            : '(0x0000000000000000000000000000000000000000)'}
        </AddressText>
        <StyledRow>
          <AutoColumn justify="start">{renderSingleData(t('Liquidity'), (`${totalPoolTokens} LP` || '$0.00'))}</AutoColumn>
          <AutoColumn justify="start">{renderSingleData(t('Volume (24H)'), '$0.00')}</AutoColumn>
          <AutoColumn justify="start">{renderSingleData(t('Fees (24H)'), '$0.00')}</AutoColumn>
          <AutoColumn justify="start">{renderSingleData(t('APR'), '0%')}</AutoColumn>
        </StyledRow>
      </StyledCardBody>
    </StyledCard>
  )
}

export default LiqPoolDetailsCard
