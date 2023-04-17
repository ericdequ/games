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
} from '@chakra-ui/react';
import { useRouter } from "next/router";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from '../../styles/BlackJack.module.css'

const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King", "Ace"];

const createDeck = () => {
    const deck = suits.flatMap((suit) =>
        ranks.map((rank) => ({ suit, rank }))
    );
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
    const [gameOver, setGameOver] = useState(false);
    const [gameMessage, setGameMessage] = useState("");
    const [balance, setBalance] = useState(1000);
    const [betAmount, setBetAmount] = useState(10);
    const [runningCount, setRunningCount] = useState(0);
    const [optimalMove, setOptimalMove] = useState('');
    const [splitHands, setSplitHands] = useState([[], []]);
    const [activeHandIndex, setActiveHandIndex] = useState(0);
    const [betPlaced, setBetPlaced] = useState(false);

    const updateRunningCount = (cards) => {
        const newRunningCount = cards.reduce((count, card) => {
            if (card.rank >= 2 && card.rank <= 6) {
                return count + 1;
            } else if (card.rank === 10 || card.rank === "Jack" || card.rank === "Queen" || card.rank === "King" || card.rank === "Ace") {
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
        setBetAmount(10); // Reset bet amount
        setBetPlaced(false); // Add this line
        dealCards();
    };



    useEffect(() => {
        if (playerHand.length > 0 && dealerHand.length > 0 && !gameOver) {
            const playerScore = handValue(playerHand);
            const dealerUpCard = cardValue(dealerHand[0]);

            if (playerScore === 21) {
                setOptimalMove("Blackjack! Stand.");
            } else if (playerScore >= 17) {
                setOptimalMove("Stand.");
            } else if (playerScore <= 11) {
                setOptimalMove("Hit.");
            } else if (playerScore === 12) {
                setOptimalMove(dealerUpCard >= 4 && dealerUpCard <= 6 ? "Stand." : "Hit.");
            } else {
                setOptimalMove(dealerUpCard <= 6 ? "Stand." : "Hit.");
            }
        } else {
            setOptimalMove("");
        }
    }, [playerHand, dealerHand, gameOver]);

    return (
        <Center className={styles.background}>
            <Box className={styles.overlay} />
            <VStack className={styles.container} spacing={6}>
                {!betPlaced && (
                    <HStack>
                        <Input
                            type="number"
                            placeholder="Enter bet amount"
                            value={betAmount}
                            onChange={(e) => setBetAmount(parseInt(e.target.value))}
                            min={1}
                            max={balance}
                            className={styles.betInput}
                        />
                        <Button className={styles.button} onClick={() => placeBet(betAmount)}>Place Bet</Button>
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
                        <MenuButton as={Button} rightIcon={<ExpandMoreIcon />}>
                            {`Running Count: ${runningCount}`}
                        </MenuButton>
                        <MenuList>
                            <MenuItem>Hit</MenuItem>
                            <MenuItem>Stand</MenuItem>
                            <MenuItem>Double Down</MenuItem>
                            <MenuItem>Split</MenuItem>
                            <MenuItem>Surrender</MenuItem>
                        </MenuList>
                    </Menu>
                </HStack>
                <Text fontSize="4xl" fontWeight="bold" color="white">Dealer's Hand</Text>
                <HStack>
                    {dealerHand.map((card, index) => (
                        <Box
                            key={index}
                            border="1px solid"
                            borderRadius="md"
                            p="2"
                            borderColor="gray.300"
                            bg="white"
                            color="black.800"
                        >
                            <Text>{index === 0 && !gameOver ? "Hidden" : card.rank}</Text>
                            <Text>{index === 0 && !gameOver ? "Hidden" : card.suit}</Text>
                        </Box>
                    ))}
                </HStack>
                <Text fontSize="4xl" fontWeight="bold" color="white">Your Hand</Text>
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
                        >
                            <Text>{card.rank}</Text>
                            <Text>{card.suit}</Text>
                        </Box>
                    ))}
                </HStack>
                <Text fontSize="2xl" fontWeight="bold" color="white">Your Total: {handValue(playerHand)}</Text>
                <HStack spacing={4}>
                    <Button className="button" onClick={hit} isDisabled={!betPlaced || gameOver}>
                        Hit
                    </Button>
                    <Button className="button" onClick={stand} isDisabled={!betPlaced || gameOver}>
                        Stand
                    </Button>
                    <Button className="button" onClick={doubleDown} isDisabled={!betPlaced || gameOver}>
                        Double Down
                    </Button>
                    <Button className="button" onClick={split} isDisabled={!betPlaced || gameOver || !canSplit()}>
                        Split
                    </Button>
                    <Button className="button" onClick={surrender} isDisabled={!betPlaced || gameOver}>
                        Surrender
                    </Button>
                </HStack>
                {gameOver && (
                    <VStack>
                        <Text fontSize="2xl" fontWeight="bold" color="white">{gameMessage}</Text>
                        <Button className={styles.button} onClick={startNewGame}>Play Again</Button>
                    </VStack>
                )}
                <Text fontSize="xl" fontWeight="bold" color="white">Balance: ${balance}</Text>
            </VStack>
        </Center>
    );
};

export default BlackJackComp;
