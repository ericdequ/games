import {
  Box,
  Button,
  useColorMode,
  Heading,
  VStack,
  CircularProgress,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { games } from "../../data";
import Head from "next/head";
import { motion } from "framer-motion";

const MotionHeading = motion(Heading);

export default function Game() {
  const router = useRouter();
  const { id } = router.query;
  const game = games.find((game) => game.id === parseInt(id));
  const { colorMode } = useColorMode();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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
        colorScheme={colorMode === "light" ? "gray" : "blue"}
        position="fixed"
        top={4}
        left={4}
        zIndex={10}
        onClick={() => router.back()}
      >
        Back to Home
      </Button>
      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        {isLoading && (
          <CircularProgress
            isIndeterminate
            color="teal.300"
            size="100px"
            zIndex={11}
          />
        )}
        <VStack spacing={4} alignItems="center">
          <MotionHeading
            as="h2"
            size="xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            >
            {game.title}
            </MotionHeading>
            <Box
            style={{
            filter: isLoading ? "blur(10px)" : "blur(0)",
            transition: "filter 0.8s",
            }}
            >
            <div dangerouslySetInnerHTML={{ __html: game.iframe }} />
            </Box>
            </VStack>
            </Box>
            </>
            );
            }
