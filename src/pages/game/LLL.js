import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { HamburgerIcon } from "@chakra-ui/icons";
import ReactCardFlip from 'react-card-flip';

import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  Text,
  HStack,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  Container,
  Button,
  Heading,
  SimpleGrid,
  

} from "@chakra-ui/react";

const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King", "Ace"];
const MotionBox = motion(Box);

const createDeck = () => {
  const deck = suits.flatMap(suit => ranks.map(rank => ({ suit, rank })));
  return shuffleDeck(deck);
};

const sattoloShuffle = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const shuffleDeck = deck => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  deck = sattoloShuffle(deck);
  return deck;
};

const LLL = () => {
  const [deck, setDeck] = useState(createDeck());
  const [Useddeck, setUsedDeck] = useState([]);
  const [disabledRanks, setDisabledRanks] = useState([]);
  const [validCards, setValidCards] = useState([]);
  const [state, setState] = useState({
    currentCard: deck[0],
    chances: 3,
    result: "",
    cardsWon: 0,
    cardsLost: 0,
    showCurrentCard: false,
  });
  const router = useRouter();
  const bg = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    setDisabledRanks([]); // Reset disabled ranks when a new card is drawn
  }, [state.currentCard]);

  const addToUsedDeck = () => {
    const currentCard = state.currentCard;
    setUsedDeck([...Useddeck, currentCard]);
  };

  const getvalidcards = () => {
    const validCards = deck.filter(card => !disabledRanks.includes(card.rank));
    setValidCards(validCards);
  };

  useEffect(() => {
    getvalidcards();
  }, [disabledRanks]);

  const restart = won => {
    addToUsedDeck();
    // remove from main deck
    const newDeck = deck.slice(1);
    setDeck(newDeck);
    setState({
      ...state,
      currentCard: newDeck[0],
      chances: 3,
      result: "",
      cardsWon: won ? state.cardsWon + 1 : state.cardsWon,
      cardsLost: won ? state.cardsLost : state.cardsLost + 1,
      showCurrentCard: false,
    });
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.createRef();

  const guess = (guess) => {
    const { currentCard, chances } = state;
    const newChances = chances - 1;
    const guessedIndex = ranks.indexOf(guess);
    const currentCardIndex = ranks.indexOf(currentCard.rank);

    // Calculate remaining valid ranks
    const validRanks = ranks.filter(rank => !disabledRanks.includes(rank) && rank !== currentCard.rank);

    setState(prevState => {
      const newResult = guessedIndex < currentCardIndex ? "Higher" : "Lower";

      // Update the disabledRanks array
      const disabledRange = newResult === "Higher"
        ? ranks.slice(0, guessedIndex + 1)
        : ranks.slice(guessedIndex);
      const newDisabledRanks = [...disabledRanks, ...disabledRange].filter((value, index, self) => self.indexOf(value) === index);

      setDisabledRanks(newDisabledRanks);
      if (guess === currentCard.rank && newChances >= 0) {
        setTimeout(() => restart(true), 2000);
        return {
          ...prevState, result: `Correct! ${currentCard.rank} of ${currentCard.suit}.`,
          showCurrentCard: true,
        };
      } else if (newChances === 0) {
        setTimeout(() => restart(false), 2000);
        return {
          ...prevState,
          result: `No chances left. ${currentCard.rank} of ${currentCard.suit}.`,
          showCurrentCard: true,
        };
      } else {
        // Calculate probability of guessing correctly
        const validCount = validRanks.length;
        const correctCount = validRanks.filter(rank => rank === currentCard.rank).length;

        return {
          ...prevState,
          chances: newChances,
          result: `${newResult}`
        };
      }
    });
  };

  const { currentCard, chances, result, cardsWon, cardsLost, showCurrentCard } = state;
  return (
    <Container centerContent bg={bg} minH="100vh" p={5}>
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
      <Button
        ref={btnRef}
        colorScheme="teal"
        position="fixed"
        top={4}
        right={4}
        zIndex={10}
        onClick={onOpen}
      >
        <HamburgerIcon />
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
  <DrawerOverlay>
    <DrawerContent bg="gray.800" color="white">
      <DrawerCloseButton />
      <DrawerHeader borderBottomWidth="1px" fontSize="3xl">
        Game Stats
      </DrawerHeader>

      <DrawerBody>
        <Tabs variant="enclosed" colorScheme="teal">
          <TabList>
            <Tab>Current Odds</Tab>
            <Tab>Remaining Cards</Tab>
            <Tab>Used Cards</Tab>
            <Tab>Odds Before Guesses</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <VStack spacing={4}>
                <Text fontSize="2xl" fontWeight="bold">
                  Current Odds 🎰
                </Text>
                {ranks.map((rank, index) => {
                  const rankCount = deck.filter((card) => card.rank === rank).length;
                  let percent = 0;
                  if (disabledRanks.includes(rank)) {
                    percent = 0;
                  } else {
                    percent = ((rankCount / validCards.length) * 100).toFixed(2);
                  }

                  return (
                    <HStack key={index} justifyContent="space-between" w="100%">
                      <Text fontSize="xl" mr="4">
                        {rank}:
                      </Text>
                      <Box bg="teal.500" borderRadius="lg" px="2">
                        ({percent}%)
                      </Box>
                    </HStack>
                  );
                })}
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack spacing={4}>
                <Text fontSize="2xl" fontWeight="bold">Remaining Cards 🃏</Text>
                {ranks.map((rank, index) => {
                  const rankCount = deck.filter((card) => card.rank === rank).length;
                  const percent = ((rankCount / validCards.length) * 100).toFixed(2);
                  if (rank)
                    return (
                      <HStack key={index} justifyContent="space-between" w="100%">
                        <Text fontSize="xl" mr="4">
                          {rank}:
                        </Text>
                        <Box bg="teal.500" borderRadius="lg" px="2">
                          {rankCount}
                        </Box>
                      </HStack>
                    );
                })}
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack spacing={4}>
                <Text fontSize="2xl" fontWeight="bold">
                  Used Cards ({Useddeck.length}) 🃏
                </Text>
                {ranks.map((rank, index) => {
                  const rankCount = Useddeck.filter((card) => card.rank === rank).length;
                  return (
                    <HStack key={index} justifyContent="space-between" w="100%">
                      <Text fontSize="xl" mr="4">
                        {rank}:
                      </Text>
                      <Box bg="teal.500" borderRadius="lg" px="2">
                        {rankCount}
                        </Box>
                </HStack>
              );
            })}
          </VStack>
        </TabPanel>
        <TabPanel>
          <VStack spacing={4}>
            <Text fontSize="2xl" fontWeight="bold">
              Odds Before guesses 🎲
            </Text>
            {ranks.map((rank, index) => {
              const rankCount = deck.filter((card) => card.rank === rank).length;
              const percent = ((rankCount / validCards.length) * 100).toFixed(2);
              if (rank)
                return (
                  <HStack key={index} justifyContent="space-between" w="100%">
                    <Text fontSize="xl" mr="4">{rank}:</Text>
                    <Box bg="teal.500" borderRadius="lg" px="2">({percent}%)</Box>
                  </HStack>
                );
            })}
          </VStack>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </DrawerBody>
</DrawerContent>
</DrawerOverlay>
</Drawer>
      <VStack spacing={6} pt={10}>
        <Heading fontSize="5xl" fontWeight="bold" color="teal.500">LLL - Guess the Card</Heading>
        <Text fontSize="xl" fontWeight="semibold">You have 3 chances to guess the rank of the card.</Text>
        <Text fontSize="xl" fontWeight="semibold">Cards remaining: {deck.length - 1}</Text>
        {showCurrentCard && (
          <MotionBox
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.5 }}
            bg={useColorModeValue("white", "gray.800")}
            borderRadius="lg"
            p={6}
            boxShadow="2xl"
          >
            <Text fontSize="2xl" fontWeight="semibold">Current Card:</Text>
            <Text fontSize="6xl" fontWeight="extrabold" color="blue.500">
              {currentCard.rank} of {currentCard.suit}
            </Text>
          </MotionBox>
        )}
        <Text fontSize="2xl" fontWeight="semibold">Chances remaining: {chances}</Text>
        <Text fontSize="2xl" fontWeight="bold" color={chances === 0 ? "red.500" : (result.includes("Correct") ? "green.500" : "blue.500")}>{result}</Text>
        <HStack>
          <Text fontSize="2xl" fontWeight="semibold">Cards Won:</Text>
          <Text fontSize="2xl" fontWeight="bold" color="green.500">{cardsWon}</Text>
          <Text fontSize="2xl" fontWeight="semibold">Cards Lost:</Text>
          <Text fontSize="2xl" fontWeight="bold" color="red.500">{cardsLost}</Text>
        </HStack>
        <SimpleGrid columns={4} spacing={4}>
          {ranks.map((rank, index) => (
            <MotionBox
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              bg={disabledRanks.includes(rank) ? "gray.400" : "teal.500"}
              borderRadius="lg"
              p={6}
              boxShadow="2xl"
              onClick={() => guess(rank)}
              cursor={disabledRanks.includes(rank) ? "not-allowed" : "pointer"}
              opacity={disabledRanks.includes(rank) ? 0.5 : 1}
            >
              <Text fontSize="2xl" fontWeight="bold" color="white">
                {rank}
              </Text>
            </MotionBox>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default LLL;


