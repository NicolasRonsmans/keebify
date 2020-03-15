import Head from 'next/head';
import Core from '@keebify/core';

function Home() {
  return (
    <>
      <Head>
        <title>Keebify</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Core />
    </>
  );
}

export default Home;
