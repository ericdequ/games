import React from 'react';
import dynamic from 'next/dynamic';
import { Box, Heading, Text, Flex, Image } from "@chakra-ui/react";

const Snake = dynamic(() => import('snake-game-react'), { ssr: false });

const SnakeGameComponent = () => {
  return (
    <Box
      bg="linear-gradient(to bottom, #ff8a00, #e52e71)"
      p={5}
      color="white"
      minHeight="100vh"
      textAlign="center"
    >
      <Flex align="center" direction="column" justify="center">

        <Heading as="h1" fontSize="5xl" mt={5} mb={3}>
          Snake Game
        </Heading>
        <Box w="100%" maxW="500px">
          <Snake
            color1="#248ec2"
            color2="#1d355e"
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default SnakeGameComponent;
