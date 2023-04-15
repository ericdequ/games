import {
  Box,
  Button,
  useColorMode,
  Heading,
  VStack,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { games } from "../../data";
import Head from "next/head";
import { motion } from "framer-motion";
import useArrowKeys from "../../hooks/useArrowKeys";
import { ArrowUpIcon, ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";

const MotionHeading = motion(Heading);
const MotionBox = motion(Box);

export default function Game() {
  const router = useRouter();
  const { id } = router.query;
  const game = games.find((game) => game.id === parseInt(id));
  const { colorMode } = useColorMode();
  const [isLoading, setIsLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [iframeElement, setIframeElement] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstructions(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const handleArrowKeyPress = useCallback((key) => {
    if (iframeElement) {
      iframeElement.contentWindow.postMessage({ key }, "*");
    }
  }, [iframeElement]);

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
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <title>{game.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" /> {/* Add mobile responsiveness */}
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
<MotionBox
initial={{ opacity: 1 }}
animate={{ opacity: showInstructions ? 1 : 0 }}
transition={{ duration: 1 }}
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
</MotionBox>
<MotionBox
initial={{ opacity: 0 }}
animate={{ opacity: showInstructions ? 0 : 1 }}
transition={{ duration: 1 }}
zIndex={showInstructions ? -1 : 1}
>
<Box>
<div dangerouslySetInnerHTML={{ __html: game.iframe }} />
</Box>
</MotionBox>
<HStack mt={4} spacing={4}> {/* Add arrow key inputs */}
<IconButton
aria-label="Move Up"
icon={<ArrowUpIcon />}
onClick={() => handleArrowKeyPress("ArrowUp")}
/>
<IconButton
aria-label="Move Left"
icon={<ArrowLeftIcon />}
onClick={() => handleArrowKeyPress("ArrowLeft")}
/>
<IconButton
aria-label="Move Right"
icon={<ArrowRightIcon />}
onClick={() => handleArrowKeyPress("ArrowRight")}
/>
<IconButton
aria-label="Move Down"
icon={<ArrowDownIcon />}
onClick={() => handleArrowKeyPress("ArrowDown")}
/>
</HStack>
<HStack mt={4} spacing={4}>
<IconButton
  aria-label="Move Up"
  icon={<ArrowUpIcon />}
  onClick={() => handleArrowKeyPress("ArrowUp")}
/>
<IconButton
  aria-label="Move Left"
  icon={<ArrowLeftIcon />}
  onClick={() => handleArrowKeyPress("ArrowLeft")}
/>
<IconButton
  aria-label="Move Right"
  icon={<ArrowRightIcon />}
  onClick={() => handleArrowKeyPress("ArrowRight")}
/>
<IconButton
  aria-label="Move Down"
  icon={<ArrowDownIcon />}
  onClick={() => handleArrowKeyPress("ArrowDown")}
/>
</HStack>
</VStack>
</Box>
</>
);
};