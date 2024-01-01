import styled from 'styled-components';
import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import HeaderMenu from '../components/HeaderMenu/HeaderMenu';
const StyledPage = styled.div`
  .page {
  }
`;

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.styled-components file.
   */
  return (
    <StyledPage>
      <HeaderMenu />
      <Welcome />
      <ColorSchemeToggle />
    </StyledPage>
  );
}

export default Index;
