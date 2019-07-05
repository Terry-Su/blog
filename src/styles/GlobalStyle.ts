import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
  body {
    font-size: '16px';
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
    /* background: #f8f3ef; */
    background: hsl(27, 39%, 95%);
    @media (max-width: 576px){
      box-sizing: border-box;
      padding: 20px;
    }
  }
`
export default GlobalStyle
