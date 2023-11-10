// pages/_app.js
import {
  ChakraProvider,
  extendTheme,
  CSSReset,
  Center,
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import "@fontsource/press-start-2p/400.css"; // Import the arcade font

const theme = extendTheme({
  fonts: {
    heading: "Press Start 2P",
    body: "Press Start 2P",
  },
  styles: {
    global: {
      "html, body": {
        background:
          "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/background/background.webp')",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
