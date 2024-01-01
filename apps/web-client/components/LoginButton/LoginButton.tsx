import { Button } from '@mantine/core';
import type { ButtonProps } from '@mantine/core';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function LoginBtn(props: ButtonProps) {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <Button variant="default" onClick={() => signOut()} {...props}>
          Sign out
        </Button>
      </>
    );
  }

  return (
    <>
      <Button onClick={() => signIn('fusionauth')} {...props}>
        Sign in
      </Button>
    </>
  );
}
