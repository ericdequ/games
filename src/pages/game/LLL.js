import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { HamburgerIcon } from "@chakra-ui/icons";
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
  Stack,
  ScaleFade,
  Fade,
  Slide,
} from "@chakra-ui/react";

const speakRule = (text) => {
  const synth = window.speechSynthesis;
  synth.cancel(); // Cancel any ongoing speech

  if (text === "win") {
    console.log("win");
  } else if (text === "lose") {
    console.log("lose");
  } else {
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  }
};

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

const shuffleDeck = (deck) => {
  deck = sattoloShuffle(deck);

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
  const [bestGuess, setBestGuess] = useState("");
  const [state, setState] = useState({
    currentCard: deck[0],
    chances: 3,
    result: "",
    cardsWon: 0,
    cardsLost: 0,
    showCurrentCard: false,
    BestRank: "",
  });
  const router = useRouter();
  const bg = useColorModeValue("gray.200", "gray.700");

  const getColor = () => {
    if (state.result.includes("Correct")) {
      return "green.500";
    } else {
      return "red.500";
    }
  };


  useEffect(() => {
    setDisabledRanks([]); // Reset disabled ranks when a new card is drawn
    {/*setBestGuess(BestCardAlgo(validCards, disabledRanks, state.chances,ranks,chances ));*/ }
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
    {/*setBestGuess(BestCardAlgo(validCards, disabledRanks, state.chances,ranks));*/ }
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
  
      // Only call speakRule if there are still guesses left and the user hasn't won or lost
      if (newChances > 0 && guess !== currentCard.rank) {
        speakRule(newResult);
      }
  
      // Update the disabledRanks array
      const disabledRange = newResult === "Higher"
        ? ranks.slice(0, guessedIndex + 1)
        : ranks.slice(guessedIndex);
      const newDisabledRanks = [...disabledRanks, ...disabledRange].filter((value, index, self) => self.indexOf(value) === index);
  
      setDisabledRanks(newDisabledRanks);
      if (guess === currentCard.rank && newChances >= 0) {
        setTimeout(() => restart(true), 2000);
        speakRule("win"); // Play the winning sound
        return {
          ...prevState, result: `Correct`,
          showCurrentCard: true,
        };
      } else if (newChances === 0) {
        setTimeout(() => restart(false), 2000);
        speakRule("lose"); // Play the losing sound
        return {
          ...prevState,
          showCurrentCard: true,
        };
      } else {
        return {
          ...prevState,
          chances: newChances,
          result: `${newResult}`
        }
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
                  <Tab>Used Cards</Tab>
                  <Tab>Remaining Cards</Tab>
                  <Tab>Odds Before Guesses</Tab>
                  <Tab>Best Guess</Tab>
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

                        if (percent != 0)
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
                      <Text fontSize="2xl" fontWeight="bold">
                        Used Cards ({Useddeck.length}) 🃏
                      </Text>
                      {ranks.map((rank, index) => {
                        const rankCount = Useddeck.filter((card) => card.rank === rank).length;
                        if (rankCount != 0)
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
                      <Text fontSize="2xl" fontWeight="bold">Remaining Cards 🃏</Text>
                      {ranks.map((rank, index) => {
                        const rankCount = deck.filter((card) => card.rank === rank).length;
                        const percent = ((rankCount / validCards.length) * 100).toFixed(2);
                        if (rank)
                          if (rankCount != 0)
                            if (index != 0)
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
                          if (rankCount != 0)
                            return (
                              <HStack key={index} justifyContent="space-between" w="100%">
                                <Text fontSize="xl" mr="4">{rank}:</Text>
                                <Box bg="teal.500" borderRadius="lg" px="2">({percent}%)</Box>
                              </HStack>
                            );
                      })}
                    </VStack>
                  </TabPanel>




                  <TabPanel>
                    <VStack spacing={4}>
                      <Text fontSize="2xl" fontWeight="bold">
                        Best Guess 🎲
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="green.500">{bestGuess}</Text>
                    </VStack>
                  </TabPanel>



                </TabPanels>
              </Tabs>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>












      <VStack spacing={6} pt={10}>
        <Heading
          fontSize="5xl"
          fontWeight="bold"
          color="teal.500"
          as={Fade}
          in={true}
        >
          LLL - Guess the Card
        </Heading>
        <Text fontSize="xl" fontWeight="semibold">
          You have 3 chances to guess the rank of the card.
        </Text>
        <Text fontSize="xl" fontWeight="semibold">
          Cards remaining: {deck.length - 1}
        </Text>
        {showCurrentCard && (
          <ScaleFade initialScale={0.9} in={true}>
            <Box
              bg={useColorModeValue("white", "gray.800")}
              borderRadius="lg"
              p={6}
              boxShadow="2xl"
            >
              <Text fontSize="2xl" fontWeight="semibold">Current Card:</Text>
              <Text fontSize="6xl" fontWeight="extrabold" color={getColor()}>
                {currentCard.rank} of {currentCard.suit}
              </Text>
            </Box>
          </ScaleFade>
        )}
        <Text fontSize="2xl" fontWeight="semibold">
          Chances remaining: {chances}
        </Text>

        {state.result && !state.result.includes("Correct") && (
          <Slide direction="bottom" in={true}>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color={chances === 0 ? "red.500" : "blue.500"}
            >
              {result}
            </Text>
          </Slide>
        )}

        <Stack isInline>
          <Text fontSize="2xl" fontWeight="semibold">Cards Won:</Text>
          <Text fontSize="2xl" fontWeight="bold" color="green.500">
            {cardsWon}
          </Text>
          <Text fontSize="2xl" fontWeight="semibold">Cards Lost:</Text>
          <Text fontSize="2xl" fontWeight="bold" color="red.500">
            {cardsLost}
          </Text>
        </Stack>
        <SimpleGrid columns={4} spacing={4}>
          {ranks.map((rank, index) => (
            <Box
              key={index}
              bg={disabledRanks.includes(rank) ? "gray.400" : "teal.500"}
              borderRadius="lg"
              p={6}
              boxShadow="2xl"
              onClick={() => guess(rank)}
              cursor={disabledRanks.includes(rank) ? "not-allowed" : "pointer"}
              opacity={disabledRanks.includes(rank) ? 0.5 : 1}
              as={Fade}
              in={true}
            >
              <Text fontSize="2xl" fontWeight="bold" color="white">
                {rank}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
      
    </Container>
    
  );
};

export default LLL;


