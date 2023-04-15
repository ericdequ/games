import Head from 'next/head';
import SnakeGame from '../components/SnakeGame';
import { Button, useColorMode } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export default function Snake() {
  const router = useRouter();
  const { colorMode } = useColorMode();

  return (
    <>
      <Head>
      </Head>
      <Button
        colorScheme={colorMode === 'light' ? 'gray' : 'blue'}
        position="fixed"
        top={4}
        left={4}
        zIndex={10}
        onClick={() => router.back()}
      >
        Back to Home
      </Button>
      <SnakeGame />
    </>
  );
}
