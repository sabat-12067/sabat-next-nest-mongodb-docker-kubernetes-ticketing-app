import { Container, Table } from '@mantine/core';
import type { Session } from 'next-auth';
import { GetServerSideProps } from 'next';
import { Order } from '../../interfaces';
import { auth } from '../../auth';

interface Props {
  session: Session | null;
  orders: Order[];
}

const OrderIndex = ({ session, orders }: Props) => {
  const rows = orders.map((order) => {
    return (
      <Table.Tr key={order.id}>
        <Table.Td>{order.ticket.title}</Table.Td>
        <Table.Td>{order.status}</Table.Td>
        <Table.Td>{order.createdAt}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Container>
      <h1>Orders</h1>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Title</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Created At</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Container>
  );
};

export const getServerSideProps = (async (context) => {
  // Fetch data from external API

  const session = await auth(context.req, context.res);
  const token = session?.access_token;

  let orders: Order[] | [] = [];
  try {
    orders = await (
      await fetch(`https://ticketing.dev/api/orders`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
    ).json();
  } catch (error) {
    console.error(error);
  }

  return { props: { orders } };
}) satisfies GetServerSideProps<{ orders: Order[] | null }>;

export default OrderIndex;
