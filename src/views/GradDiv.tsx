import React from 'react'
import styled from 'styled-components'


const StyledGradDiv = styled.div`
  max-height: 100%;
  max-width: 100%;

  &:before {
    content: "";
    z-index: -1;
    position: absolute;
    width: 1146px;
    height: calc(100% - 56px);
    right: -750px;
    top: 50px;
    background: ${({theme}) => theme.colors.gradients.radialRight};
    opacity: .7;
  }

  &:after {
    content: "";
    z-index: -1;
    position: absolute;
    width: 1228px;
    height: 100%;
    left: -742px;
    top: -50px;
    background: ${({theme}) => theme.colors.gradients.radialLeft};
    opacity: .7;
  }
`

export const GradDiv = () => {
  return (
    <StyledGradDiv />
  )
}
