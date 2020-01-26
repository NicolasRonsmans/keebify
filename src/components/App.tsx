import React from 'react';
import { createGlobalStyle } from 'styled-components';

import Three from './Three';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    margin: 0;
    padding: 0;
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
