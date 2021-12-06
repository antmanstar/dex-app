import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { Route, useRouteMatch, useLocation, NavLink, Link } from 'react-router-dom'
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import history from 'routerHistory'
import 'pure-react-carousel/dist/react-carousel.es.css';
import { Currency, Token } from '@pancakeswap/sdk'
import { useWeb3React } from '@web3-react/core'
import {
  Heading,
  Text,
  Button,
  Flex,
  Card,
  SearchIcon,
  Tab,
  TabMenu,
  Input,
  Progress,
  useMatchBreakpoints
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import Page from 'views/Page'
import { useFarms, usePriceCakeBusd } from 'state/farms/hooks'
import { useTranslation } from 'contexts/Localization'
import { ResponsivePie } from '@nivo/pie'
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import { useCurrency, useAllTokens } from 'hooks/Tokens';
import useTheme from '../../hooks/useTheme'
import { useWidth } from '../../hooks/useWidth'
import { CurrencyLogo } from '../../components/Logo'

const AppBody = styled(`div`)`
  max-width: 1185px;
  width: 100%;
  z-index: 1;
  margin: 50px 0;

  @media screen and (max-width: 763px) {
    margin-bottom: 50px;
  }
`

const DashThreeContainer = styled.div`
display: grid;

grid-template-columns: 1fr 1fr 1fr;
grid-column-gap: 35px;
grid-row-gap: 30px;



@media screen and (max-width: 963px) {
  grid-template-columns: 1fr 1fr;
}

@media screen and (max-width: 660px) {
  grid-template-columns: 1fr;
}
`
const DashtwoContainer = styled.div`
display: grid;
grid-template-columns:65.67% 31.35%;;
grid-column-gap: 35px;
grid-row-gap: 30px;

@media screen and (max-width: 963px) {
  grid-template-columns: 1fr 1fr;
}

@media screen and (max-width: 660px) {
  grid-template-columns: 1fr;
}
`
const StyledMaxSupply = styled(Card)`
  padding: 5px 20px 5px 20px;
  align-self: top;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 2px solid ${({ theme }) => theme.colors.backgroundAlt};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  margin-top: 34px;
  min-height: 191px;   
`

const SupplyInfoWrapper = styled(Flex)`
  margin-bottom: 35px;
  @media screen and (max-width: 860px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`

const SupplyRightInfoWrapper = styled(Flex)`
  flex-direction: column;
  @media screen and (max-width: 860px) {
    align-items: center;
    text-align: center;
  }
`

const StyledCard = styled(Card)`
  padding: 20px;
  align-self: baseline;
  width: 100%;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 2px solid ${({ theme }) => theme.colors.backgroundAlt};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  min-height:315px;
`

const StyledButtonBack = styled(ButtonBack)`
  position: absolute;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  border: none;
  width: 22px;
  height: 22px;
  z-index: 300;
  margin-top: 85px;
  margin-left: 4px;
`

const StyledButtonNext = styled(ButtonNext)`
  position: absolute;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  right: 0;
  border: none;
  width: 22px;
  height: 22px;
  z-index: 300;
  margin-top: 85px;
  margin-right: 4px;
`

const BlockHeader = styled(Card)`
  margin-bottom:20px;
  img{
      position: absolute;
      right: 0;
      top: 0;
      width: 25px;
  }

  img.green-icon{
      right:30px
  }
  span{
      color:#9c9c9c;
  }
`

const BlockBody = styled(Card)`
  justify-content: start;
  align-items: center;
  flex-direction: column;
`

const LineChartWrapper = styled(Flex)`
  height: 180px;
  border-left: 3px solid ${({ theme }) => theme.colors.text};
  border-bottom: 3px solid ${({ theme }) => theme.colors.text};
  margin-bottom: 10px;

  circle {
    fill: url(#lineGradient);
  }

  path {
    stroke: url(#lineGradient);
  }
`

const BarChartWrapper = styled(Flex)`
  height: 180px;
  border-left: 3px solid ${({ theme }) => theme.colors.text};
  border-bottom: 3px solid ${({ theme }) => theme.colors.text};
  margin-bottom: 10px;

  g > rect {
    fill: url(#lineGradient);
  }
`

const SliderContainer = styled.div`
  display: grid;
  grid-template-columns:65.67% 31.35%;;
  grid-column-gap: 35px;
  grid-row-gap: 30px;

  @media screen and (max-width: 963px) {
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (max-width: 660px) {
    grid-template-columns: 1fr;
  }
`

const StyledCarouselProvider = styled(CarouselProvider)`
  position: relative;
`

const StyledSlider = styled(Slider)`
  min-height: 180px;
  &:first-child{
    will-change: unset;
  }
`

const SpliterLine = styled.div`
  margin: 15px 0px;
  height: 1px;
  width: 100%;
  background: black;
`

const SlideCardWrapper = styled(Flex)`
  padding: 0px 15px;
  width: 100%;
  height: 100%;
  min-height: 180px;
`

const SlideCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  width: 100%;
  min-height: 180px;
  padding: 10px;
`

const BackgroundBuildingFlex = styled(Card)`
  background-image: url('/images/building.png');
  background-repeat: no-repeat;
  background-position: bottom;
  min-height:180px;
  padding: 20px;
`

const BackgroundCratorFlex = styled(Card)`
  background-image: url('/images/crator.png');
  background-repeat: no-repeat;
  background-position: right bottom;
  min-height:180px;
  padding: 20px;  

  & > div {
    justify-content: flex-start;
    align-items: center;
    display: flex;
  }
`

const AbsText = styled(Text)`
  position: absolute;
  right: 20px;
  top: 120px;
`

const StyledLabel = styled(Text)<{progress?: number}>`
  bottom: 40px;
  left: ${({ progress }) => `calc(${progress}% - 24px)`};
  position: absolute;
  font-size: 14px;
  font-weight: 700;

  @media screen and (max-width: 860px) {
    bottom: 20px;
  }
`

const UnderlineText = styled(Text)`
  text-decoration: underline;  
  text-underline-offset: 3px;
`

const Dashboard: React.FC = () => {
  const { path } = useRouteMatch()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { isMobile, isTablet, isDesktop, isXs } = useMatchBreakpoints()
  const { theme } = useTheme()
  const width = useWidth()

  const matic = useCurrency('matic')
  const progress = 75;

  // Pie Graph
  const myTheme = {
    fontSize: 14,
    tooltip: {
      color: "#fff",
      container: {
        background: '#333',
      },
    }
  };

  const Pie = ({ data }) => (
    <ResponsivePie
      data={data}
      margin={{ top: 10, right: 130, bottom: 10, left: 10 }}
      innerRadius={0.7}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={5}
      borderWidth={1}
      borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
      enableArcLinkLabels={false}
      enableArcLabels={false}
      theme={myTheme}
      colors={data.map((i: { color: any }) => i.color)}
      legends={[
        {
          anchor: 'right',
          direction: 'column',
          justify: false,
          translateX: 115,
          translateY: 0,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 30,
          itemTextColor: theme.colors.text,
          itemDirection: 'left-to-right',
          itemOpacity: 1,
          symbolSize: 15,
          symbolShape: 'circle',
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: theme.colors.primary
              }
            }
          ]
        }
      ]}
    />
  )

  const lockedValByChainData = [
    {
      "id": "polygon",
      "label": "Polygon",
      "value": 2,
      "color": 'BlueViolet'
    },
    {
      "id": "avax",
      "label": "Avax",
      "value": 8,
      "color": 'Crimson'
    },
    {
      "id": "eth",
      "label": "ETH",
      "value": 90,
      "color": 'DodgerBlue'
    }
  ]

  const lockedValByTypeData = [
    {
      "id": "vaults",
      "label": "Vaults",
      "value": 80,
      "color": '#efd600'
    },
    {
      "id": "farms",
      "label": "Farms",
      "value": 2,
      "color": '#f524e9'
    },
    {
      "id": "tanks",
      "label": "Tanks",
      "value": 4,
      "color": theme.colors.purple
    },
    {
      "id": "lending",
      "label": "Lending",
      "value": 16,
      "color": 'red'
    }
  ]

  const Line = ({ data }) => (
    <ResponsiveLine
      data={data}
      margin={{ top: 20, right: 20 }}
      yScale={{ type: 'linear', min: 0, max: 150, stacked: true, reverse: false }}
      xScale={{ type: 'linear', min: 0, max: 50, stacked: true, reverse: false }}
      axisTop={null}
      axisRight={null}
      axisBottom={null}
      axisLeft={null}
      pointSize={15}
      pointColor="#723fcb"
      colors={["#61d5ed"]}
      pointLabelYOffset={-12}
      enableGridX={false}
      enableGridY={false}
      lineWidth={3}
      useMesh={!false}
      theme={myTheme}
    />
  )

  const marketCapitalizationData = [
    {
      "id": "market",
      "data": [
        {
          "x": 5,
          "y": 100
        },
        {
          "x": 20,
          "y": 30
        },
        {
          "x": 30,
          "y": 90
        },
        {
          "x": 40,
          "y": 20
        },
        {
          "x": 50,
          "y": 110
        }
      ]
    }
  ]

  const Bar = ({ data }) => (
    <ResponsiveBar
      data={data}
      keys={['total']}
      indexBy="week"
      margin={{ top: 10, right: 10 }}
      padding={0.7}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      axisTop={null}
      axisRight={null}
      axisBottom={null}
      axisLeft={null}
      role="application"
      ariaLabel="Total ECO Burned"
      enableGridX={false}
      enableGridY={false}
      theme={myTheme}
      enableLabel={false}
    />
  )

  const ecoBurnedData = [
    {
      "week": "Mon",
      "total": 125
    },
    {
      "week": "Tue",
      "total": 100
    },
    {
      "week": "Wed",
      "total": 177
    },
    {
      "week": "Thu",
      "total": 89,
    },
    {
      "week": "Fri",
      "total": 189,
    },
    {
      "week": "Sat",
      "total": 100,
    }
  ]

  const renderSlideCard = () => {
    return (
      <SlideCard>
        <Flex justifyContent="center" mt="10px">
          <CurrencyLogo currency={matic} size="28px" />
          <Flex ml={isXs ? '-20px' : '-10px'}>
            <CurrencyLogo currency={matic} size="28px" />
          </Flex>
          <Flex ml={isXs ? '-20px' : '-10px'}>
            <CurrencyLogo currency={matic} size="28px" />
          </Flex>
        </Flex>
        <Text fontSize="12px" fontWeight="400" textAlign="center" mt="15px">Polygon/Avax/ETH</Text>
        <SpliterLine />
        <Flex justifyContent="space-between" mb="15px">
          <Text fontSize="12px" >APR</Text>
          <Text fontSize="12px" >146%</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text fontSize="12px" >TVL</Text>
          <Text fontSize="12px" >$226,743</Text>
        </Flex>
      </SlideCard>
    )
  }

  return (
    <Page>
      <svg height="0" width="0">
        <defs>
          <linearGradient id="lineGradient" gradientTransform="rotate(90)"><stop offset="0%" stopColor="#723fcb" /><stop offset="99%" stopColor="#61d5ed" /><stop offset="100%" stopColor="#61d5ed" /></linearGradient>
        </defs>
      </svg>
      <AppBody>
        <DashThreeContainer className="minheight">
          <StyledCard>
            <BlockHeader>
              <Text fontSize="14px" fontWeight="500">Total Value Locked</Text>
              <Text fontSize="18px" fontWeight="700" color={theme.colors.green}>$31,787,112</Text>
              <img src="/images/chart-yellow.svg" alt="" />
            </BlockHeader>
            <Flex height="180px" justifyContent="flex-start">
              <Pie data={lockedValByChainData} />
            </Flex>
          </StyledCard>
          <StyledCard>
            <BlockHeader>
              <Text fontSize="14px" fontWeight="500">Total Value Locked</Text>
              <Text fontSize="18px" fontWeight="700" color={theme.colors.green}>$31,787,112</Text>
              <img src="/images/chart-yellow.svg" alt="" />
            </BlockHeader>
            <Flex height="180px" justifyContent="flex-start">
              <Pie data={lockedValByTypeData} />
            </Flex>
          </StyledCard>
          <StyledCard>
            <BlockHeader>
              <Text fontSize="14px" fontWeight="500">Market Capitalization</Text>
              <Text fontSize="18px" fontWeight="700" color={theme.colors.green}>$31,787,112</Text>
            </BlockHeader>
            <LineChartWrapper height="180px" justifyContent="flex-start">
              <Line data={marketCapitalizationData} />
            </LineChartWrapper>
          </StyledCard>
          <StyledCard>
            <BlockHeader>
              <Text fontSize="14px" fontWeight="500">Trading Volume</Text>
              <Text fontSize="22px" fontWeight="700" color={theme.colors.purple}>$31,787,112</Text>
              <Flex><Text fontSize="12px" color="red">- $499,554</Text><Text fontSize="12px" color={theme.colors.textSubtle2}>(24hr)</Text></Flex>
              <img src="/images/chart-yellow.svg" alt="" />
            </BlockHeader>
            <BlockBody>
              <Flex flexDirection="column" mt="40px" mb="8px">
                <Flex alignItems="center" mt="12px" mb="12px">
                  <img src="/images/tokens/polygon.png" alt="" width="23px" />
                  <Text fontSize="12px" color={theme.colors.headerSubtleText} ml="8px" fontWeight="400" minWidth="70px">Polygon</Text>
                  <Flex width="64px" height="23px" background="BlueViolet" mr="10px" />
                  <Text fontSize="12px" >$1,829,464,515</Text>
                </Flex>
                <Flex alignItems="center" mt="12px" mb="12px">
                  <img src="/images/tokens/avax.png" alt="" width="23px" />
                  <Text fontSize="12px" color={theme.colors.headerSubtleText} ml="8px" fontWeight="400" minWidth="70px">Avax</Text>
                  <Flex width="2px" height="23px" background="Crimson" mr="10px" />
                  <Text fontSize="12px" >$14,566,321</Text>
                </Flex>
                <Flex alignItems="center" mt="12px" mb="12px">
                  <img src="/images/tokens/eth.png" alt="" width="23px" />
                  <Text fontSize="12px" color={theme.colors.headerSubtleText} ml="8px" fontWeight="400" minWidth="70px">ETH</Text>
                  <Flex width="3px" height="23px" background="DodgerBlue" mr="10px" />
                  <Text fontSize="12px" >$37,525,053</Text>
                </Flex>
              </Flex>
            </BlockBody>
          </StyledCard>
          <StyledCard>
            <BlockHeader>
              <Text fontSize="14px" fontWeight="500">Total Eco Minted</Text>
              <Text fontSize="22px" fontWeight="700" color={theme.colors.purple}>31,787</Text>
              <Text fontSize="18px" fontWeight="700" color={theme.colors.purple}>$31,787</Text>
            </BlockHeader>
            <LineChartWrapper height="180px" justifyContent="flex-start">
              <AbsText fontSize="12px" fontWeight="500" >Emission Rate : 0.32</AbsText>
              <Line data={marketCapitalizationData} />
            </LineChartWrapper>
          </StyledCard>
          <StyledCard>
            <BlockHeader>
              <Text fontSize="14px" fontWeight="500">Total Eco Burned</Text>
              <Text fontSize="22px" fontWeight="700" color={theme.colors.purple}>31,787</Text>
              <Text fontSize="18px" fontWeight="700" color={theme.colors.purple}>$31,787</Text>
              <img src="/images/chart-yellow.svg" alt="" />
              <img className="green-icon" src="/images/chart-green.svg" alt="" />
            </BlockHeader>
            <BarChartWrapper>
              <Bar data={ecoBurnedData} />
            </BarChartWrapper>
          </StyledCard>
        </DashThreeContainer>
        <DashtwoContainer>
          <StyledMaxSupply>
            <SupplyInfoWrapper justifyContent="space-between">
              <Flex flexDirection="column">
                <Text fontSize="14px" fontWeight="500" color={theme.colors.headerSubtleText} mb="15px" mt="15px">Max Supply</Text>
                <Text fontSize="22px" fontWeight="700" color={theme.colors.purple}>31,787,112</Text>
                <Text fontSize="18px" fontWeight="700" color={theme.colors.purple}>$31,787,112</Text>
              </Flex>
              <Flex flexDirection="column">
                <Text fontSize="14px" fontWeight="500" color={theme.colors.headerSubtleText} mb="15px" mt="15px">Circulating Supply</Text>
                <Text fontSize="22px" fontWeight="700" color={theme.colors.green}>31,787,112</Text>
                <Text fontSize="18px" fontWeight="700" color={theme.colors.green}>$31,787,112</Text>
              </Flex>
              <Flex flexDirection="column">
                <Text fontSize="14px" fontWeight="500" color={theme.colors.headerSubtleText} mb="15px" mt="15px">Total Supply</Text>
                <Text fontSize="22px" fontWeight="700" color={theme.colors.yellow}>31,787,112</Text>
                <Text fontSize="18px" fontWeight="700" color={theme.colors.yellow}>$31,787,112</Text>
              </Flex>
            </SupplyInfoWrapper>
            <div>
              <StyledLabel progress={progress}>
                {progress}%
              </StyledLabel>
              <Progress variant="custom" primaryStep={progress} />
            </div>
          </StyledMaxSupply>
          <StyledMaxSupply>
            <SupplyRightInfoWrapper>
              <Text fontSize="22px" fontWeight="700" color={theme.colors.headerSubtleText} mb="15px">Anti-Whale</Text>
              <Text fontSize="14px" fontWeight="500" color={theme.colors.headerSubtleText} mb="5px">Max Transfer Amount</Text>
              <Text fontSize="22px" fontWeight="700" color={theme.colors.purple} mb="15px">$31,787,112</Text>
              <Text fontSize="14px" fontWeight="500" color={theme.colors.failure} mb="5px">Transfer Tax %</Text>
              <Text fontSize="22px" fontWeight="700">2.00%</Text>
            </SupplyRightInfoWrapper>
          </StyledMaxSupply>
        </DashtwoContainer>
        <Flex flexDirection="column" mb="34px">
          <SliderContainer>
            <Flex justifyContent="space-between" mt="35px" mb="15px">
              <Text fontSize="22px" fontWeight="700" >Yield Farming</Text>
              <Button onClick={() => history.push("/farms")} scale="sm" variant="text" padding="0px">
                <UnderlineText textAlign="center" fontSize="14px" fontWeight="400" color={theme.colors.primary}>{t('Go to Farming')}</UnderlineText>
              </Button>
            </Flex>
            <div />
          </SliderContainer>
          <SliderContainer>
            <StyledCarouselProvider
              naturalSlideWidth={200}
              naturalSlideHeight={138}
              totalSlides={4}
              visibleSlides={width > 972 ? 3 : width > 763 ? 2 : 1}
            >
              <StyledButtonBack><Flex justifyContent="center" alignItems="center" flexDirection="column" height="22px"><Text fontSize="20px" fontWeight="400" textAlign="center">{`<`}</Text></Flex></StyledButtonBack>
              <StyledButtonNext><Flex justifyContent="center" alignItems="center" flexDirection="column" height="22px"><Text fontSize="20px" fontWeight="400" textAlign="center">{`>`}</Text></Flex></StyledButtonNext>
              <StyledSlider>
                <Slide index={0}><SlideCardWrapper>{renderSlideCard()}</SlideCardWrapper></Slide>
                <Slide index={1}><SlideCardWrapper>{renderSlideCard()}</SlideCardWrapper></Slide>
                <Slide index={2}><SlideCardWrapper>{renderSlideCard()}</SlideCardWrapper></Slide>
                <Slide index={3}><SlideCardWrapper>{renderSlideCard()}</SlideCardWrapper></Slide>
              </StyledSlider>
            </StyledCarouselProvider>
            <BackgroundBuildingFlex>
              <Text fontSize="14px" fontWeight="400" marginBottom="15px" textAlign="center">You have not participated in any farms</Text>
            </BackgroundBuildingFlex>
          </SliderContainer>
        </Flex>
        <Flex flexDirection="column" mb="34px">
          <SliderContainer>
            <Flex justifyContent="space-between" mt="35px" mb="15px">
              <Text fontSize="22px" fontWeight="700" >Vaults</Text>
              <Button onClick={() => history.push("/vault")} scale="sm" variant="text" padding="0px">
                <UnderlineText textAlign="center" fontSize="14px" fontWeight="400" color={theme.colors.primary}>{t('Go to Vaults')}</UnderlineText>
              </Button>
            </Flex>
            <div />
          </SliderContainer>
          <SliderContainer>
          <StyledCarouselProvider
              naturalSlideWidth={200}
              naturalSlideHeight={138}
              totalSlides={4}
              visibleSlides={width > 972 ? 3 : width > 763 ? 2 : 1}
            >
              <StyledButtonBack><Flex justifyContent="center" alignItems="center" flexDirection="column" height="22px"><Text fontSize="20px" fontWeight="400" textAlign="center">{`<`}</Text></Flex></StyledButtonBack>
              <StyledButtonNext><Flex justifyContent="center" alignItems="center" flexDirection="column" height="22px"><Text fontSize="20px" fontWeight="400" textAlign="center">{`>`}</Text></Flex></StyledButtonNext>
              <StyledSlider>
                <Slide index={0}><SlideCardWrapper>{renderSlideCard()}</SlideCardWrapper></Slide>
                <Slide index={1}><SlideCardWrapper>{renderSlideCard()}</SlideCardWrapper></Slide>
                <Slide index={2}><SlideCardWrapper>{renderSlideCard()}</SlideCardWrapper></Slide>
                <Slide index={3}><SlideCardWrapper>{renderSlideCard()}</SlideCardWrapper></Slide>
              </StyledSlider>
            </StyledCarouselProvider>
            <BackgroundCratorFlex>
              <Button variant="primary" scale="sm" height="40px" mt="10px" padding="10px"><Text fontSize="14px" color="white">{t('Use Ecoland')}</Text></Button>
            </BackgroundCratorFlex>
          </SliderContainer>
        </Flex>
        <Flex flexDirection="column" mb="34px">
          <SliderContainer>
            <Flex justifyContent="space-between" mt="35px" mb="15px">
              <Text fontSize="22px" fontWeight="700" >Tanks</Text>
              <Button onClick={() => history.push("/tanks")} scale="sm" variant="text" padding="0px">
                <UnderlineText textAlign="center" fontSize="14px" fontWeight="400" color={theme.colors.primary}>{t('Go to Tanks')}</UnderlineText>
              </Button>
            </Flex>
            <div />

          </SliderContainer>
          <SliderContainer>
          <StyledCarouselProvider
              naturalSlideWidth={200}
              naturalSlideHeight={138}
              totalSlides={4}
              visibleSlides={width > 972 ? 3 : width > 763 ? 2 : 1}
            >
              <StyledButtonBack><Flex justifyContent="center" alignItems="center" flexDirection="column" height="22px"><Text fontSize="20px" fontWeight="400" textAlign="center">{`<`}</Text></Flex></StyledButtonBack>
              <StyledButtonNext><Flex justifyContent="center" alignItems="center" flexDirection="column" height="22px"><Text fontSize="20px" fontWeight="400" textAlign="center">{`>`}</Text></Flex></StyledButtonNext>
              <StyledSlider>
                <Slide index={0}><SlideCardWrapper>{renderSlideCard()}</SlideCardWrapper></Slide>
                <Slide index={1}><SlideCardWrapper>{renderSlideCard()}</SlideCardWrapper></Slide>
                <Slide index={2}><SlideCardWrapper>{renderSlideCard()}</SlideCardWrapper></Slide>
                <Slide index={3}><SlideCardWrapper>{renderSlideCard()}</SlideCardWrapper></Slide>
              </StyledSlider>
            </StyledCarouselProvider>
            <BackgroundBuildingFlex>
              <Text fontSize="14px" fontWeight="400" marginBottom="15px" textAlign="center">You have not participated in any farms</Text>
            </BackgroundBuildingFlex>
          </SliderContainer>
        </Flex>
      </AppBody>
    </Page>
  )
}

export default Dashboard
