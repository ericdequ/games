import React, { useState, useRef, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { useSpring, a } from "react-spring/three";
import * as THREE from "three";
import "./Snake3D.css";

const Snake = ({ position, direction }) => {
  const mesh = useRef();
  useFrame(() => {
    mesh.current.position.set(...position);
    mesh.current.lookAt(new THREE.Vector3(...direction));
  });

  return (
    <a.mesh ref={mesh} position={position}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color="lime" />
    </a.mesh>
  );
};

const Food = ({ position }) => (
  <mesh position={position}>
    <sphereBufferGeometry attach="geometry" args={[0.5, 32, 32]} />
    <meshStandardMaterial attach="material" color="red" />
  </mesh>
);

const createRandomPosition = () => [
  Math.floor(Math.random() * 20 - 10),
  Math.floor(Math.random() * 20 - 10),
  Math.floor(Math.random() * 20 - 10),
];

const Snake3D = () => {
  const [snake, setSnake] = useState([{ position: [0, 0, 0], direction: [1, 0, 0] }]);
  const [foodPosition, setFoodPosition] = useState(createRandomPosition());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const moveSnake = useCallback(() => {
    const newHead = {
      position: [
        snake[0].position[0] + snake[0].direction[0],
        snake[0].position[1] + snake[0].direction[1],
        snake[0].position[2] + snake[0].direction[2],
      ],
      direction: [...snake[0].direction],
    };

    setSnake((prevSnake) => [newHead, ...prevSnake.slice(0, prevSnake.length - 1)]);
  }, [snake]);

  const handleKeyDown = useCallback(
    (event) => {
      let newDirection;
      switch (event.key) {
        case "ArrowUp":
          newDirection = [0, 1, 0];
          break;
        case "ArrowDown":
          newDirection = [0, -1, 0];
          break;
        case "ArrowLeft":
          newDirection = [-1, 0, 0];
          break;
        case "ArrowRight":
          newDirection = [1, 0, 0];
          break;
        default:
          return;
      }

      setSnake((prevSnake) => [
        { ...prevSnake[0], direction: newDirection },
        ...prevSnake.slice(1),
      ]);
    },
    [snake]
  );

  const checkCollision = useCallback(() => {
    const head = snake[0].position;

    if (
      head[0] < -10 ||
      head[0] > 10 ||
      head[1] < -10 ||
      head[1] > 10 ||
      head[2] < -10 ||
      head[2] > 10
    ) {
      setGameOver(true);
      return;
    }

    for (let i = 1; i < snake.length; i++) {
      if (
        head[0] === snake[i].position[0] &&
        head[1] === snake[i].position[1] &&
        head[2] === snake[i].position[2]
      ) {
        setGameOver(true);
        return;
      }
    }
    
    if (
      Math.abs(head[0] - foodPosition[0]) <= 1 &&
      Math.abs(head[1] - foodPosition[1]) <= 1 &&
      Math.abs(head[2] - foodPosition[2]) <= 1
    ) {
      setFoodPosition(createRandomPosition());
      setScore((prevScore) => prevScore + 1);
      setSnake((prevSnake) => [...prevSnake, prevSnake[prevSnake.length - 1]]);
    }
}, [snake, foodPosition]);

useEffect(() => {
const interval = setInterval(() => {
if (!gameOver) {
moveSnake();
checkCollision();
}
}, 200);
return () => clearInterval(interval);
}, [moveSnake, checkCollision, gameOver]);

return (
<div className="snake-game" onKeyDown={handleKeyDown} tabIndex={0}>
<Canvas>
<ambientLight intensity={0.5} />
<pointLight position={[10, 10, 10]} />
{snake.map((segment, index) => (
<Snake key={index} position={segment.position} direction={segment.direction} />
))}
<Food position={foodPosition} />
</Canvas>
<div className="score">Score: {score}</div>
{gameOver && <div className="game-over">Game Over!</div>}
</div>
);
};

export default Snake3D;    
