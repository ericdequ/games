import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import { SphereBufferGeometry, MeshStandardMaterial, BoxBufferGeometry } from 'three';

const randomColor = () => {
  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const Ball = ({ position, direction, setBalls }) => {
  const mesh = useRef();
  const [velocity, setVelocity] = useState(direction);

  useFrame(() => {
    const newPosition = [
      mesh.current.position.x + velocity[0],
      mesh.current.position.y + velocity[1],
      mesh.current.position.z + velocity[2],
    ];

    if (Math.abs(newPosition[0]) >= 10 || Math.abs(newPosition[1]) >= 10 || Math.abs(newPosition[2]) >= 10) {
      setBalls((balls) => [...balls, <Ball key={balls.length} position={newPosition} direction={[-velocity[0], -velocity[1], -velocity[2]]} setBalls={setBalls} />]);
      setVelocity([-velocity[0], -velocity[1], -velocity[2]]);
    }

    mesh.current.position.set(...newPosition);
  });

  return (
    <mesh ref={mesh} position={position}>
      <sphereBufferGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={randomColor()} />
    </mesh>
  );
};

const Paddle = () => {
  const [position, setPosition] = useState([0, -9.5, 0]);
  const mesh = useRef();

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition([((event.clientX / window.innerWidth) * 2 - 1) * 10, -9.5, 0]);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <mesh ref={mesh} position={position}>
      <boxBufferGeometry args={[4, 0.5, 0.5]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
};

const BouncingBallsGame = () => {
  const [balls, setBalls] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBalls((prevBalls) => [
        ...prevBalls,
        <Ball key={prevBalls.length} position={[0, 0, 0]} direction={[Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]} setBalls={setBalls} />,
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Paddle />
      {balls}
</Canvas>
);
};

export default BouncingBallsGame;
