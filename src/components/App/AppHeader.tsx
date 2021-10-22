import React from 'react'
import styled from 'styled-components'
import {
  Text,
  Flex,
  Heading,
  IconButton,
  ArrowBackIcon,
  NotificationDot,
  Button,
  RefreshIcon,
} from '@pancakeswap/uikit'
import { Link } from 'react-router-dom'
import { useExpertModeManager } from 'state/user/hooks'
import GlobalSettings from 'components/Menu/GlobalSettings'
import Transactions from './Transactions'
import QuestionHelper from '../QuestionHelper'
import SwapPageSettingsButton from '../SwapPageSettingButton'

interface Props {
  title: string
  subtitle: string
  helper?: string
  backTo?: string
  noConfig?: boolean
  onSwapPage?: boolean
  padding?: string
  hideSettingsIcon?: boolean
  hideTransactionIcon?: boolean
  margin?: string
  independentSubtitle?: boolean
}

type BackFuncInterface = { isBackFunc?: false; backFunction?: never } | { isBackFunc?: true; backFunction: () => void }
type RefreshButtonInterface =
  | { refreshButton?: false; refreshFunction?: never }
  | { refreshButton?: true; refreshFunction: () => void }

type AppHeaderInterface = Props & BackFuncInterface & RefreshButtonInterface

const AppHeaderContainer = styled(Flex)<{ padding?: string }>`
  align-items: start;
  justify-content: space-between;
  padding: ${({ padding }) => padding || '24px 24px 0 24px'};
  width: 100%;
  //border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const AppHeader: React.FC<AppHeaderInterface> = ({
  title,
  subtitle,
  helper,
  backTo,
  noConfig = false,
  onSwapPage = false,
  isBackFunc = false,
  backFunction,
  padding,
  margin,
  hideSettingsIcon,
  hideTransactionIcon,
  refreshButton = false,
  refreshFunction,
  independentSubtitle,
}) => {
  const [expertMode] = useExpertModeManager()

  return (
    <Flex flexDirection="column">
      <AppHeaderContainer padding={padding} margin={margin}>
        <Flex alignItems="center" mr={noConfig ? 0 : '16px'}>
          {isBackFunc && backFunction && (
            <IconButton mt="-6px" onClick={backFunction} variant="text">
              <ArrowBackIcon width="26px" />
            </IconButton>
          )}
          {backTo && (
            <IconButton as={Link} to={backTo}>
              <ArrowBackIcon width="26px" />
            </IconButton>
          )}
          <Flex flexDirection="column">
            <Heading as="h2" mb="8px">
              {title}
            </Heading>
            {!independentSubtitle && <Flex alignItems='center'>
              {helper && <QuestionHelper text={helper} mr='4px' placement='top-start' />}
              <Text color='textSubtle' fontSize='14px'>
                {subtitle}
              </Text>
            </Flex>}
          </Flex>
        </Flex>
        {!noConfig && (
          <Flex alignItems="start" marginTop="-8px">
            {refreshButton && refreshFunction && (
              <IconButton onClick={refreshFunction} variant="text">
                <RefreshIcon width="24px" />
              </IconButton>
            )}
            <NotificationDot show={expertMode}>
              {!hideSettingsIcon ? onSwapPage ? <SwapPageSettingsButton /> : <GlobalSettings /> : null}
            </NotificationDot>
            {!hideTransactionIcon && <Transactions />}
          </Flex>
        )}
      </AppHeaderContainer>
      {independentSubtitle && <Flex alignItems='center' ml="24px">
        {helper && <QuestionHelper text={helper} mr='4px' placement='top-start' />}
        <Text color='textSubtle' fontSize='14px'>
          {subtitle}
        </Text>
      </Flex>}
    </Flex>
  )
}

export default AppHeader
