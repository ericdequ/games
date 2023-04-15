import Head from 'next/head';
import {
  Box,
  Grid,
  Heading,
  VStack,
  Button,
  Flex,
  Text,
  useColorMode,
  Image,
  IconButton,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { games } from '../data';

export default function Home() {
  const { colorMode } = useColorMode();

  const scrollToGames = () => {
    const gamesSection = document.getElementById('gamesSection');
    gamesSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>Games Showcase</title>
        <meta name="description" content="A collection of games" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
       
      </Head>
  
      <Box minHeight="100vh" pos="relative">
        <Box
          as="div"
          pos="absolute"
          top={0}
          left={0}
          w="100%"
          h="100vh"
          
          bgSize="cover"
          bgPosition="center"
          bgAttachment="fixed"
          zIndex={-1}
        />
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          textAlign="center"
          bg="rgba(0, 0, 0, 0.5)"
        >
          <VStack spacing={6} alignItems="center">
            <Heading
              as="h1"
              size="2xl"
              color="white"
              fontFamily="'Press Start 2P', monospace"
              letterSpacing="0.1em"
            >
              Games Showcase
            </Heading>
            <IconButton
              aria-label="Scroll down"
              icon={<ChevronDownIcon boxSize={8} />}
              colorScheme="whiteAlpha"
              onClick={scrollToGames}
            />
          </VStack>
        </Flex>
        <Box id="gamesSection" p={6}>
          <Grid
            templateColumns={[
              'repeat(auto-fill, minmax(250px, 1fr))',
              'repeat(auto-fill, minmax(300px, 1fr))',
            ]}
            gap={6}
            justifyContent="center"
            alignItems="start"
          >
            {games.map((game) => (
              <Box
                key={game.id}
                bg={colorMode === 'light' ? 'white' : 'gray.700'}
                borderRadius="lg"
                p={4}
                boxShadow="xl"
                _hover={{ transform: 'scale(1.05)', transition: 'all 0.3s' }}
              >
                <Image
                  src={game.thumbnail}
                  alt={`${game.title} Thumbnail`}
                  borderRadius="lg"
                  mb={3}
                  objectFit="cover"
                  width="100%"
                  height="200px"
                />
                <Heading
                  as="h2"
                  size="md"
                  mb={3}
                  fontFamily="'Press Start 2P', monospace"
                  letterSpacing="0.1em"
                >
                  {game.title}
                </Heading>
                <Text
                  mb={3}
                  fontSize="sm"
                  fontFamily="'Press Start 2P', monospace"
                  letterSpacing="0.1em"
                >
                  {game.description}
                </Text>
                <Button
                  colorScheme="teal"
                  fontFamily="'Press Start 2P', monospace"
                  letterSpacing="0.1em"
                  onClick={() => {
                    window.location.href = `/game/${game.id}`;
                  }}
                >
                  Play
                </Button>
              </Box>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );

};