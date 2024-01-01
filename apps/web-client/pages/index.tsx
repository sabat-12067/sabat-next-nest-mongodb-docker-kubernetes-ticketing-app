import styled from 'styled-components';
import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import HeaderMenu from '../components/HeaderMenu/HeaderMenu';
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

const StyledPage = styled.div`
  .page {
  }
`;

export function Index() {
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signOut();
    }
  }, [session]);

  return (
    <StyledPage>
      <HeaderMenu />
      <Welcome />
      <ColorSchemeToggle />
    </StyledPage>
  );
}

export default Index;
