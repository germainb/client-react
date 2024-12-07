import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Roboto', sans-serif;
    background-color: #fff;
    margin: 0;
    padding: 0;
    color: #333;
  }

  h1, h2, h3, h4 {
    font-family: 'Roboto', sans-serif;
    color: #333;
  }
`;

export default GlobalStyle;
