import React, { useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

import dynamic from "next/dynamic";
const RouletteWheel = dynamic(() => import("../components/RouletteWheel"), {
  ssr: false,
});

import RouletteBoard from "../components/RouletteBoard";

function App() {
  const [bet, setBet] = useState(null);
  const [winningNumber, setWinningNumber] = useState(null);
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);

  const handlePlaceBet = (selectedBet) => {
    setBet(selectedBet);
  };

  const calculatePayout = (bet, winningNumber) => {
    let payout = 0;
    const number = parseInt(winningNumber, 10);
    const isEven = number % 2 === 0;

    switch (bet) {
      case "Even":
        if (isEven && number !== 0) {
          payout = betAmount * 2;
        }
        break;
      case "Odd":
        if (!isEven && number !== 0) {
          payout = betAmount * 2;
        }
        break;
      // Add logic for other bet types and their odds
      default:
        break;
    }

    return payout;
  };

  const handleStopSpinning = (winningNumber) => {
    setWinningNumber(winningNumber);
    const payout = calculatePayout(bet, winningNumber);
    setBalance((prevBalance) => prevBalance - betAmount + payout);
  };

  return (
    <Box>
      <Flex justifyContent="center" alignItems="center" flexDirection="column">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Roulette Game
        </Text>
        <RouletteWheel onStopSpinning={handleStopSpinning} />
      </Flex>
      <Flex justifyContent="center" alignItems="center" flexDirection="column">
        <Text fontSize="lg" fontWeight="bold" mt={4}>
          Balance: ${balance}
        </Text>
        <RouletteBoard onPlaceBet={handlePlaceBet} />
      </Flex>
    </Box>
  );
}

export default App;
