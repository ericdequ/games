import React, { useState, useEffect } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import { SphereBufferGeometry, MeshStandardMaterial } from 'three';

const TrippySphere = ({ radius, position, color }) => {
  const mesh = React.useRef();

  useFrame(({ clock }) => {
    mesh.current.position.x = position[0] + Math.sin(clock.elapsedTime * 0.5) * 2;
    mesh.current.position.y = position[1] + Math.cos(clock.elapsedTime * 0.5) * 2;
    mesh.current.position.z = position[2] + Math.sin(clock.elapsedTime * 0.3) * 2;
    mesh.current.rotation.x = clock.elapsedTime * 0.5;
    mesh.current.rotation.y = clock.elapsedTime * 0.5;
    mesh.current.material.color.set(color);
  });

  return (
    <mesh ref={mesh} position={position}>
      <sphereBufferGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const TrippySwirl = () => {
  const [color, setColor] = useState('#ff0000');
  const [position, setPosition] = useState([0, 0, 0]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition([(event.clientX / window.innerWidth) * 10 - 5, -((event.clientY / window.innerHeight) * 10 - 5), 0]);
      setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <TrippySphere radius={1} position={position} color={color} />
    </Canvas>
  );
};

export default TrippySwirl;
