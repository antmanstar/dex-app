import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from '@pancakeswap/uikit/dist/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Poppins', sans-serif;
  }
  body {
    background-color: ${({theme}) => theme.colors.backgroundMain};
      // background-image: ${({ theme }) =>
            theme.isDark ? "url('/grad-left.png'), url('/grad-right.png')" : "url('/grad-left.png'), url('/grad-right.png')"};
    //background-repeat: no-repeat, no-repeat, no-repeat;
    //background-position: left top, right bottom;
    //background-size: 550px, 500px, cover;
    @media screen and (min-width: 576px) and (max-width: 1269px) {
      //background-size: 800px, 500px, cover;
    }
    @media screen and (max-width: 576px) {
      //background-size: cover;
    }

    overflow-x: hidden;

    &:before {
      content: " ";
      position: absolute;
      right: 0;
      left: 0;
      top: 0;
      bottom: 0;
      background: ${({theme}) => theme.colors.gradients.bodyBg};
      z-index: -1;
      opacity: .5;
    }
    img {
      height: auto;
      max-width: 100%;
    }
  }
  .cursor-pointer {
    cursor: pointer;
  }
`

export default GlobalStyle
