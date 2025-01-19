import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from 'three';
import image01 from './img/moon_texture.jpg';

const createStars = () => {
  const seededRandom = (seed) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  return Array.from({ length: 300 }, (_, i) => ({
    x: (seededRandom(i) * 40) - 20,
    y: (seededRandom(i + 1000) * 20) - 10,
    size: seededRandom(i + 2000) * 0.036 + 0.002
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

const Moon = ({ rotationY, rotationX }) => {
  const moonRef = useRef();
  const moonTexture = useLoader(TextureLoader, image01);

  useFrame(() => {
    moonRef.current.rotation.y = rotationY;
    moonRef.current.rotation.x = rotationX;
  });

  return (
    <group>
      <ambientLight intensity={0.05} />
      <directionalLight position={[0, 0, 5]} intensity={1.8} />
      
      <mesh ref={moonRef}>
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
  const [isDragging, setIsDragging] = useState(false);
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(0);
  const [initialMousePosition, setInitialMousePosition] = useState({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    setInitialMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;

    const movementX = (e.clientX - initialMousePosition.x) / 100;
    const movementY = (e.clientY - initialMousePosition.y) / 100;
    setRotationY(prev => prev + movementX);
    setRotationX(prev => prev + movementY);
    setInitialMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handlePointerDown({ 
      stopPropagation: () => {},
      clientX: touch.clientX, 
      clientY: touch.clientY 
    });
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handlePointerMove({
      clientX: touch.clientX,
      clientY: touch.clientY
    });
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    handlePointerUp();
  };

  return (
    <div
      style={{ 
        height: "300px", 
        marginBottom: "2rem", 
        background: "#000",
        touchAction: 'none' // Disable browser touch handling
      }} 
      onPointerDown={handlePointerDown} 
      onPointerUp={handlePointerUp} 
      onPointerMove={handlePointerMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Stars />
        <Moon rotationY={rotationY} rotationX={rotationX} />
      </Canvas>
    </div>
  );
}