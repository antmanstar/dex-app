import React from 'react'
import styled from 'styled-components'

const StyledGradDiv = styled.div`
  max-height: 100%;
  max-width: 100%;
  position: absolute;
  height: calc(100vh - 100px);
  width: 100vw;

  // background-image: ${({ theme }) => theme.colors.gradients.radialLeft}, ${({ theme }) =>
    theme.colors.gradients.radialRight};
  // background-size: 1500px 1500px, 1428px;
  // background-repeat: no-repeat;
  // background-position: -1125px -300px, calc(100vw - 350px) 100px;

  // &:before {
  //   content: "";
  //   z-index: -1;
  //   position: absolute;
  //   width: 1146px;
  //   height: calc(100% - 56px);
  //   right: -750px;
  //   top: 50px;
  //   background: ${({ theme }) => theme.colors.gradients.radialRight};
  //   opacity: .7;
  // }
  //
  // &:after {
  //   content: "";
  //   z-index: -1;
  //   position: absolute;
  //   width: 1228px;
  //   height: 100%;
  //   left: -742px;
  //   top: -50px;
  //   background: ${({ theme }) => theme.colors.gradients.radialLeft};
  //   opacity: .7;
  // }
`

export const GradDiv = () => {
  return <StyledGradDiv />
}
