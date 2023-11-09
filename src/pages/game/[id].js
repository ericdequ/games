import { useEffect, useState, useCallback } from "react";
import { isMobile } from "react-device-detect";
import styles from "../../styles/Game.module.css";
import { useRouter } from "next/router";
import {
  Box,
  VStack,
  Heading,
  Button,
  IconButton,
  HStack,
  useColorMode,
} from "@chakra-ui/react";
import {
  ArrowUpIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowDownIcon,
} from "@chakra-ui/icons";
import Head from "next/head";
import { games } from "../../data";

const useArrowKeys = (callback) => {
  useEffect(() => {
    const arrowKeys = new Set([
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
    ]);

    const handleKeyPress = (event) => {
      if (arrowKeys.has(event.key)) {
        callback(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [callback]);
};

export default function Game() {
  const router = useRouter();
  const { id } = router.query;
  const game = games.find((game) => game.id === parseInt(id));
  const { colorMode } = useColorMode();
  const [isLoading, setIsLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [iframeElement, setIframeElement] = useState(null);

  const handleButtonTouchStart = (key, event) => {
    console.log("touched", key);
    event.preventDefault();
    handleArrowKeyPress(key);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstructions(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === "keydown") {
        const arrowKeys = new Set([
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
        ]);

        if (arrowKeys.has(event.data.key)) {
          handleArrowKeyPress(event.data.key);
        }
      }
    };
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleArrowKeyPress = useCallback(
    (key) => {
      if (iframeElement && iframeElement.contentWindow) {
        const eventObj = {
          type: "keydown",
          bubbles: true,
          cancelable: true,
          view: iframeElement.contentWindow,
          key: key,
          code: key,
        };

        iframeElement.contentWindow.postMessage(eventObj, "*");
      }
    },
    [iframeElement],
  );

  useArrowKeys(handleArrowKeyPress);

  if (!game) {
    return null;
  }

  const iframeRef = (element) => {
    if (element) {
      setIframeElement(element);
    }
  };

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
        position="relative"
      >
        <VStack
          spacing={4}
          alignItems="center"
          className={styles.gameContainer}
        >
          <Heading as="h2" size="xl">
            {game.title}
          </Heading>
          <Box
            display={showInstructions ? "block" : "none"}
            position="absolute"
            zIndex={showInstructions ? 1 : -1}
            backgroundColor="rgba(255, 255, 255, 0.8)"
            borderRadius="md"
            padding="1rem"
          >
            <Heading as="h3" size="xl" mb={4} color="black">
              Instructions
            </Heading>
            <pre
              style={{
                fontSize: "1.25rem",
                lineHeight: "1.5",
                whiteSpace: "pre-wrap",
                textAlign: "center",
                color: "black",
              }}
            >
              {game.instructions}
            </pre>
          </Box>
          <Box
            display={showInstructions ? "none" : "block"}
            zIndex={showInstructions ? -1 : 1}
          >
            <div
              ref={iframeRef}
              dangerouslySetInnerHTML={{ __html: game.iframe }}
            />
          </Box>
          <HStack
            mt={4}
            spacing={4}
            className={isMobile ? styles.controlsContainer : ""}
          >
            <IconButton
              aria-label="Move Up"
              icon={<ArrowUpIcon />}
              onTouchStart={(event) => handleButtonTouchStart("ArrowUp", event)}
              className={isMobile ? styles.controlButton : ""}
              style={{ touchAction: "none" }}
            />
            <IconButton
              aria-label="Move Left"
              icon={<ArrowLeftIcon />}
              onTouchStart={(event) =>
                handleButtonTouchStart("ArrowLeft", event)
              }
              className={isMobile ? styles.controlButton : ""}
              style={{ touchAction: "none" }}
            />
            <IconButton
              aria-label="Move Right"
              icon={<ArrowRightIcon />}
              onTouchStart={(event) =>
                handleButtonTouchStart("ArrowRight", event)
              }
              className={isMobile ? styles.controlButton : ""}
              style={{ touchAction: "none" }}
            />
            <IconButton
              aria-label="Move Down"
              icon={<ArrowDownIcon />}
              onTouchStart={(event) =>
                handleButtonTouchStart("ArrowDown", event)
              }
              className={isMobile ? styles.controlButton : ""}
              style={{ touchAction: "none" }}
            />
          </HStack>
        </VStack>
      </Box>
    </>
  );
}
