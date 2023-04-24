import React, { useState, useEffect } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import { BoxBufferGeometry, MeshStandardMaterial, SphereBufferGeometry } from 'three';

const Cube = (props) => {
  const [position, setPosition] = useState([0, -1.5, 0]);
  const mesh = React.useRef();

  useFrame(() => {
    setPosition([position[0], position[1], position[2] + 0.01]);
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        setPosition([position[0] - 0.5, position[1], position[2]]);
      } else if (event.key === 'ArrowRight') {
        setPosition([position[0] + 0.5, position[1], position[2]]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [position]);

  return (
    <mesh ref={mesh} position={position} {...props}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={'orange'} />
    </mesh>
  );
};

const Sphere = (props) => {
  const mesh = React.useRef();
  const [position, setPosition] = useState([Math.random() * 6 - 3, 3, -20]);

  useFrame(() => {
    setPosition([position[0], position[1] - 0.1, position[2] + 0.1]);
  });

  return (
    <mesh ref={mesh} position={position} {...props}>
      <sphereBufferGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={'red'} />
    </mesh>
  );
};

const Game = () => {
  const [spheres, setSpheres] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpheres((prevSpheres) => [...prevSpheres, <Sphere key={prevSpheres.length} />]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Cube />
      {spheres}
    </Canvas>
  );
};

export default Game;
