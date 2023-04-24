import React, { useState, Suspense } from 'react';
import { Canvas } from 'react-three-fiber';
import { Box } from '@chakra-ui/react';
import { useTexture } from '@react-three/drei';

const X = () => {
  const texture = useTexture('/textures/x.png');
  return (
    <mesh>
      <planeBufferGeometry args={[0.9, 0.9]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
};

const O = () => {
  const texture = useTexture('/textures/o.png');
  return (
    <mesh>
      <planeBufferGeometry args={[0.9, 0.9]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
};

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  const handleClick = (index) => {
    if (board[index] || calculateWinner(board)) return;
    const newBoard = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  // Add a function to calculate the winner here

  return (
    <Box width="100%" height="100%" position="relative">
      <Canvas>
        <Suspense fallback={null}>
          {board.map((cell, index) => {
            const x = (index % 3) - 1;
            const y = -Math.floor(index / 3) + 1;

            return (
              <group
                key={index}
                position={[x, y, 0]}
                onClick={() => handleClick(index)}
              >
                {cell === 'X' && <X />}
                {cell === 'O' && <O />}
              </group>
            );
          })}
        </Suspense>
      </Canvas>
    </Box>
  );
};

export default TicTacToe;
