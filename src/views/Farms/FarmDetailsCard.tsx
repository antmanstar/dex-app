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
}

const FarmsDetails = styled(Card)`
  //padding: 18px;
`

export const FarmDetailsCard: React.FC<IFarmDetailsCard> = (props: IFarmDetailsCard) => {

  const activeBodyType = useSelector<AppState, AppState['farms']['activeBodyType']>((state) => state.farms.activeBodyType)

  const { data } = props;
  
  const renderBody = () => {
    switch (activeBodyType) {
      case 'claim': return <></>;
      case 'stake': return <FarmsStake data={data} />;
      case 'unstake': return <FarmsUnStake data={data} />;
      case 'details': return <FarmDetails data={data} />;
      default: return <FarmDetails data={data} />;
    }
  }

  return (
    <FarmsDetails>
      {renderBody()}
    </FarmsDetails>
  )
}
