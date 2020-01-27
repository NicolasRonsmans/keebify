import React from 'react';
import { createGlobalStyle } from 'styled-components';

import Three from './Three';

const GlobalStyle = createGlobalStyle`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
  }

  body {
    height: 100%;
    overflow: hidden;
    width: 100%;
  }
`;

function App() {
  return (
    <div>
      <GlobalStyle />
      <Three />
    </div>
  );
}

export default App;
