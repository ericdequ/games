import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Box, Heading, Flex, useColorMode, Button } from '@chakra-ui/react';
import styles from '../../styles/snake.module.css';
import { isMobile } from 'react-device-detect';

const Snake = dynamic(() => import('snake-game-react'), { ssr: false });


const SnakeGameComponent = () => {
  const { colorMode } = useColorMode();
  const [score, setScore] = useState(0);

  const textColor = colorMode === 'light' ? 'black' : 'white';
  const snakeColor = colorMode === 'light' ? '#2D3748' : '#63B3ED';
  const foodColor = colorMode === 'light' ? '#E53E3E' : '#F6E05E';

  useEffect(() => {
    const updateScore = (newScore) => {
      setScore(newScore);
    };
    window.addEventListener('snakeScore', (event) => {
      updateScore(event.detail);
    });

    return () => {
      window.removeEventListener('snakeScore', updateScore);
    };
  }, []);

  const mobileControls = (
    <Flex className={styles.controlsContainer}>
      <Button className={styles.controlButton}>Up</Button>
      <Button className={styles.controlButton}>Left</Button>
      <Button className={styles.controlButton}>Right</Button>
      <Button className={styles.controlButton}>Down</Button>
    </Flex>
  );

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
      <Box className={styles.scoreBoard}>{}</Box>
      <Box w="100%" maxW="500px">
        <Snake
          color1={snakeColor}
          color2={foodColor}
          onScoreUpdate={(newScore) => {
            setScore(newScore);
          }}
        />
      </Box>
      {isMobile && mobileControls}
    </Box>
  );
};

export default SnakeGameComponent;
