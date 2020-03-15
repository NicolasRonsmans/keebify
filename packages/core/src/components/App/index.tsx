import dynamic from 'next/dynamic';
import React from 'react';

import { GlobalStyle } from './style.index';

const Three = dynamic(() => import('../Three'), { ssr: false });

function App() {
  return (
    <div>
      <GlobalStyle />
      <Three />
    </div>
  );
}

export default App;
