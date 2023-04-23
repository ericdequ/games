import React, { useState } from "react";
import { Box, Grid, Button } from "@chakra-ui/react";

const RouletteBoard = ({ onPlaceBet }) => {
  const [selectedBet, setSelectedBet] = useState(null);

  const handleBetClick = (bet) => {
    setSelectedBet(bet);
  };

  const handlePlaceBet = () => {
    onPlaceBet(selectedBet);
    setSelectedBet(null);
  };

  return (
    <Box>
      <Grid templateColumns="repeat(3, 1fr)">
        <Button
          variant={selectedBet === "Even" ? "solid" : "outline"}
          onClick={() => handleBetClick("Even")}
        >
          Even
        </Button>
        <Button
          variant={selectedBet === "Odd" ? "solid" : "outline"}
          onClick={() => handleBetClick("Odd")}
        >
          Odd
        </Button>
        {/* Add more buttons for other bet types */}
      </Grid>

      <Button mt={4} onClick={handlePlaceBet} disabled={!selectedBet}>
        Place Bet
      </Button>
    </Box>
  );
};

export default RouletteBoard;
