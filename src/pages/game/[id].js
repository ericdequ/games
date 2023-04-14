// pages/game/[id].js
import { useRouter } from 'next/router';
import { games } from '../../data';
import Head from 'next/head';
import { Box } from '@chakra-ui/react';

export default function Game() {
  const router = useRouter();
  const { id } = router.query;
  const game = games.find((game) => game.id === parseInt(id));

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
      <Box width="100%" display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <div dangerouslySetInnerHTML={{ __html: game.iframe }} />
      </Box>
    </>
  );
}
