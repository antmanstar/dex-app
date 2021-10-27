import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Card } from '@pancakeswap/uikit'
import { AppState } from '../../state'
import { FarmDetails } from './FarmDetails'

interface IFarmDetailsCard {
  data: any
  hideDetailsHeading?: boolean
  location: any
  userDataReady: boolean
}

type BackFuncInterface = { isBackFunc?: false; backFunction?: never } | { isBackFunc?: true; backFunction: () => void }
type Props = IFarmDetailsCard & BackFuncInterface

const FarmsDetails = styled(Card)`
  //padding: 18px;
  overflow-y: auto;
`

export const FarmDetailsCard: React.FC<Props> = (props: Props) => {
  const activeBodyType = useSelector<AppState, AppState['farms']['activeBodyType']>(
    (state) => state.farms.activeBodyType,
  )

  const { data, hideDetailsHeading, location, userDataReady } = props

  const renderBody = () => {
    switch (activeBodyType) {
      // case 'claim':
      //   return <></>
      // case 'stake':
      //   return <FarmsStake data={data} />
      // case 'unstake':
      //   return <FarmsUnStake data={data} />
      case 'details':
        return <FarmDetails userDataReady={userDataReady} location={location} data={data} hideDetailsHeading={hideDetailsHeading}/>
      default:
        return <FarmDetails userDataReady={userDataReady} location={location} data={data} hideDetailsHeading={hideDetailsHeading}/>
    }
  }

  return <FarmsDetails>{renderBody()}</FarmsDetails>
}
