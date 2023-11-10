import Head from "next/head";
import SnakeGame from "../components/SnakeGame";
import { Button, useColorMode, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import styles from "../../styles/snake.module.css";
import { isMobile } from "react-device-detect";

const MotionBox = motion(Box);

export default function Snake() {
  const router = useRouter();
  const { colorMode } = useColorMode();

  const snakeBackgroundStyle = {
    backgroundImage: `url(${"../../public/snake/Snake/2/2.webp"})`,
  };

  return (
    <>
      <Head>
        <title>Snake Game</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Press+Start+2P&display=swap"
        />
      </Head>
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
        bg={colorMode === "light" ? "black" : "gray.800"}
        style={isMobile ? snakeBackgroundStyle : null}
      >
        <Box>
          <SnakeGame />
        </Box>
      </MotionBox>
    </>
  );
}
