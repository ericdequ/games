import React, { useState, useRef, useCallback } from "react";
import { Canvas, useFrame, useThree } from "react-three-fiber";
import { useSpring, a } from "react-spring/three";
import * as THREE from "three";

const Snake = ({ position, direction }) => {
    const mesh = useRef();
    useFrame(() => {
      mesh.current.position.set(...position);
      mesh.current.lookAt(new THREE.Vector3(...direction));
    });
  
    return (
      <a.mesh ref={mesh} position={position}>
        <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
        <meshStandardMaterial attach="material" color="green" />
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
  