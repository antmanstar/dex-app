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
    background: ${({ theme }) =>
      theme.isDark ? "url('/bg-dark.jpg') no-repeat center center" : "url('/bg-light.jpg') no-repeat center center"};
    background-size: cover;

    img {
      height: auto;
      max-width: 100%;
    }
  }
`

export default GlobalStyle
