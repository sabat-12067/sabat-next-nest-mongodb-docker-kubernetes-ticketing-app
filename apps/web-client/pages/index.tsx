import styled from 'styled-components';
import type { InferGetStaticPropsType, GetStaticProps } from 'next';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';


import TicketList from '../components/TicketList/TicketList';
import { Container } from '@mantine/core';
import { Ticket } from '../interfaces';

const StyledPage = styled.div`
  .page {
  }
`;

export function Index({
  tickets,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <StyledPage>
      <ColorSchemeToggle />
      <Container>
        <TicketList tickets={tickets} />
      </Container>
    </StyledPage>
  );
}

export const getStaticProps = (async (_context) => {
  let data: Ticket[] | [] = [];
  try {
    data = await (await fetch('https://ticketing.dev/api/tickets')).json();
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      tickets: data,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
}) satisfies GetStaticProps;

export default Index;
