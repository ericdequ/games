import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import styled from "styled-components";
import * as THREE from "three";

const StyledCanvas = styled(Canvas)`
  width: 100%;
  height: 100vh;
`;

const createEmptyBoard = () => {
    const rows = 6;
    const columns = 7;
    const board = Array.from({ length: rows }, () => Array(columns).fill(0));
    return board;
};

const Sphere = ({ position, color, onClick }) => {
    const meshRef = useRef();

    useFrame(() => {
        meshRef.current.rotation.x += 0.005;
        meshRef.current.rotation.y += 0.005;
    });

    return (
        <mesh position={position} onClick={onClick} ref={meshRef}>
            <sphereGeometry args={[0.45, 32, 32]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
};

const WinnerMessage = styled.h2`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 4rem;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 2px 2px #000000;
`;

const ConnectFour = () => {
    const [board, setBoard] = useState(createEmptyBoard());
    const [player, setPlayer] = useState(1);
    const [isGameOver, setIsGameOver] = useState(false);
    const [winningPlayer, setWinningPlayer] = useState(null);

    const handleColumnClick = (columnIndex) => {
        const rowIndex = checkColumn(columnIndex);
        if (rowIndex !== null) {
            const newBoard = [...board];
            newBoard[rowIndex][columnIndex] = player;
            setBoard(newBoard);
            if (checkWin(newBoard, player)) {
                setIsGameOver(true);
                setWinningPlayer(player);
            } else if (!checkDraw(newBoard)) {
                setPlayer(player === 1 ? 2 : 1);
            } else {
                setIsGameOver(true);
            }
        }
    };

    const checkColumn = (columnIndex) => {
        for (let rowIndex = board.length - 1; rowIndex >= 0; rowIndex--) {
            if (board[rowIndex][columnIndex] === 0) {
                return rowIndex;
            }
        }
        return null;
    };

    const checkDraw = (board) => {
        return board.every((row) => row.every((cell) => cell !== 0));
    };

    const checkWin = (board, player) => {
        // Check horizontal
        for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
            for (let columnIndex = 0; columnIndex < board[rowIndex].length - 3; columnIndex++) {
                if (
                    board[rowIndex][columnIndex] === player &&
                    board[rowIndex][columnIndex + 1] === player &&
                    board[rowIndex][columnIndex + 2] === player &&
                    board[rowIndex][columnIndex + 3] === player
                ) {
                    return true;
                }
            }
        }

        // Check vertical
        for (let rowIndex = 0; rowIndex < board.length - 3; rowIndex++) {
            for (let columnIndex = 0; columnIndex < board[rowIndex].length; columnIndex++) {
                if (
                    board[rowIndex][columnIndex]
                    === player &&
                    board[rowIndex + 1][columnIndex] === player &&
                    board[rowIndex + 2][columnIndex] === player &&
                    board[rowIndex + 3][columnIndex] === player
                ) {
                    return true;
                }
            }
        }

        // Check diagonal (down-right)
        for (let rowIndex = 0; rowIndex < board.length - 3; rowIndex++) {
            for (let columnIndex = 0; columnIndex < board[rowIndex].length - 3; columnIndex++) {
                if (
                    board[rowIndex][columnIndex] === player &&
                    board[rowIndex + 1][columnIndex + 1] === player &&
                    board[rowIndex + 2][columnIndex + 2] === player &&
                    board[rowIndex + 3][columnIndex + 3] === player
                ) {
                    return true;
                }
            }
        }

        // Check diagonal (up-right)
        for (let rowIndex = 3; rowIndex < board.length; rowIndex++) {
            for (let columnIndex = 0; columnIndex < board[rowIndex].length - 3; columnIndex++) {
                if (
                    board[rowIndex][columnIndex] === player &&
                    board[rowIndex - 1][columnIndex + 1] === player &&
                    board[rowIndex - 2][columnIndex + 2] === player &&
                    board[rowIndex - 3][columnIndex + 3] === player
                ) {
                    return true;
                }
            }
        }

        return false;
    };

    return (
        
            <StyledCanvas>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                {board.map((row, rowIndex) =>
                    row.map((cell, columnIndex) => (
                        <Sphere
                            key={${rowIndex}- ${ columnIndex }}
                position={[columnIndex, rowIndex, 0]}
                color={cell === 0 ? "white" : cell === 1 ? "#ff4747" : "#ffe600"}
                onClick={() => {
                    if (!isGameOver) {
                        handleColumnClick(columnIndex);
                    }
                }}

                ))
                )}  
            </StyledCanvas>
            {isGameOver && (
                <WinnerMessage>{winningPlayer ? Player ${winningPlayer} wins! : "It's a draw!"}</WinnerMessage>
            )}
        
            
    );

};

    export default ConnectFour;  
