import React from "react";
import { Card, CardBody, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import useTheme from '../../hooks/useTheme'

const StyledCardWrapper = styled.div`
  min-width: 350px;
  
  @media screen and (max-width: 470px) {
    min-width: 300px;
  }
  
  @media screen and (max-width: 360px) {
    min-width: 260px;
  }
`

interface ISinglePriceCard {
  title: string;
  data: string;
}

export const SinglePriceCard = (props: ISinglePriceCard) => {

  const { theme } = useTheme()

  const { title, data } = props;

  return (
    <StyledCardWrapper>
      <Card padding="16px" background={theme.colors.input}>
        <CardBody>
          <Text
            color="textSubtle"
            textTransform="capitalize"
            mb="12px"
          >
            {title}
          </Text>
          <Text color="text" textTransform="capitalize" fontSize="32px">
            {data}
          </Text>
        </CardBody>
      </Card>
    </StyledCardWrapper>
  )
}