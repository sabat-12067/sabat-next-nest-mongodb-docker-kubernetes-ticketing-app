import '@mantine/core/styles.css';
import './styles.css';
import type { AppProps } from 'next/app';
import { Container, Loader, MantineProvider } from '@mantine/core';
import { SessionProvider, useSession } from 'next-auth/react';
import HeaderMenu from '../components/HeaderMenu/HeaderMenu';
import { theme } from '../theme';
import type { ReactNode } from 'react';

function AppComponent({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider
      session={session}
      refetchInterval={10 * 60}
      refetchOnWindowFocus={true}
    >
      <MantineProvider theme={theme}>
        <main className="app">
          <HeaderMenu />
          <Container fluid>
            {Component.auth ? (
              <Auth>
                <Component {...pageProps} />
              </Auth>
            ) : (
              <Component {...pageProps} />
            )}
          </Container>
        </main>
      </MantineProvider>
    </SessionProvider>
  );
}

function Auth({ children }: { children: ReactNode }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true });

  if (status === 'loading') {
    return <Loader />;
  }

  return children;
}

export default AppComponent;
