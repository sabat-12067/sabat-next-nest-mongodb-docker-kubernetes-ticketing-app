import { useEffect, useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import { Alert, Button, Container, Title } from '@mantine/core';
import { useRouter } from 'next/router';

interface OrderResponse {
  createdAt: string;
  expiresAt: string;
  id: string;
  status: string;
  ticket: string;
  updatedAt: string;
  userId: string;
}

const OrderShow = ({ currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const router = useRouter();
  const { data: order, errors: orderErros } = useRequest<OrderResponse>({
    path: `/orders/${router.query.orderId}`,
    method: 'get',
    execute: true,
  });
  const {
    data,
    errors,
    refetch: submit,
  } = useRequest({
    path: '/payments',
    method: 'post',
    body: {
      orderId: order?.id || null,
      transactionId: `transactionId-${order?.id}`,
    },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      if (!order?.expiresAt) {
        return;
      }
      const msLeft = new Date(order.expiresAt).getTime() - new Date().getTime();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();

    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <Title>Order Expired</Title>;
  }

  const initiatePayment = () => {
    submit();
  };

  return (
    <Container>
      <Title order={4}>Time left to pay: {timeLeft} seconds</Title>
      <Button onClick={() => initiatePayment()}>Pay</Button>
      {errors && <Alert color="red">{errors}</Alert>}
    </Container>
  );
};

export default OrderShow;
