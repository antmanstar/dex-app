import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Card } from '@pancakeswap/uikit'
import { AppState } from '../../state'
import { FarmDetails } from './FarmDetails'
import { FarmsStake } from './FarmsStake'
import { FarmsUnStake } from './FarmsUnstake'

interface IFarmDetailsCard {
  data: any
  hideDetailsHeading?: boolean
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

  const { data, hideDetailsHeading } = props

  const renderBody = () => {
    switch (activeBodyType) {
      case 'claim':
        return <></>
      case 'stake':
        return <FarmsStake data={data} />
      case 'unstake':
        return <FarmsUnStake data={data} />
      case 'details':
        return <FarmDetails data={data} hideDetailsHeading={hideDetailsHeading}/>
      default:
        return <FarmDetails data={data} hideDetailsHeading={hideDetailsHeading}/>
    }
  }

  return <FarmsDetails>{renderBody()}</FarmsDetails>
}
