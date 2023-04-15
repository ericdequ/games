import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  Button,
  Box,
  Text,
  Container,
  VStack,
  HStack,
  Heading,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";

const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King", "Ace"];
const MotionBox = motion(Box);
const createDeck = () => {
  const deck = suits.flatMap(suit => ranks.map(rank => ({ suit, rank })));
  return shuffleDeck(deck);
};

const shuffleDeck = deck => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const LLL = () => {
  const [deck, setDeck] = useState(createDeck());
  const [disabledRanks, setDisabledRanks] = useState([]);
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

  const restart = won => {
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

  const guess = (guess) => {
    const { currentCard, chances } = state;
    const newChances = chances - 1;
    const guessedIndex = ranks.indexOf(guess);
    const currentCardIndex = ranks.indexOf(currentCard.rank);

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
          ...prevState,
          result: `Correct! ${currentCard.rank} of ${currentCard.suit}.`,
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
        return {
          ...prevState,
          chances: newChances,
          result: newResult,
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
        <Text fontSize="2xl" fontWeight="bold" color={chances === 0 ? "red.500" : "blue.500"}>{result}</Text>
        <HStack>
          <Text fontSize="2xl" fontWeight="semibold">Cards Won:</Text>
          <Text fontSize="2xl" fontWeight="bold" color="green.500">{cardsWon}</Text>
          <Text fontSize="2xl" fontWeight="semibold">Cards Lost:</Text>
          <Text fontSize="2xl" fontWeight="bold" color="red.500">{cardsLost}</Text>
        </HStack>
        {deck.length === 1 ? (
          <Text fontSize="2xl" fontWeight="bold" color="purple.500">You've reached the last card!</Text>
        ) : (
          <>
            {(chances === 0 || result.includes("Correct")) ? (
              <Button colorScheme="teal" onClick={() => restart(false)} fontSize="2xl" fontWeight="bold" boxShadow="md" _hover={{ boxShadow: "lg" }} _active={{ boxShadow: "xl" }}>Next Card</Button>
            ) : (
              <SimpleGrid columns={4} spacing={4}>
                {ranks.map((rank) => (
                  <Button
                    key={rank}
                    colorScheme="teal"
                    onClick={() => guess(rank)}
                    fontSize="xl"
                    fontWeight="bold"
                    boxShadow="md"
                    _hover={{ boxShadow: "lg" }}
                    _active={{ boxShadow: "xl" }}
                    isDisabled={disabledRanks.includes(rank)}
                    opacity={disabledRanks.includes(rank) ? 0.5 : 1}
                  >
                    {rank}
                  </Button>
                ))}
              </SimpleGrid>
            )}
          </>
        )}
      </VStack>
    </Container>
  );
};

export default LLL;
