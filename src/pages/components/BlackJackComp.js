// BlackJackComp.js
import React, { useState, useEffect } from "react";

import {
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
import { useRouter } from "next/router";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "../../styles/BlackJack.module.css";

const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King", "Ace"];

const createDeck = () => {
  const deck = suits.flatMap((suit) => ranks.map((rank) => ({ suit, rank })));
  return shuffleDeck(deck);
};

const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const cardValue = (card) => {
  if (typeof card.rank === "number") {
    return card.rank;
  } else if (card.rank === "Ace") {
    return 11;
  } else {
    return 10;
  }
};

const handValue = (hand) => {
  let value = hand.reduce((acc, card) => acc + cardValue(card), 0);
  let aces = hand.filter((card) => card.rank === "Ace").length;
  while (value > 21 && aces > 0) {
    value -= 10;
    aces -= 1;
  }
  return value;
};

const BlackJackComp = () => {
  const router = useRouter();
  const [deck, setDeck] = useState(createDeck());
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [dealerUpCard, setDealerUpCard] = useState({});
  const [gameOver, setGameOver] = useState(false);
  const [gameMessage, setGameMessage] = useState("");
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [runningCount, setRunningCount] = useState(0);
  const [splitHands, setSplitHands] = useState([[], []]);
  const [activeHandIndex, setActiveHandIndex] = useState(0);
  const [betPlaced, setBetPlaced] = useState(false);
  const [OptimalMove, setOptimalMove] = useState("");

  const updateRunningCount = (cards) => {
    const newRunningCount = cards.reduce((count, card) => {
      if (card.rank >= 2 && card.rank <= 6) {
        return count + 1;
      } else if (
        card.rank === 10 ||
        card.rank === "Jack" ||
        card.rank === "Queen" ||
        card.rank === "King" ||
        card.rank === "Ace"
      ) {
        return count - 1;
      } else {
        return count;
      }
    }, 0);
    setRunningCount(runningCount + newRunningCount);
  };

  const canSplit = () => {
    if (playerHand.length === 2 && playerHand[0].rank === playerHand[1].rank) {
      return true;
    }
    return false;
  };

  const nextHand = () => {
    if (activeHandIndex < splitHands.length - 1) {
      setActiveHandIndex(activeHandIndex + 1);
      setPlayerHand(splitHands[activeHandIndex + 1]);
    } else {
      stand();
    }
  };

  useEffect(() => {
    dealCards();
  }, []);

  const doubleDown = () => {
    if (!gameOver && playerHand.length === 2) {
      hit();
      setBalance(balance - betAmount);
      setBetAmount(betAmount * 2);
      stand();
    }
  };

  const split = () => {
    if (!gameOver && canSplit()) {
      const newSplitHands = [
        [playerHand[0], deck[0]],
        [playerHand[1], deck[1]],
      ];
      setSplitHands(newSplitHands);
      setPlayerHand(newSplitHands[activeHandIndex]);
      setDeck(deck.slice(2));
      updateRunningCount(deck.slice(0, 2));
    }
  };

  const surrender = () => {
    if (!gameOver && playerHand.length === 2) {
      setBalance(balance + betAmount / 2);
      setGameOver(true);
      setGameMessage("You surrendered. You lose half your bet.");
    }
  };

  const placeBet = (amount) => {
    if (!betPlaced && amount <= balance && amount > 0) {
      setBalance(balance - amount);
      setBetAmount(amount);
      setBetPlaced(true);
    }
  };

  const resetBet = () => {
    setBalance(balance + betAmount);
    setBetAmount(0);
  };

  const dealCards = () => {
    setPlayerHand(deck.slice(0, 2));
    setDealerHand(deck.slice(2, 4));
    setDeck(deck.slice(4));
    setSplitHands([[], []]);
    setActiveHandIndex(0);
    updateRunningCount(deck.slice(0, 2));
  };

  useEffect(() => {
    if (gameOver) {
      const playerScore = handValue(playerHand);
      const dealerScore = handValue(dealerHand);
      let message = "";

      if (playerScore > 21) {
        message = "You went over 21. You lose!";
      } else if (dealerScore > 21) {
        message = "Dealer went over 21. You win!";
      } else if (playerScore === dealerScore) {
        message = "It's a tie!";
      } else if (playerScore > dealerScore) {
        message = "You win!";
      } else {
        message = "You lose!";
      }

      setGameMessage(message);
    }
  }, [gameOver]);

  const hit = () => {
    if (!gameOver) {
      const newPlayerHand = [...playerHand, deck[0]];
      setPlayerHand(newPlayerHand);
      setDeck(deck.slice(1));

      updateRunningCount([deck[0]]);

      if (handValue(newPlayerHand) > 21) {
        setGameOver(true);
      }
    }
  };

  const stand = () => {
    if (splitHands[0].length > 0 && activeHandIndex < splitHands.length - 1) {
      nextHand();
    } else {
      let newDealerHand = dealerHand;
      while (handValue(newDealerHand) < 17) {
        newDealerHand = [...newDealerHand, deck[0]];
        setDeck(deck.slice(1));

        updateRunningCount([deck[0]]);
      }
      setDealerHand(newDealerHand);
      setGameOver(true);
    }
  };

  const startNewGame = () => {
    setDeck(createDeck());
    setPlayerHand([]);
    setDealerHand([]);
    setGameOver(false);
    setGameMessage("");
    setSplitHands([[], []]);
    setActiveHandIndex(0);
    setBetAmount(10);
    setBetPlaced(false);
    dealCards();
  };

  function isSoft(hand) {
    const values = hand.map(cardValue);
    let numAces = values.filter((val) => val === 11).length;
    let score = values.reduce((acc, val) => acc + val, 0);

    while (score > 21 && numAces > 0) {
      score -= 10;
      numAces--;
    }

    return score !== values.reduce((acc, val) => acc + val, 0);
  }

  useEffect(() => {
    if (playerHand.length > 0 && dealerHand.length > 0 && !gameOver) {
      const playerScore = handValue(playerHand);
      const dealerUpCard = cardValue(dealerHand[0]);
      const isSoftHand = isSoft(playerHand);
      let optimalMove = "";

      // Always split pairs of Aces and 8s, and never split pairs of 5s or 10s.
      if (
        playerHand.length === 2 &&
        playerHand[0].value === playerHand[1].value
      ) {
        const pairValue = cardValue(playerHand[0]);
        if (pairValue === 5 || pairValue === 10) {
          optimalMove = "Never split.";
        } else if (pairValue === 8) {
          optimalMove = "Always split.";
        } else if (dealerUpCard >= 2 && dealerUpCard <= 7) {
          optimalMove = "Split.";
        } else {
          optimalMove = "Hit.";
        }
      } else if (playerScore === 21) {
        // If the player has 21, always stand.
        optimalMove = "Blackjack! Stand.";
      } else if (playerScore >= 17) {
        // If the player has 17 or more, always stand.
        optimalMove = "Stand.";
      } else if (playerScore <= 11) {
        // If the player has 11 or less, always hit.
        optimalMove = "Hit.";
      } else if (playerScore === 12) {
        // If the player has 12, stand if the dealer's up card is 4-6, otherwise hit.
        if (dealerUpCard >= 4 && dealerUpCard <= 6) {
          optimalMove = "Stand.";
        } else {
          optimalMove = "Hit.";
        }
      } else if (playerScore >= 13 && playerScore <= 16) {
        // If the player has a hard hand of 13-16, stand if the dealer's up card is 2-6, otherwise hit.
        if (dealerUpCard >= 2 && dealerUpCard <= 6) {
          optimalMove = "Stand.";
        } else {
          optimalMove = "Hit.";
        }
      } else if (isSoftHand) {
        // If the player has a soft hand, always stand on 19 or more, and hit on 18 or less.
        if (playerScore >= 19) {
          optimalMove = "Stand.";
        } else {
          optimalMove = "Hit.";
        }
      } else {
        // If the player has a hard hand of 17-20, always stand.
        optimalMove = "Stand.";
      }

      // Add options for splitting, doubling down, hitting, standing, or surrendering
      if (optimalMove === "Always split.") {
        optimalMove += "   ";
      } else if (optimalMove === "Hit.") {
        optimalMove += "   ";
      } else if (optimalMove === "Stand.") {
        optimalMove += "   ";
      } else if (optimalMove === "Never split.") {
        optimalMove += "   ";
      } else if (optimalMove === "Split.") {
        optimalMove += "   ";
      } else if (playerScore === 15 && dealerUpCard === 10) {
        // Surrender 15 against a dealer 10.
        optimalMove = "Surrender.";
      } else if (playerScore === 16 && dealerUpCard === 9) {
        // Surrender 16 against a dealer 9.
        optimalMove = "Surrender.";
      } else if (playerScore === 16 && dealerUpCard === 10) {
        // Surrender 16 against a dealer 10.
        optimalMove = "Surrender.";
      } else if (playerScore === 16 && dealerUpCard === 11) {
        // Surrender 16 against a dealer Ace.
        optimalMove = "Surrender.";
      } else if (playerScore === 15 && dealerUpCard === 9) {
        // Surrender 15 against a dealer 9.
        optimalMove = "Surrender.";
      } else if (playerScore === 15 && dealerUpCard === 11) {
        // Surrender 15 against a dealer Ace.
        optimalMove = "Surrender.";
      } else if (playerScore === 14 && dealerUpCard === 10) {
        // Surrender 14 against a dealer 10.
        optimalMove = "Surrender.";
      } else if (playerScore === 14 && dealerUpCard === 11) {
        // Surrender 14 against a dealer Ace.
        optimalMove = "Surrender.";
      } else if (playerScore === 13 && dealerUpCard === 10) {
        // Surrender 13 against a dealer 10.
        optimalMove = "Surrender.";
      } else if (playerScore === 12 && dealerUpCard >= 4 && dealerUpCard <= 6) {
        // Double down on 12 against a dealer 4-6.
        optimalMove = "Double down.";
      } else if (
        (playerScore === 10 || playerScore === 11) &&
        dealerUpCard <= 9
      ) {
        // Double down on 10 or 11 against a dealer 9 or lower.
        optimalMove = "Double down.";
      } else if (playerScore === 9 && dealerUpCard >= 3 && dealerUpCard <= 6) {
        // Double down on 9 against a dealer 3-6.
        optimalMove = "Double down.";
      } else if (playerScore <= 8) {
        // Hit on 8 or less.
        optimalMove = "Hit.";
      } else {
        // Stand on 17 or more, hit on 16 or less.
        if (playerScore >= 17) {
          optimalMove = "Stand.";
        } else {
          optimalMove = "Hit.";
        }
      }
      setOptimalMove(optimalMove);
    } else {
      setOptimalMove("");
    }
  }, [playerHand, dealerHand, gameOver]);

  return (
    <Center bg="gray.800" minHeight="100vh">
      <VStack spacing={6} maxWidth="container.lg" width="100%" p={4} className={styles.container}>
        {!betPlaced && (
          <HStack>
            <Input
              type="number"
              placeholder="Enter bet amount"
              value={betAmount}
              onChange={(e) => setBetAmount(parseInt(e.target.value))}
              min={1}
              max={balance}
              bg="white"
              borderRadius="md"
              className={styles.betInput}
            />
            <Button colorScheme="teal" onClick={() => placeBet(betAmount)} className={styles.button}>
              Place Bet
            </Button>
          </HStack>
        )}
        <HStack zIndex={10} position="fixed" top={4} right={4}>
          <IconButton
            colorScheme="teal"
            onClick={() => router.back()}
            aria-label="Back to Home"
            icon={<ArrowBackIcon />}
          />
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ExpandMoreIcon />}
              colorScheme="teal"
            >
              Insights
            </MenuButton>
            <MenuList>
              <MenuItem>{`Optimal Move: ${OptimalMove}`}</MenuItem>
              <MenuItem>{`Running Count: ${runningCount}`}</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
        <Text fontSize="4xl" fontWeight="bold" color="white">
          Dealer's Hand
        </Text>
        <HStack>
          {dealerHand.map((card, index) => (
            <Box
              key={index}
              border="1px solid"
              borderRadius="md"
              p="2"
              borderColor="gray.300"
              bg="white"
              color="gray.800"
            >
              <Text>{index === 0 && !gameOver ? "Hidden" : card.rank}</Text>
              <Text>{index === 0 && !gameOver ? "Hidden" : card.suit}</Text>
            </Box>
          ))}
        </HStack>
        <Text fontSize="4xl" fontWeight="bold" color="white">
          Your Hand
        </Text>
        <HStack>
        {playerHand.map((card, index) => (
          <Box
            key={index}
            border="1px solid"
            borderRadius="md"
            p="2"
            borderColor="gray.300"
            bg="white"
            color="gray.800"
            className={styles.card}
          >
            <Text className={styles.cardRankSuit}>{card.rank}</Text>
            <Text className={styles.cardRankSuit}>{card.suit}</Text>
          </Box>
        ))}
      </HStack>
        <Text fontSize="2xl" fontWeight="bold" color="white">
          Your Total: {handValue(playerHand)}
        </Text>
        <HStack spacing={4}>
        <Button
          colorScheme="teal"
          onClick={hit}
          isDisabled={!betPlaced || gameOver}
          className={styles.button}
        >
          Hit
        </Button>
          <Button
            colorScheme="teal"
            onClick={stand}
            isDisabled={!betPlaced || gameOver}
          >
            Stand
          </Button>
          <Button
            colorScheme="teal"
            onClick={doubleDown}
            isDisabled={!betPlaced || gameOver}
          >
            Double Down
          </Button>
          <Button
            colorScheme="teal"
            onClick={split}
            isDisabled={!betPlaced || gameOver || !canSplit()}
          >
            Split
          </Button>
          <Button
          colorScheme="teal"
          onClick={surrender}
          isDisabled={!betPlaced || gameOver}
          className={styles.button}
        >
          Surrender
        </Button>
        </HStack>
        {gameOver && (
          <VStack>
            <Text fontSize="2xl" fontWeight="bold" color="white">
              {gameMessage}
            </Text>
            <Button colorScheme="teal" onClick={startNewGame}>
              Play Again
            </Button>
          </VStack>
        )}
        <Text fontSize="xl" fontWeight="bold" color="white">
          Balance: ${balance}
        </Text>
      </VStack>
    </Center>
  );
};

export default BlackJackComp;
