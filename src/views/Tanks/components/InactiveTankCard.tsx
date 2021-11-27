import React, { useCallback, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Card, Flex, Text, Skeleton, useMatchBreakpoints, CalculatorIcon, useModal, Button } from '@pancakeswap/uikit'
import { DeserializedFarm } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { getAddress } from 'utils/addressHelpers'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import { useWidth } from '../../../hooks/useWidth'
import useTheme from '../../../hooks/useTheme'
import { getBalanceAmount, getBalanceNumber } from '../../../utils/formatBalance'
import { useFarmUser } from '../../../state/farms/hooks'
import { BIG_TEN } from '../../../utils/bigNumber'

const StyledCard = styled(Card) <{ isActive?: boolean }>`
  padding: 20px;
  align-self: baseline;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 2px solid ${({ theme }) => theme.colors.backgroundAlt};
  background-color: ${({ isActive, theme }) => theme.colors.backgroundAlt};


  &:hover {
    // background: ${({ theme }) => theme.colors.primary};
    transform: translateY(-5px);
    box-shadow: 0px 5px 12px rgb(126 142 177 / 20%);
    border-color: ${({ theme }) => theme.colors.primary};
        
    h2 {
      color: ${({ theme }) => theme.colors.primaryButtonText};
    }
  }
`

const BoxedTextWrapper = styled.div`
  background: ${({ theme }) => theme.colors.boxedTextBg};
  border-radius: 2px;
  padding: 0px 5px;
  display: inline-block;
  width: 72px;
`

interface TankCardProps {
  tokens,
  matic,
  data,
  isCardActive?: boolean
}

const InactiveTankCard: React.FC<TankCardProps> = ({
  tokens,
  matic,
  data,
  isCardActive,
}) => {
  const { t } = useTranslation()
  const width = useWidth()
  const { theme } = useTheme()


  return (
    <StyledCard isActive={isCardActive} >
      <Flex flexDirection="column">
        <Flex mb="20px" justifyContent="space-between" width="100%">
          <Flex flexDirection="column">
            <Text fontSize="22px" fontWeight="500">Earn WMATIC</Text>
            <BoxedTextWrapper>
              <Text fontSize="12px" fontWeight="500" color="white">Stake ECO</Text>
            </BoxedTextWrapper>
          </Flex>
          <Flex>
            <img
              width="87px"
              height="67px"
              src="/images/token_logos/wmatic.png"
              alt="wmatic"
            />
          </Flex>
        </Flex>
        <Flex mb="15px" justifyContent="space-between" alignItems="center">
          <Text fontSize="16px" fontWeight="500">{t('DETAILS')}</Text>
          <Button onClick={() => console.log("Community")} scale="sm" variant="text" padding="0px">
            <Text fontSize="16px" fontWeight="500" color={theme.colors.primary}>{t('Community')}</Text>
          </Button>
        </Flex>
        <Flex mb="45px" justifyContent="space-between" alignItems="center">
          <Text fontSize="14px" fontWeight="500">{t('Total Staked')}</Text>
          <Text fontSize="14px" fontWeight="500">493.822</Text>
        </Flex>
        <Button mb="5px" onClick={() => console.log("Unlock")} scale="md" variant="primary">
          <Text fontSize="16px" fontWeight="500" color="white">{t('Unblock')}</Text>
        </Button>
        <Button onClick={() => console.log("View Project Site")} scale="sm" variant="text" padding="0px">
          <Text fontSize="14px" fontWeight="500" color={theme.colors.primary}>{t('View Project Site')}</Text>
        </Button>
      </Flex>
    </StyledCard>
  )
}

export default InactiveTankCard
