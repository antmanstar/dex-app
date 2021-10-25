import { Currency, Percent, Price } from '@pancakeswap/sdk'
import React from 'react'
import { Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { AutoColumn } from '../../components/Layout/Column'
import { AutoRow } from '../../components/Layout/Row'
import { ONE_BIPS } from '../../config/constants'
import { Field } from '../../state/mint/actions'
import { SinglePriceCard } from './SinglePriceCard'

const StyledSection = styled.div`
  display: grid;
  background-color: ${({ theme }) => theme.colors.background};

  grid-template-columns: 1fr 1fr;
  grid-column-gap: 8px;
  border-radius: 10px;
  padding: 8px;
`

function PoolPriceWrapper({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price,
}: {
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price
}) {
  const { t } = useTranslation()

  const { isMobile } = useMatchBreakpoints()

  if (isMobile) {
    return (
      <StyledSection>
        <SinglePriceCard
          data={`${
            noLiquidity && price
              ? '100'
              : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'
          }
              %`}
          title={t('Your Pool Share')}
        />
        <SinglePriceCard
          data={`${
            noLiquidity && price
              ? '100'
              : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'
          }
              %`}
          title={t('Your Pool Tokens')}
        />
        <SinglePriceCard
          title={t('%assetA% per %assetB%', {
            assetA: currencies[Field.CURRENCY_B]?.symbol ?? '',
            assetB: currencies[Field.CURRENCY_A]?.symbol ?? '',
          })}
          data={price?.toSignificant(6) ?? '-'}
        />
        <SinglePriceCard
          title={t('%assetA% per %assetB%', {
            assetA: currencies[Field.CURRENCY_A]?.symbol ?? '',
            assetB: currencies[Field.CURRENCY_B]?.symbol ?? '',
          })}
          data={price?.invert()?.toSignificant(6) ?? '-'}
        />
      </StyledSection>
    )
  }

  return (
    <AutoRow justify="space-between" gap="4px">
      <AutoColumn gap="md">
        <AutoRow justify="space-around" gap="4px">
          <AutoColumn justify="center" gap="lg">
            <SinglePriceCard
              data={`${
                noLiquidity && price
                  ? '100'
                  : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'
              }
              %`}
              title={t('Your Pool Share')}
            />
            <SinglePriceCard
              data={`${
                noLiquidity && price
                  ? '100'
                  : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'
              }
              %`}
              title={t('Your Pool Tokens')}
            />
          </AutoColumn>
        </AutoRow>
      </AutoColumn>
      <AutoColumn gap="md">
        <AutoRow justify="space-around" gap="4px">
          <AutoColumn justify="center" gap="lg">
            <SinglePriceCard
              title={t('%assetA% per %assetB%', {
                assetA: currencies[Field.CURRENCY_B]?.symbol ?? '',
                assetB: currencies[Field.CURRENCY_A]?.symbol ?? '',
              })}
              data={price?.toSignificant(6) ?? '-'}
            />
            <SinglePriceCard
              title={t('%assetA% per %assetB%', {
                assetA: currencies[Field.CURRENCY_A]?.symbol ?? '',
                assetB: currencies[Field.CURRENCY_B]?.symbol ?? '',
              })}
              data={price?.invert()?.toSignificant(6) ?? '-'}
            />
          </AutoColumn>
        </AutoRow>
      </AutoColumn>
    </AutoRow>
  )
}

export default PoolPriceWrapper
