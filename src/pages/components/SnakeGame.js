import React from 'react';
import dynamic from 'next/dynamic';
import { Box, Heading, Flex, useColorMode } from '@chakra-ui/react';

const Snake = dynamic(() => import('snake-game-react'), { ssr: false });

const SnakeGameComponent = () => {
  const { colorMode } = useColorMode();

  const textColor = colorMode === 'light' ? 'black' : 'white';
  const snakeColor = colorMode === 'light' ? '#2D3748' : '#63B3ED';
  const foodColor = colorMode === 'light' ? '#E53E3E' : '#F6E05E';

  return (
    <Box
      width="100%"
      minHeight="100%"
      color={textColor}
      textAlign="center"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Heading
        as="h1"
        fontSize="5xl"
        mt={5}
        mb={3}
        fontFamily="'Press Start 2P', monospace"
        letterSpacing="0.1em"
      >
        Snake Game
      </Heading>
      <Box w="100%" maxW="500px">
        <Snake
          color1={snakeColor}
          color2={foodColor}
        />
      </Box>
    </Box>
  );
};

export default SnakeGameComponent;
