import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { Route, useRouteMatch, useLocation, NavLink, Link } from 'react-router-dom'
import BigNumber from 'bignumber.js'
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
  useMatchBreakpoints
} from '@pancakeswap/uikit'
import { ChainId } from '@pancakeswap/sdk'
import styled from 'styled-components'
import Page from 'views/Page'
import { useFarms, usePriceCakeBusd } from 'state/farms/hooks'
import { useTranslation } from 'contexts/Localization'
import useTheme from '../../hooks/useTheme'
import { useWidth } from '../../hooks/useWidth'
import GraphYellow from '../../../public/images/chart-yellow.svg'

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
  padding: 20px;
  align-self: top;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 2px solid ${({ theme }) => theme.colors.backgroundAlt};
  background-color: ${({ isActive, theme }) => theme.colors.backgroundAlt};
  margin-top: 34px;
  min-height:217px;
  .maxsupply_main {
    display: flex;
    justify-content: space-between;
    @media screen and (max-width: 963px) {
        flex-direction: column;
    }
}
.progress_bar{
    margin-top:40px
}
`


const StyledCard = styled(Card)`
  padding: 20px;
  align-self: baseline;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 2px solid ${({ theme }) => theme.colors.backgroundAlt};
  background-color: ${({ isActive, theme }) => theme.colors.backgroundAlt};
  min-height:315px;
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
div{
    display:flex;
    justify-content: start;
    align-items: center;
    .flex-row{
        flex-direction: column  !important;
    }
    img{
        margin-right:15px
    }
}


ul li{
    font-size:14px;
    list-style-type:none;
    padding-bottom:15px;
    display:flex;
    span{
        width:15px;
        height:15px;
        border-radius:50%;
        margin-right: 10px;
    }
}

.lightblue{
    background:#61d5ed;
}

.lightpurple{
    background:#878df3;
}

.lightorange{
    background:#f53c24;
}

