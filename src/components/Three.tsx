import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

import Three from '../lib/Three';

const Container = styled.div`
  > canvas {
    height: 100%;
    margin: 0;
    padding: 0;
    width: 100%;
  }
`;

function ThreeContainer() {
  const el = useRef<HTMLDivElement>(null);
  const three = useRef<Three>();

  useEffect(() => {
    if (!el.current) {
      return;
    }

    three.current = new Three(el.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [el]);

  return <Container ref={el} />;
}

export default ThreeContainer;
