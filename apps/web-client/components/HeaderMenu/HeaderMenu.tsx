import {
  Group,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  rem,
} from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';
import classes from './HeaderMenu.module.css';
import LoginButton from '../LoginButton/LoginButton';
import Link from 'next/link';

import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

export function HeaderMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const { data: session } = useSession();
  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signOut();
    }
  }, [session]);

  return (
    <Box pb={120}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Group h="100%" gap={0} visibleFrom="sm">
            <Link href="/" className={classes.link}>
              Home
            </Link>

            <Link href="/tickets/new" className={classes.link}>
              Create Ticket
            </Link>
          </Group>

          <Group visibleFrom="sm">
            <Link href="/orders" className={classes.link}>
              Orders
            </Link>
            <LoginButton />
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <Link href="#" className={classes.link}>
            Home
          </Link>

          <Link href="#" className={classes.link}>
            Learn
          </Link>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            <LoginButton />
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}

export default HeaderMenu;
