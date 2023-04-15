import Head from 'next/head';
import { Box, Grid, Heading, VStack, Button, Flex, Text, useColorMode } from '@chakra-ui/react';
import { games } from '../data';

export default function Home() {
  const { colorMode } = useColorMode();

  return (
    <>
      <Head>
        <title>Games Showcase</title>
        <meta name="description" content="A collection of games" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          bgGradient={colorMode === 'light' ? 'linear(to-r, blue.500, green.500)' : 'gray.800'}
        >
          <Heading as="h1" size="2xl" color="white" mb={6}>
            Games Showcase
          </Heading>
          <Grid templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} gap={6}>
            {games.map((game) => (
              <Box
                key={game.id}
                bg={colorMode === 'light' ? 'white' : 'gray.700'}
                borderRadius="lg"
                p={4}
                boxShadow="xl"
                _hover={{ transform: 'scale(1.05)', transition: 'all 0.3s' }}
              >
                <Heading as="h2" size="md" mb={3}>
                  {game.title}
                </Heading>
                <Text mb={3}>{game.description}</Text>
                <Button
                  colorScheme="teal"
                  onClick={() => {
                    window.location.href = `/game/${game.id}`;
                  }}
                >
                  Play
                </Button>
              </Box>
            ))}
          </Grid>
        </Flex>
      </Box>
    </>
  );
}
