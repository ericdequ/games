import Head from 'next/head';
import SnakeGame from '../components/SnakeGame';
import { Button, useColorMode, Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function Snake() {
  const router = useRouter();
  const { colorMode } = useColorMode();

  return (
    <>
      <Head></Head>
      <Button
        colorScheme="teal"
        position="fixed"
        top={4}
        left={4}
        zIndex={10}
        onClick={() => router.back()}
      >
        Back to Home
      </Button>
      <MotionBox
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        position="relative"
        bg={colorMode === 'light' ? 'white' : 'gray.800'} // Add this line
      >
        <SnakeGame />
      </MotionBox>
    </>
  );
}