.trading_volume{
    font-size:12px;
    display:flex;
    margin-bottom:10px;
    width: 100%;
    .volume_icon{
        color:#c8c8c8;
        margin-right:10px
    }
    .volume_icon img{
        margin-right:10px
    }
    .progress{
        width:100px;
        height:30px;
        background:#61d5ed;
        margin:0 10px
    }
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

const BannerSupply = styled(Card)`
  padding: 20px;
  align-self: top;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 2px solid ${({ theme }) => theme.colors.backgroundAlt};
  background-color: ${({ isActive, theme }) => theme.colors.backgroundAlt};
  margin-top: 34px;
  min-height:180px;
  .banner_participant{
      text-align:center;
      
  }
  .banner_participant:before{
    content: '';
    background-image: url(./images/building.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center bottom;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    bottom: 0;
  }
  .banner_participant.useecoswap {
    display: flex;
    align-items: center;
    height: 96%;
}

  .banner_participant.useecoswap:before{
    content: '';
    background-image: url(./images/astronot.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center bottom;
    position: absolute;
    width: 225px;
    height: 100%;
    right: 0;
    bottom: 0;
    left: auto;
  }

`


const Dashboard: React.FC = () => {
  const { path } = useRouteMatch()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const { data: farmsLP, userDataLoaded } = useFarms()
  const cakePrice = usePriceCakeBusd()
  const [query, setQuery] = useState('')
  const { account } = useWeb3React()
  const [sortOption, setSortOption] = useState('liquidity')
  const chosenFarmsLength = useRef(0)
  const { theme } = useTheme()
  const [activeFarmCard, setActiveFarmCard] = useState<any>(undefined)
  const width = useWidth()
  const shouldRenderModal = width < 969
  const [tab, setTab] = useState<string>('all')
  const isArchived = pathname.includes('archived')
  const isInactive = pathname.includes('history')
  const isActive = !isInactive && !isArchived

  

  return (
    <Page>
      <AppBody>
        <DashThreeContainer className="minheight">
            <StyledCard>
                <BlockHeader>
                    <Text fontSize="14px" fontWeight="400">Total Value Locked</Text>
                    <Text fontSize="18px" fontWeight="700" color={theme.colors.green}>$31,787,112</Text>
                    <img src="/images/chart-yellow.svg" alt="" />
                </BlockHeader>
                <BlockBody>
                <img src="/images/blue-graph.png" alt="" />
                <ul>
                    <li><span className="lightblue">&nbsp;</span> Poly</li>
                    <li><span className="lightpurple">&nbsp;</span> Avex</li>
                    <li><span className="lightorange">&nbsp;</span> ETH</li>
                </ul>
                </BlockBody>
            </StyledCard>
            <StyledCard>
                <BlockHeader>
                    <Text fontSize="14px" fontWeight="400">Total Value Locked</Text>
                    <Text fontSize="18px" fontWeight="700" color={theme.colors.green}>$31,787,112</Text>
                    <img src="/images/chart-yellow.svg" alt="" />
                </BlockHeader>
                <BlockBody>
                    <img src="/images/blue-graph.png" alt="" />
                    <ul>
                        <li><span className="lightblue">&nbsp;</span> Poly</li>
                        <li><span className="lightpurple">&nbsp;</span> Avex</li>
                        <li><span className="lightorange">&nbsp;</span> ETH</li>
                    </ul>
                </BlockBody>
            </StyledCard>
            <StyledCard>
                <BlockHeader>
                    <Text fontSize="14px" fontWeight="400">Market Capitalization</Text>
                    <Text fontSize="18px" fontWeight="700" color={theme.colors.green}>$31,787,112</Text>
                </BlockHeader>
                <BlockBody>
                <img src="/images/line-graph.png" alt="" />
                </BlockBody>
            </StyledCard>
            <StyledCard>
                <BlockHeader>
                    <Text fontSize="14px" fontWeight="400">Total Value Locked</Text>
                    <Text fontSize="18px" fontWeight="700" color={theme.colors.green}>$31,787,112</Text>
                    <Text fontSize="12px" color="#fb8e8e">- $499,554<span>(24hr)</span></Text> 
                    <img src="/images/chart-yellow.svg" alt="" />
                </BlockHeader>
                <BlockBody>
                    <div className="d-flex flex-row">
                    <div className="trading_volume">
                        <div className="volume_icon">
                            <img src="/images/tokens/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270.png" alt="" width="30" />
                            Biance
                        </div>
                        <div>
                            <div className="progress">&nbsp;</div>
                            <div className="count">$1,829,464,515</div>
                        </div>
                    </div>
                    <div className="trading_volume">
                        <div className="volume_icon">
                            <img src="/images/tokens/0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3.png" alt="" width="30" />
                            Dogicoin
                        </div>
                        <div>
                            <div className="progress">&nbsp;</div>
                            <div className="count">$1,829,464,515</div>
                        </div>
                    </div>
                    <div className="trading_volume">
                        <div className="volume_icon">
                            <img src="/images/tokens/0x5F88AB06e8dfe89DF127B2430Bba4Af600866035.png" alt="" width="30" />
                            Polygon
                        </div>
                        <div>
                            <div className="progress">&nbsp;</div>
                            <div className="count">$1,829,464,515</div>
                        </div>
                    </div>
                    <div className="trading_volume">
                        <div className="volume_icon">
                            <img src="/images/tokens/0x42F6f551ae042cBe50C739158b4f0CAC0Edb9096.png" alt="" width="30" />
                            Polygon
                        </div>
                        <div>
                            <div className="progress">&nbsp;</div>
                            <div className="count">$1,829,464,515</div>
                        </div>
                    </div>
                    </div>
                </BlockBody>
            </StyledCard>
            <StyledCard>
                <BlockHeader>
                    <Text fontSize="14px" fontWeight="400">Trading Volume</Text>
                    <Text fontSize="18px" fontWeight="700" color={theme.colors.green}>$31,787</Text>
                    <Text fontSize="18px" fontWeight="700" color={theme.colors.green}>$31,787</Text>
                </BlockHeader>
                <BlockBody>
                    <img src="/images/line-graph.png" alt="" />
                </BlockBody>
            </StyledCard>
            <StyledCard>
                <BlockHeader>
                    <Text fontSize="14px" fontWeight="400">Total Eco Burned </Text>
                    <Text fontSize="18px" fontWeight="700" color={theme.colors.green}>31,787</Text>
                    <Text fontSize="18px" fontWeight="700" color={theme.colors.green}>31,787</Text>
                    <img src="/images/chart-yellow.svg" alt="" />
                    <img className="green-icon" src="/images/chart-green.svg" alt="" />
                </BlockHeader>
                <BlockBody>
                <img src="/images/pie-chart.png" alt="" />
                </BlockBody>
            </StyledCard>
        </DashThreeContainer>
        <DashtwoContainer>
            <StyledMaxSupply>
                <div  className="maxsupply_main">
                    <div className="maxsupply">
                        <Text fontSize="14px" fontWeight="400" marginBottom="15px">Total Value Locked</Text>
                        <Text fontSize="18px" fontWeight="700" color={theme.colors.purple}>$31,787,112</Text>
                        <Text fontSize="18px" fontWeight="700" color={theme.colors.purple}>$31,787,112</Text>
                    </div>
                    <div className="maxsupply">
                        <Text fontSize="14px" fontWeight="400" marginBottom="15px">Total Value Locked</Text>
                        <Text fontSize="18px" fontWeight="700" color={theme.colors.yellow}>$31,787,112</Text>
                        <Text fontSize="18px" fontWeight="700" color={theme.colors.yellow}>$31,787,112</Text>
                    </div>
                    <div className="maxsupply">
                        <Text fontSize="14px" fontWeight="400" marginBottom="15px">Total Value Locked</Text>
                        <Text fontSize="18px" fontWeight="700" color={theme.colors.green}>$31,787,112</Text>
                        <Text fontSize="18px" fontWeight="700" color={theme.colors.green}>$31,787,112</Text>
                    </div>
                </div>
                <div className="progress_bar">
                     <img src="/images/progress.png" alt="" />
                </div>
            </StyledMaxSupply>
            <StyledMaxSupply>
                <div className="maxsupply">
                    <Text fontSize="22px" fontWeight="600" marginBottom="15px">Anti-Whale</Text>
                    <Text fontSize="14px" fontWeight="400" marginBottom="5px">Max Transfer Amount</Text>
                    <Text fontSize="18px" fontWeight="700" color={theme.colors.purple} marginBottom="15px">$31,787,112</Text>
                    <Text fontSize="14px" fontWeight="400" color={theme.colors.failure} marginBottom="5px">Transfer Tax %</Text>
                    <Text fontSize="18px" fontWeight="700" color={theme.colors.green}>2.00%</Text>
                </div>     
            </StyledMaxSupply>
        </DashtwoContainer>
        <SliderContainer>
            <BannerSupply>
                <div  className="maxsupply_main">
                   Slider one
                </div>
                
            </BannerSupply>
            <BannerSupply>
                <div className="banner_participant">
                    <Text fontSize="14px" fontWeight="400" marginBottom="15px">You have not participated in any farms</Text>
                </div>     
            </BannerSupply>
        </SliderContainer>
        <SliderContainer>
            <BannerSupply>
                <div  className="maxsupply_main">
                   Slider Two
                </div>
                
            </BannerSupply>
            <BannerSupply>
                <div className="banner_participant useecoswap">
                    Use Ecoland
                </div>     
            </BannerSupply>
        </SliderContainer>
        <SliderContainer>
            <BannerSupply>
                <div  className="maxsupply_main">
                   Slider three
                </div>
                
            </BannerSupply>
            <BannerSupply>
                <div className="banner_participant">
                    <Text fontSize="14px" fontWeight="400" marginBottom="15px">You have not participated in any farms</Text>
                </div>     
            </BannerSupply>
        </SliderContainer>
      </AppBody>
    </Page>
  )
}

export default Dashboard
