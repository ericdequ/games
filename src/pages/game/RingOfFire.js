import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  useToast,
  extendTheme,
  ChakraProvider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  useDisclosure,
} from "@chakra-ui/react";
import MainMenu from "../components/RingOfFireMenu";
import { Global, css } from "@emotion/react";
import { Flip } from "react-reveal";
import { createBreakpoints } from "@chakra-ui/theme-tools";
import "@fontsource/pacifico";
import "@fontsource/roboto-mono";

const breakpoints = createBreakpoints({
  sm: "30em",
  md: "48em",
  lg: "62em",
  xl: "80em",
  "2xl": "96em",
});

const theme = extendTheme({
  breakpoints,
});


const textStyle = css`
  font-size: 2rem;
  color: white;
  text-align: center;
`;

const fireAnimation = css`
  background: linear-gradient(90deg, #f12711, #f5af19);
  background-size: 300% 300%;
  animation: gradient 3s ease infinite;

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const rulesStyle = css`
  font-family: "Roboto Mono", monospace;
`;

const headingStyle = css`
  font-family: "Pacifico", cursive;
  font-size: 3rem;
`;

const suits = ["♠️", "♥️", "♦️", "♣️"];
const cards = [
  "Ace",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "Jack",
  "Queen",
  "King",
];

const rules = {
  Ace: "Waterfall – The person who picks the card starts drinking and everyone else follows suit until they stop. This could go on for a while, so hold on tight! 💦",
  2: "Choose – Pick a lucky (or unlucky) person to take a drink. Who's it gonna be? 🤔",
  3: "Me – Time for you to take a sip, champ. 🍻",
  4: "Wh0re – All the ladies in the group take a drink. 🍷",
  5: "Thumb Master – Place your thumb on the table and watch as everyone follows suit. The last person to do so takes a drink. You're the Thumb Master until someone else picks a five. 👍",
  6: "Dicks – Fellas, it's time to raise your glasses and take a swig. 🍺",
  7: "Heaven – Point your finger to the sky and watch as your friends try to keep up. The last person to do so takes a drink. ☝️",
  8: "Mate – Choose someone to be your drinking partner in crime. Whenever you drink, they drink too! 🍻👯‍♂️",
  9: "Rhyme – Pick a word, like 'fog,' and let the rhyming begin. Keep going around the circle until someone stumbles and has to drink. 🎶",
  10: "Categories – Choose a category, like 'football,' and let the words flow. Keep going until someone fumbles and takes a drink. 🏈",
  Jack: "Make a Rule – Make up a rule that everyone has to follow, like 'you can only drink with your left hand.' If anyone breaks the rule, they have to take a drink. 😜",
  Queen:
    "Questions – Keep the conversation flowing by asking each other questions. Whoever stumbles and forgets to ask a question has to take a drink. 🍷",
  King: "Pour! – Pour a little bit of your drink into the cup in the middle of the table. Whoever picks up the LAST king has to drink the entire concoction, which could be a mix of different drinks. 🤢",
};

function speakRule(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
}

function RingOfFire() {

  const [deck, setDeck] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure(); // Add this line for the modal
  const toast = useToast();

  var kingsleft = 4;

  // ... existing state variables
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);

  // ... existing useEffect

  function startGame(playerNames) {
    setPlayers(playerNames);
    setGameStarted(true);
  }

  useEffect(() => {
    shuffleDeck();
  }, []);

  function shuffleDeck() {
    const deck = [];

    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < suits.length; j++) {
        deck.push({ card: cards[i], suit: suits[j] });
      }
    }

    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setDeck(deck);
  }

  function handleEditRules() {
    onOpen();
  }

  const [buttonLabel, setButtonLabel] = useState("Draw Card");
  function handleDrawCard() {
    if (flipped) {
      setCurrentCard(null);
      setFlipped(false);
      setButtonLabel("Draw Card");
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
    } else {
      if (deck.length === 0) {
        toast({
          title: "No cards left",
          description: "Shuffling the deck...",
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
        shuffleDeck();
      } else {
        const newCard = deck.pop();
        setCurrentCard(newCard);
        setFlipped(true);
        setButtonLabel("Close Rule");
        speakRule(rules[newCard.card]);
      }
    }
  }

  useEffect(() => {
    if (currentCard && currentCard.card === "King") {
      kingsleft--;
      if (kingsleft === 0) {
        toast({
          title: "Last King",
          description: "Drink the entire concoction!",
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  }, [currentCard]);

  if (!gameStarted) {
    return <MainMenu onStartGame={startGame} />;
  }

  return (
    <ChakraProvider theme={theme}>
      <Global
        styles={css`
          body {
            background-color: #141414;
          }
        `}
      />
      <Stack
        spacing={8}
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Box>
          <Heading css={headingStyle} color="white">
            Ring of Fire
          </Heading>
        </Box>
        <Box>
          <Flip top when={flipped}>
            <Text fontSize={["3xl", "5xl"]} css={fireAnimation}>
              {currentCard ? `${currentCard.card} ${currentCard.suit}` : ""}
            </Text>
            <Text fontSize="md" color="gray.200" css={rulesStyle}>
              {currentCard ? rules[currentCard.card] : ""}
            </Text>
          </Flip>
        </Box>
        <Box display="flex" justifyContent="center">
          <Button
            onClick={handleDrawCard}
            bg="red.500"
            color="white"
            _hover={{ bg: "red.600" }}
          >
            {buttonLabel}
          </Button>
        </Box>
        <Text fontSize="md" color="gray.200" css={textStyle}>
          <p>Cards: {deck.length}</p>
          <p>kings: {kingsleft}</p>
        </Text>
      </Stack>
      <Box>
        <Button
          onClick={handleEditRules}
          bg="teal.500"
          color="white"
          _hover={{ bg: "teal.600" }}
          size="sm"
          mx={2}
        >
          Edit Rules
        </Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Rules</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {Object.entries(rules).map(([key, value]) => (
              <FormControl key={key} my={2}>
                <FormLabel>{key}</FormLabel>
                <Input
                  value={value}
                  onChange={(e) => {
                    const newRules = { ...rules };
                    newRules[key] = e.target.value;
                    setRules(newRules);
                  }}
                />
              </FormControl>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}

export default RingOfFire;
