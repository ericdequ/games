// pages/game/[id].js
import { useRouter } from 'next/router';
import { games } from '../../data';
import Head from 'next/head';
import { Box, Button, useColorMode, Heading, VStack } from '@chakra-ui/react';

export default function Game() {
  const router = useRouter();
  const { id } = router.query;
  const game = games.find((game) => game.id === parseInt(id));
  const { colorMode } = useColorMode();

  if (!game) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{game.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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
      <Box width="100%" display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <VStack spacing={4} alignItems="center">
          <Heading as="h2" size="xl">
            {game.title}
          </Heading>
          <div dangerouslySetInnerHTML={{ __html: game.iframe }} />
        </VStack>
      </Box>
    </>
  );
}
