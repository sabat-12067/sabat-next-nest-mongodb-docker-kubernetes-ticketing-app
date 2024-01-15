import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import { auth } from '../../auth';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Container, Button, Title, Alert, List } from '@mantine/core';
import { Ticket } from '../../interfaces';

const TicketShow = ({
  ticket,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    data,
    errors,
    refetch: submit,
  } = useRequest({
    path: '/orders',
    method: 'post',
    body: {
      ticketId: ticket?.id,
    },
    onSuccess: (order) => {
      console.log(order);

      return Router.push('/orders/[orderId]', `/orders/${order.id}`);
    },
  });

  return (
    <Container>
      <Title order={1}>{ticket?.title}</Title>
      <Title order={4}>Price: {ticket?.price}</Title>

      <Button variant="filled" onClick={() => submit()}>
        Purchase
      </Button>

      {errors && (
        <Alert color="red">
          <List>
            {errors.map((message) => (
              <List.Item key={message}>{message}</List.Item>
            ))}
          </List>
        </Alert>
      )}
    </Container>
  );
};

export const getServerSideProps = (async (context) => {
  // Fetch data from external API

  const { ticketId } = context.query;

  const authInfo = await auth(context.req, context.res);
  const token = authInfo?.access_token;

  // const { data } = await client.get(`/api/tickets/${ticketId}`);
  let ticket: Ticket | null = null;
  try {
    ticket = await (
      await fetch(`https://ticketing.dev/api/tickets/${ticketId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
    ).json();
  } catch (error) {
    console.error(error);
  }

  return { props: { ticket } };
}) satisfies GetServerSideProps<{ ticket: Ticket | null }>;

export default TicketShow;
