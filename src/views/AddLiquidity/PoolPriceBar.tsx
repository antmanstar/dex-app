import { Currency, Percent, Price } from '@pancakeswap/sdk'
import React from 'react'
import { Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { AutoColumn } from '../../components/Layout/Column'
import { AutoRow } from '../../components/Layout/Row'
import { ONE_BIPS } from '../../config/constants'
import { Field } from '../../state/mint/actions'
import { SinglePriceCard } from './SinglePriceCard'

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
  return (
    <AutoRow justify="space-between" gap="4px">
      <AutoColumn gap="md">
        <AutoRow justify="space-around" gap="4px">
          <AutoColumn justify="center">
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
          <AutoColumn justify="center">
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
