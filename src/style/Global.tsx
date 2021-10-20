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
    background-image: ${({ theme }) =>
      theme.isDark ? "url('/grad-left.png'), url('grad-right.png'), url('/bg-dark.png')" : "url('/grad-left.png'), url('grad-right.png'), url('/bg-light.jpg')"};
    background-repeat: no-repeat, no-repeat, no-repeat;
    background-position: left bottom, right bottom, center center;
    background-size: 550px, 450px, cover;
    @media screen and (max-width: 576px) {
      background-size: cover;
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
