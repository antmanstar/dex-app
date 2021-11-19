import { Currency, Token } from '@pancakeswap/sdk'
import {
  AddIcon,
  Button,
  Card,
  CardBody,
  Flex,
  IconButton,
  MinusIcon, Td,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { Link } from 'react-router-dom'
import React from 'react'
import styled from 'styled-components'
import { useTranslation } from '../../../contexts/Localization'
import useTheme from '../../../hooks/useTheme'
import { CurrencyLogo } from '../../../components/Logo'

const StyledDetailsContainer = styled(Flex)`
  border-radius: 10px;
  padding: 12px;
  background-color: ${({theme}) => theme.colors.backgroundAlt};
  justify-content: space-between;
  min-width: 400px;
  ${({theme}) => theme.mediaQueries.md} {
    min-width: 500px;
  }
`

const StyledDetailsWrapper = styled.div`
  display: grid;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  grid-row-gap: 20px;

  grid-template-columns: 1fr 1fr 1fr;

  ${({ theme }) => theme.mediaQueries.xs} {
    grid-template-columns: 1fr 1fr 1fr;
  }
`

const StyledMobileCard = styled(Card)`
  background: ${({theme}) => theme.colors.background};
`

const StyledTr = styled.tr`
  border-radius: 10px;

  &:hover {
    & > td {
      background-color: ${({ theme }) => theme.colors.backgroundAlt2};
      ${StyledDetailsContainer} {
        background: rgba(3, 3, 3, 0.2);
      }

      &:last-child {
        border-bottom-right-radius: 10px;
        border-top-right-radius: 10px;
      }

      &:first-child {
        border-bottom-left-radius: 10px;
        border-top-left-radius: 10px;
      }
    }
  }
`

const StyledTd = styled(Td)`
  padding-top: 10px;
  padding-right: 16px;
  padding-bottom: 10px;
  padding-left: 16px;
  border-bottom: 1px solid #1c1f2b;
`

const TokenList = ({
   tokens,
   matic,
   volume,
   fees,
   liquidity,
   apr,
   userLiquidity,
   handleAddClick,
   handleRemoveClick
 }: {
  tokens: [Token, Token]
  matic: Currency
  volume: number
  fees: number
  liquidity: number
  apr: number,
  userLiquidity: any,
  handleAddClick: () => void,
  handleRemoveClick: () => void,
}) => {
  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()
  const { theme } = useTheme()

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
    // address2 = 'MATIC'
    // currency2 = matic
  }

  if (isMobile) {
    return (
      <tr>
        <a href={`/add/${address1}/${address2}`}>
          <StyledMobileCard mt="8px">
            <CardBody>
              <Flex mb="12px" alignItems="center">
                <div>
                  <CurrencyLogo currency={currency1} />
                  <CurrencyLogo currency={currency2} />
                </div>
                <Text ml="10px" fontSize="20px" bold>
                  {currency1?.symbol?.toUpperCase()} - {currency2?.symbol?.toUpperCase()}
                </Text>
              </Flex>
              <StyledDetailsWrapper>
                {[
                  { title: 'volume', value: `$${volume}` },
                  { title: 'liquidity', value: `$${liquidity}` },
                  { title: 'fees', value: `$${fees}` },
                  { title: "apr", value: `${apr}%` }
                ].map((singleValue) => {
                  return (
                    <Flex alignItems="start" flexDirection="column">
                      <Text color="textSubtle2" textTransform="capitalize" fontSize="12px">
                        {singleValue.title}:
                      </Text>
                      <Text color="text" textTransform="capitalize" fontSize="16px">
                        {singleValue.value}
                      </Text>
                    </Flex>
                  )
                })}
                <Flex alignItems="start" flexDirection="column">
                  <Text color="textSubtle2" textTransform="capitalize" fontSize="12px" mb="2px">
                    {t('my liquidity')}:
                  </Text>
                  <Flex justifyContent="flex-end" alignItems="center">
                    <Text fontSize="16px" mr="10px">${volume}</Text>
                    <IconButton
                      scale="sm"
                      variant="secondary"
                      size="16px"
                      borderColor={theme.colors.green}
                      borderRadius="50%"
                      borderWidth="1px"
                      // onClick={() => handleAddClick(address1, address2)}
                    >
                      <AddIcon color={theme.colors.green} />
                    </IconButton>
                    <IconButton
                      scale="sm"
                      size="16px"
                      variant="secondary"
                      borderColor="#fb8e8e"
                      borderRadius="50%"
                      borderWidth="1px"
                      marginLeft="8px">
                      <MinusIcon color="#fb8e8e" />
                    </IconButton>
                  </Flex>
                </Flex>
              </StyledDetailsWrapper>
            </CardBody>
          </StyledMobileCard>
        </a>
      </tr>
    )
  }

  return (
    <StyledTr>
      <StyledTd>
        <Button
          id={`pool-${address1}-${address2}`}
          as={Link}
          scale="xxs"
          variant="text"
          to={`/add/${address1}/${address2}`}
          pl="0"
        >
          <Flex>
            <CurrencyLogo currency={currency1} />
            <Flex marginLeft="-8px">
              <CurrencyLogo currency={currency2} />
            </Flex>
          </Flex>
          <Text ml="10px" fontSize="12px" fontWeight="500">
            {currency1?.symbol?.toUpperCase()} / {currency2?.symbol?.toUpperCase()}
          </Text>
        </Button>
      </StyledTd>
      <StyledTd>
        <Text fontSize="12px" fontWeight="500">${liquidity}</Text>
      </StyledTd>
      <StyledTd>
        <Text fontSize="12px" fontWeight="500">${volume}</Text>
      </StyledTd>
      <StyledTd>
        <Text fontSize="12px" fontWeight="500">${fees}</Text>
      </StyledTd>
      <StyledTd>
        <Flex background={theme.colors.green} display="flex" justifyContent="center" borderRadius="5px" width="52px">
          <Text color="white" fontSize="12px" mt="4px" mb="4px" textAlign="center" fontWeight="500">
            {apr}%
          </Text>
        </Flex>
      </StyledTd>
      <StyledTd>
        <Flex justifyContent="flex-end" alignItems="center">
          <Text fontSize="12px" fontWeight="500" mr="10px">{userLiquidity || "0.000"} LP</Text>
          <IconButton
            scale="sm"
            variant="secondary"
            size="16px"
            borderColor="#28d250"
            borderRadius="50%"
            borderWidth="2px"
            onClick={handleAddClick}
          >
            <AddIcon color="#28d250" />
          </IconButton>
          <IconButton
            scale="sm"
            size="16px"
            variant="secondary"
            borderColor="#fb8e8e"
            borderRadius="50%"
            borderWidth="2px"
            marginLeft="8px"
            onClick={handleRemoveClick}
          >
            <MinusIcon color="#fb8e8e" />
          </IconButton>
        </Flex>
      </StyledTd>
    </StyledTr>
  )
}

export default TokenList;