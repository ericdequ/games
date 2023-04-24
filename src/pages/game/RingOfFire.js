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
  "Ace",
];

const rules = {
  2: "You – Time to play favorites! Pick someone to take a drink – who's the lucky (or unlucky) one? 😏",
  3: "Me – Bottoms up, champ! Time for you to take a swig of that sweet nectar. 🍻",
  4: "WHORES – All the fabulous ladies in the group, it's your time to shine and sip. Cheers, darlings! 🍷",
  5: "Thumb Master – Unleash your inner ninja and place your thumb on the table. Watch the chaos as everyone scrambles to follow. The last person takes a drink. You're the Thumb Master until dethroned. 👍",
  6: "DICKS – Gentlemen, unite! Raise those glasses and take a hearty swig together. 🍺",
  7: "Heaven – Point skyward like you're reaching for the stars! The last person to follow suit takes a drink. ☝️",
  8: "Mate – Find your drinking soulmate! Whenever you drink, they must too – sharing is caring, after all. 🍻👯‍♂️",
  9: "Rhyme-Time – Start a poetic chain with a word like 'slug,' and let the rhyming begin. When someone fumbles, they take a drink. 🎶",
  10: "Categories – Unleash your inner genius by choosing a category like '80s movies.' Keep going until someone's brain short-circuits and they take a drink. 📽️",
  Jack: "Rule Maker – Channel your inner tyrant and create a rule everyone must follow, like 'no laughing allowed.' Rule-breakers, prepare to drink! 😜",
  Queen:
  "Question Frenzy – Get your thinking caps on! Ask each other questions in a rapid-fire frenzy. Whoever forgets to ask a question drinks up. 🍷",
  King: "King Cup – Add some of your drink to the central cup. Whoever's unlucky enough to pick the LAST king drinks the entire Frankenstein concoction. 🤢",
  Ace: "Waterfall – Ready, set, chug! The card-picker starts drinking, and everyone follows. The waterfall only stops when the initiator does. Brace yourselves! 💦",
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
  const [currentRules, setCurrentRules] = useState(rules);

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
        speakRule(currentRules[newCard.card]);
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
              {currentCard ? currentRules[currentCard.card] : ""}
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
            {Object.entries(currentRules).map(([key, value]) => (
              <FormControl key={key} my={2}>
                <FormLabel>{key}</FormLabel>
                <Input
                  value={value}
                  onChange={(e) => {
                    const newRules = {...currentRules};
                    newRules[key] = e.target.value;
                    setcurrentRules(newRules);
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
