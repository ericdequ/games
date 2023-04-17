const BestCardAlgo = (validCards, disabledRanks, remainingGuesses, ranks) => {
    // Calculate rank counts for valid cards
    const rankCounts = ranks.reduce((acc, rank) => {
      if (!disabledRanks.includes(rank)) {
        const count = validCards.filter(card => card.rank === rank).length;
        acc[rank] = count;
      }
      return acc;
    }, {});
  
    // Calculate the total number of valid cards
    const totalCount = Object.values(rankCounts).reduce((a, b) => a + b, 0);
  
    // Calculate the probability of each rank
    const rankProbabilities = {};
    for (const rank in rankCounts) {
      rankProbabilities[rank] = rankCounts[rank] / totalCount;
    }
  
    // Calculate the expected value for each rank based on remaining guesses
    const rankExpectedValues = {};
    for (const rank in rankProbabilities) {
      const probability = rankProbabilities[rank];
      const expectedValue = (probability * totalCount) / remainingGuesses;
      rankExpectedValues[rank] = expectedValue;
    }
  
    // Find the rank with the highest expected value
    const bestCardRank = Object.keys(rankExpectedValues).reduce((a, b) =>
      rankExpectedValues[a] > rankExpectedValues[b] ? a : b
    );
  
    return bestCardRank;
  };

  export default BestCardAlgo;