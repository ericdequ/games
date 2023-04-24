import React, { useState, useEffect } from 'react';
import { Box, Grid, Button } from '@chakra-ui/react';
import { Board, generateMineArray } from 'minesweeper';

const Minesweeper = () => {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const mineArray = generateMineArray({
      rows: 8,
      cols: 8,
      mines: 10,
    });
    const newBoard = new Board(mineArray);
    setBoard(newBoard);
  }, []);

  const handleClick = (row, col) => {
    if (!board) return;
    const newBoard = board.openTile(row, col);
    setBoard(newBoard);
  };

  return (
    <Box>
      <Grid templateColumns="repeat(8, 1fr)" gap={1}>
        {board &&
          board.grid.map((row, rowIndex) => {
            return row.map((cell, colIndex) => {
              return (
                <Button
                  key={`${rowIndex}-${colIndex}`}
                  width="40px"
                  height="40px"
                  onClick={() => handleClick(rowIndex, colIndex)}
                  css={`
                    background-color: ${cell.isRevealed
                      ? cell.isMine
                        ? 'red'
                        : '#ddd'
                      : '#eee'};
                    border: 1px solid #bbb;
                    font-weight: bold;
                    font-size: 0.8rem;
                    color: ${cell.isRevealed && cell.isMine
                      ? 'white'
                      : cell.numAdjacentMines > 0
                      ? 'blue'
                      : 'transparent'};
                  `}
                >
                  {cell.isRevealed && !cell.isMine
                    ? cell.numAdjacentMines || ''
                    : ''}
                </Button>
              );
            });
          })}
      </Grid>
    </Box>
  );
};

export default Minesweeper;
