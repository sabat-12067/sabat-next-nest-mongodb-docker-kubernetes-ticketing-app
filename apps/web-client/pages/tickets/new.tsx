import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import {
  Container,
  Title,
  Button,
  Group,
  TextInput,
  LoadingOverlay,
  Loader,
  Box,
  Alert,
  List,
} from '@mantine/core';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const { data, errors, loading, refetch } = useRequest({
    path: '/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = (event) => {
    event.preventDefault();

    refetch();
  };

  const onBlur = () => {
    const value = parseInt(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value);
  };

  return (
    <Container>
      <Box
        component="form"
        maw={400}
        mx="auto"
        onSubmit={onSubmit}
        pos="relative"
      >
        <Title>Create a Ticket</Title>
        <LoadingOverlay
          visible={loading}
          loaderProps={{ children: <Loader /> }}
        />
        <TextInput
          label="Title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextInput
          label="Price"
          placeholder="0"
          value={price}
          onBlur={onBlur}
          onChange={(e) => setPrice(e.target.value)}
          mt="md"
        />

        {errors && (
          <Alert color="red">
            <List>
              {errors.map((message) => (
                <List.Item key={message}>{message}</List.Item>
              ))}
            </List>
          </Alert>
        )}

        <Group justify="flex-start" mt="md">
          <Button type="submit" disabled={loading}>
            Submit
          </Button>
        </Group>
      </Box>
    </Container>
  );
};

export default NewTicket;
