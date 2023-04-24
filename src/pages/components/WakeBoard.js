import React, { useState, useEffect } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import { BoxBufferGeometry, MeshStandardMaterial, PlaneBufferGeometry } from 'three';
import { Box, ChakraProvider, extendTheme, Button  } from '@chakra-ui/react';

const Wakeboarder = (props) => {
  const [position, setPosition] = useState([-4, 0.5, 0]);
  const mesh = React.useRef();

  useFrame(() => {
    setPosition((prev) => [prev[0] + 0.05, prev[1], prev[2]]);
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === ' ') {
        setPosition((prev) => [prev[0], 2, prev[2]]);
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === ' ') {
        setPosition((prev) => [prev[0], 0.5, prev[2]]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <mesh ref={mesh} position={position} {...props}>
      <boxBufferGeometry args={[0.5, 1, 0.5]} />
      <meshStandardMaterial color={'blue'} />
    </mesh>
  );
};

const Ramp = (props) => {
  return (
    <mesh position={props.position} rotation={props.rotation}>
      <boxBufferGeometry args={[2, 0.5, 4]} />
      <meshStandardMaterial color={'green'} />
    </mesh>
  );
};

const Ground = () => {
  return (
    <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry args={[20, 20]} />
      <meshStandardMaterial color={'lightblue'} />
    </mesh>
  );
};

const WakeboardGame = () => {
    const [gameStarted, setGameStarted] = useState(false);
  
    const handleStartGame = () => {
      setGameStarted(true);
    };
  
    return (
      <ChakraProvider>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh" width="100%">
          <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Ground />
            {gameStarted && <Wakeboarder />}
            {/* Add more ramps, obstacles, and features as needed */}
            {gameStarted &&
              ramps.map((ramp, index) => <Ramp key={index} position={ramp.position} rotation={ramp.rotation} />)}
          </Canvas>
          {!gameStarted && (
            <Box position="absolute" zIndex="10">
              <Button variant="contained" color="primary" onClick={handleStartGame}>
                Start Wakeboard Game
              </Button>
            </Box>
          )}
        </Box>
      </ChakraProvider>
    );
  };
  
  export default WakeboardGame;
