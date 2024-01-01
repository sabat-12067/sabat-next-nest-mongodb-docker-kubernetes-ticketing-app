import '@mantine/core/styles.css';
import './styles.css';
import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import { SessionProvider } from 'next-auth/react';
import { theme } from '../theme';

function CustomApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <main className="app">
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </main>
    </MantineProvider>
  );
}

export default CustomApp;
