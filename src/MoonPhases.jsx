import React from 'react';
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { TextureLoader } from 'three';
import { useRef, useState } from "react";

const createStars = () => {
  const seededRandom = (seed) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  return Array.from({ length: 300 }, (_, i) => ({
    // Use much wider ranges to ensure full coverage
    x: (seededRandom(i) * 40) - 20,     // -20 to 20
    y: (seededRandom(i + 1000) * 20) - 10, // -10 to 10
    size: seededRandom(i + 2000) * 0.015 + 0.002
  }));
};
const staticStars = createStars();

const Stars = () => (
  <group>
    {staticStars.map((star, i) => (
      <mesh key={i} position={[star.x, star.y, -4]}>
        <sphereGeometry args={[star.size, 8, 8]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    ))}
  </group>
);

const Moon = () => {
  const moonRef = useRef();
  const moonTexture = useLoader(TextureLoader, '/src/img/moon_texture.jpg');
  const { size } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [rotationY, setRotationY] = useState(0);

  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    
    // Convert movement to rotation (adjust sensitivity with the divisor)
    const movementX = e.movementX / 100;
    setRotationY(prev => prev + movementX);
  };

  // Update moon rotation
  useFrame(() => {
    moonRef.current.rotation.y = rotationY;
  });

  return (
    <group>
      <ambientLight intensity={0.05} />
      <directionalLight 
        position={[0, 0, 5]} 
        intensity={1.8}
      />
      
      <mesh 
        ref={moonRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
        onPointerMove={handlePointerMove}
      >
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial 
          map={moonTexture}
          metalness={0}
          roughness={1}
        />
      </mesh>
    </group>
  );
};

export function MoonPhases() {
  return (
    <div style={{ height: "300px", marginBottom: "2rem", background: "#000" }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Stars />
        <Moon />
      </Canvas>
    </div>
  );
}