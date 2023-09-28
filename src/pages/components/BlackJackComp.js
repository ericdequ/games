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
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "../../styles/BlackJack.module.css";
import Image from "next/image";


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
  const toast = useToast();

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

  const isBlackjack = (score) => {
   if (score === 21) {
     return true;
   }else{
      return false;
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
  
      if (playerScore > 21) {
        toast({
          title: "Oh no!",
          description: "You went over 21. You lose!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else if (dealerScore > 21 || playerScore > dealerScore) {
        toast({
          title: "Congratulations!",
          description: "You've won the round.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else if (playerScore === dealerScore) {
        // No toast for a tie, but you can add one if you want
      } else {
        toast({
          title: "Oh no!",
          description: "You lose!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
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

    if (OptimalMove !== "Hit") {
      toast({
        title: "Suboptimal Move",
        description: `It's recommended to ${OptimalMove} in this situation.`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  
  };

  const stand = () => {
    if (OptimalMove !== "Stand") {
      toast({
        title: "Suboptimal Move",
        description: `It's recommended to ${OptimalMove} in this situation.`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
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
  
      if (playerHand.length === 2 && playerHand[0].rank === playerHand[1].rank) {
        // Handle pairs
        const pairValue = cardValue(playerHand[0]);
        switch (pairValue) {
          case 5:
          case 10:
            optimalMove = "Never split.";
            break;
          case 8:
            optimalMove = "Always split.";
            break;
          default:
            optimalMove = dealerUpCard >= 2 && dealerUpCard <= 7 ? "Split." : "Hit.";
        }
      } else if (isBlackjack(playerScore)) {
        optimalMove = "Stand";
      } else if (playerScore >= 17) {
        optimalMove = "Stand";
      } else if (playerScore <= 11) {
        optimalMove = "Hit";
      } else if (isSoftHand) {
        // Handle soft hands
        optimalMove = playerScore >= 19 ? "Stand" : "Hit";
      } else {
        // Handle hard hands
        if (playerScore === 12 && (dealerUpCard < 4 || dealerUpCard > 6)) {
          optimalMove = "Hit";
        } else if (playerScore >= 13 && playerScore <= 16 && (dealerUpCard < 2 || dealerUpCard > 6)) {
          optimalMove = "Hit";
        } else if (playerScore === 16 && (dealerUpCard >= 9 || dealerUpCard === 11)) {
          optimalMove = "Surrender";
        } else if (playerScore >= 10 && playerScore <= 11 && dealerUpCard < 10) {
          optimalMove = "Double down";
        } else if (playerScore === 9 && dealerUpCard >= 3 && dealerUpCard <= 6) {
          optimalMove = "Double down";
        } else if (playerScore >= 17) {
          optimalMove = "Stand";
        } else {
          optimalMove = "Hit";
        }
      }
      setOptimalMove(optimalMove);
    } else {
      setOptimalMove("");
    }
  }, [playerHand, dealerHand, gameOver]);
  

  return (
    <>
    <IconButton colorScheme="teal" onClick={() => router.back()} aria-label="Back to Home" icon={<ArrowBackIcon />} />
    
      <Center bg="gray.800" minHeight="100vh">
     
        <VStack spacing={6} maxWidth="container.lg" width="100%" p={4} className={styles.container}>
        <Text fontSize="xl" fontWeight="bold" color="white">Balance: ${balance}</Text>
          <Text fontSize="4xl" fontWeight="bold" color="white">Dealer's Hand</Text>
          <HStack>
            {dealerHand.map((card, index) => (
              <Box key={index} p="2" height={100} width={100} bg="white" color="gray.800">
                {index === 0 && !gameOver ? (
                  <Image src="/blackjack/cardback.jpg" alt="Card back" width="100" height="100" />
                ) : (
                  <>
                    <Text>{card.rank}</Text>
                    <Text>{card.suit}</Text>
                  </>
                )}
              </Box>
            ))}
          </HStack>
    
          <Text fontSize="4xl" fontWeight="bold" color="white">Your Hand</Text>
          <HStack>
            {playerHand.map((card, index) => (
              <Box key={index} border="1px solid" borderRadius="md" p="2" borderColor="gray.300" bg="white" color="gray.800" className={styles.card} height={100} width={100}>
                {!betPlaced ? (
                  <Image src="/blackjack/cardback.jpg" alt="Card back" width="100" height="100" />
                ) : (
                  <>
                    <Text className={styles.cardRankSuit}>{card.rank}</Text>
                    <Text className={styles.cardRankSuit}>{card.suit}</Text>
                  </>
                )}
              </Box>
            ))}
          </HStack>
          {
  betPlaced ? (
    <Text fontSize="2xl" fontWeight="bold" color="white">Your Total: {handValue(playerHand)}</Text>
  ) : null
}

         
          <HStack spacing={4}>
            <Button colorScheme="teal" onClick={hit} isDisabled={!betPlaced || gameOver} className={styles.button}>Hit</Button>
            <Button colorScheme="teal" onClick={stand} isDisabled={!betPlaced || gameOver}>Stand</Button>
          </HStack>
    
          {gameOver && (
            <VStack>
              <Text fontSize="2xl" fontWeight="bold" color="white">{gameMessage}</Text>
              <Button colorScheme="teal" onClick={startNewGame}>Play Again</Button>
            </VStack>
          )}
    
          <HStack zIndex={10} spacing={4}>
            <Menu>
              <MenuButton as={Button} rightIcon={<ExpandMoreIcon />} colorScheme="teal">Insights</MenuButton>
              <MenuList>
                <MenuItem>{`Optimal Move: ${OptimalMove}`}</MenuItem>
                <MenuItem>{`Running Count: ${runningCount}`}</MenuItem>
              </MenuList>
            </Menu>
           
          </HStack>
    
          <HStack>
            {betPlaced ? (
                <></>
            )
              : (<>
                <Input type="number" placeholder="Enter bet amount" value={betAmount} onChange={(e) => setBetAmount(parseInt(e.target.value))} min={1} max={balance} bg="white" borderRadius="md" className={styles.betInput} />
                <Button colorScheme="teal" onClick={() => placeBet(betAmount)} className={styles.button}>Place Bet</Button>
                </>
              )
              
            }
           
          </HStack>
    
         
        </VStack>
      </Center>
      </>
    );
    
  
};

export default BlackJackComp;
