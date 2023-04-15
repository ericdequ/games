import React, { useState, useEffect } from "react";
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

const createDeck = () => {
  const deck = [];
  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      deck.push({ suit, rank });
    });
  });

  shuffleDeck(deck);
  
  return deck;
};

const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
};

const initialState = (deck) => ({
  deck,
  currentCard: deck.shift(),
  chances: 3,
  result: "",
  cardsWon: 0,
  cardsLost: 0,
  showCurrentCard: false,
});

const LLL = () => {
  const [deck, setDeck] = useState(createDeck());
  const [state, setState] = useState(initialState(deck));
  const bg = useColorModeValue("gray.200", "gray.700");

  const restart = (won) => {
    if (won) {
      setState({
        ...state,
        currentCard: deck.shift(),
        chances: 3,
        result: "",
        cardsWon: state.cardsWon + 1,
        showCurrentCard: false,
      });
    } else {
      setState({
        ...state,
        currentCard: deck.shift(),
        chances: 3,
        result: "",
        cardsLost: state.cardsLost + 1,
        showCurrentCard: false,
      });
    }
  };

  const guess = (guess) => {
    const { currentCard, chances } = state;
    const newChances = chances - 1;

    if (guess === currentCard.rank && newChances >= 0) {
      setState({
        ...state,
        result: `You are correct! The card was ${currentCard.rank} of ${currentCard.suit}.`,
        showCurrentCard: true,
      });
      setTimeout(() => restart(true), 2000);
    } else if (newChances === 0) {
      setState({
        ...state,
        result: `You have used up all your chances. The card was ${currentCard.rank} of ${currentCard.suit}.`,
        showCurrentCard: true,
      });
      setTimeout(() => restart(false), 2000);
    } else if (ranks.indexOf(guess) < ranks.indexOf(currentCard.rank)) {
      setState({
        ...state,
        chances: newChances,
        result: "The card is higher.",
      });
    } else {
      setState({
        ...state,
        chances: newChances,
        result: "The card is lower.",
      });
    }
  };

  const { currentCard, chances, result, cardsWon, cardsLost, showCurrentCard } = state;

  useEffect(() => {
    shuffleDeck(deck);
  }, [deck]);

  return (
    <Container centerContent bg={bg} minH="100vh" p={5}>
      <VStack spacing={6} pt={10}>
        <Heading fontSize="5xl" fontWeight="bold" color="teal.500">
          LLL - Guess the Card
        </Heading>
        <Text fontSize="xl" fontWeight="semibold">
          You have 3 chances to guess the rank of the card.
        </Text>
        {showCurrentCard && (
          <Box
            bg={useColorModeValue("white", "gray.800")}
            borderRadius="lg"
            p={6}
            boxShadow="2xl"
          >
            <Text fontSize="2xl" fontWeight="semibold">Current Card:</Text>
            <Text fontSize="6xl" fontWeight="extrabold" color="blue.500">
              {currentCard.rank} of {currentCard.suit}
            </Text>
          </Box>
        )}
        <Text fontSize="2xl" fontWeight="semibold">Chances remaining: {chances}</Text>
        <Text fontSize="2xl" fontWeight="bold" color={chances === 0 ? "red.500" : "blue.500"}>
          {result}
        </Text>
        <HStack>
          <Text fontSize="2xl" fontWeight="semibold">Cards Won:</Text>
          <Text fontSize="2xl" fontWeight="bold" color="green.500">
            {cardsWon}
          </Text>
          <Text fontSize="2xl" fontWeight="semibold">Cards Lost:</Text>
          <Text fontSize="2xl" fontWeight="bold" color="red.500">
            {cardsLost}
          </Text>
        </HStack>
        {chances === 0 || result.includes("correct") ? (
          <Button
            colorScheme="teal"
            onClick={() => restart(false)}
            fontSize="2xl"
            fontWeight="bold"
            boxShadow="md"
            _hover={{ boxShadow: "lg" }}
            _active={{ boxShadow: "xl" }}
          >
            Next Card
          </Button>
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
              >
                {rank}
              </Button>
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Container>
  );
  
  
  
};


    export default LLL;