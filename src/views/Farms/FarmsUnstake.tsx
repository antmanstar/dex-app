import { Button, Flex, Heading, Input, Text } from '@pancakeswap/uikit'
import React from "react"
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { useTranslation } from '../../contexts/Localization'
import { LightGreyCard } from '../../components/Card'
import { CurrencyLogo } from '../../components/Logo'
import { AppHeader } from '../../components/App'
import { setShowSettings } from '../../state/swap/actions'
import { setActiveBodyType } from '../../state/farms'

interface IFarmsStake {
  data: any
}

const StyledLightGreyCard = styled(LightGreyCard)`
  display: flex;
  flex-direction: column;
`

const Wrapper = styled(Flex)`
  padding: 18px;
`

const StyledHeading = styled(AppHeader)`
  font-size: 20px;
  font-weight: 500;
`

const StakingInput = styled(Input)`
  width: 100px;
  font-size: 24px;
`

export const FarmsUnStake: React.FC<IFarmsStake> = (props: IFarmsStake) => {

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { data } = props
  const { token, quoteToken, lpSymbol } = data

  const lpSymbolFormatted = lpSymbol && lpSymbol.split(" ")[0].toUpperCase()

  return (
    <Wrapper flexDirection="column">
      <StyledHeading
        title={t('Unstake')}
        padding="0"
        margin="0 0 0 -14px"
        subtitle=""
        backFunction={() => dispatch(setActiveBodyType("details"))}
        headingFontSize="20px"
        headingFontWeight="500"
        isBackFunc
        hideSettingsIcon
        hideTransactionIcon
      />
      <Flex justifyContent="space-between" px="4px">
        <Text fontWeight="500">
          {t("Amount")}
        </Text>
        <Text className="cursor-pointer">
          {lpSymbolFormatted}-{t("LP")} {t("Tokens")}: 0
        </Text>
      </Flex>
      <StyledLightGreyCard mb="12px">
        <Flex justifyContent="space-between" alignItems="center" >
          <Text>
            Pool Token
          </Text>
          <Text>
            ≈ $217
          </Text>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex justifyContent="center" alignItems="center">
            <CurrencyLogo currency={token} size="30px"/>
            {quoteToken && <CurrencyLogo currency={quoteToken} size='30px' style={{ marginLeft: "-8px" }} />}
            <Flex justifyContent="center" alignItems="center" ml="4px">
              {lpSymbolFormatted}
            </Flex>
          </Flex>
          <StakingInput dir="rtl" placeholder="0" />
        </Flex>
      </StyledLightGreyCard>
      <Button>
        {t("Unstake")}
      </Button>
    </Wrapper>
  )
}
