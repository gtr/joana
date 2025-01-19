import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

const TexturePreloader = ({ images }) => {
  images.forEach(image => {
    useLoader(TextureLoader, image.src);
  });
  return null;
};

const FramedImage = ({ texture, rotationX, rotationY }) => {
  const meshRef = useRef();
  
  const imageWidth = texture.image.width;
  const imageHeight = texture.image.height;
  const aspect = imageWidth / imageHeight;
  
  // Calculate max dimension based on viewport width
  const maxDimension = window.innerWidth < 900 ? 3 : 4.5;
  
  let width, height;
  if (aspect >= 1) {
    width = maxDimension;
    height = maxDimension / aspect;
  } else {
    height = maxDimension;
    width = maxDimension * aspect;
  }
  
  if (window.innerWidth < 900 && aspect > 1.5) {
    const scale = 1.5 / aspect;
    width *= scale;
    height *= scale;
  }
  
  const frameThickness = 0.08;
  const frameWidth = width + frameThickness * 2;
  const frameHeight = height + frameThickness * 2;
  const frameDepth = 0.2;
  
  const goldMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xE0BC1F,
    metalness: 0.2,
    roughness: 0.2,
    reflectivity: 0.6,
    clearcoat: 0.9,
    clearcoatRoughness: 0.1,
  });

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = rotationX;
      meshRef.current.rotation.y = rotationY;
    }
  });

  return (
    <group ref={meshRef}>
      <mesh position={[0, 0, -frameDepth]} material={goldMaterial}>
        <boxGeometry args={[frameWidth, frameHeight, frameDepth/2]} />
      </mesh>
      
      <mesh position={[-frameWidth/2, 0, -frameDepth/4]} material={goldMaterial}>
        <boxGeometry args={[frameThickness, frameHeight, frameDepth]} />
      </mesh>
      <mesh position={[frameWidth/2, 0, -frameDepth/4]} material={goldMaterial}>
        <boxGeometry args={[frameThickness, frameHeight, frameDepth]} />
      </mesh>
      <mesh position={[0, -frameHeight/2, -frameDepth/4]} material={goldMaterial}>
        <boxGeometry args={[frameWidth, frameThickness, frameDepth]} />
      </mesh>
      <mesh position={[0, frameHeight/2, -frameDepth/4]} material={goldMaterial}>
        <boxGeometry args={[frameWidth, frameThickness, frameDepth]} />
      </mesh>
      
      <mesh position={[0, 0, 0.001]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial 
          map={texture}
          side={THREE.FrontSide}
          transparent={true}
          depthWrite={true}
          depthTest={true}
        />
      </mesh>
    </group>
  );
};

const Gallery = ({ images, currentIndex }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(0);
  const [initialMousePosition, setInitialMousePosition] = useState({ x: 0, y: 0 });
  
  const texture = useLoader(TextureLoader, images[currentIndex].src);

  const handlePointerDown = (e) => {
    e.preventDefault();
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
    
    const newRotationY = rotationY + movementX;
    const newRotationX = rotationX + movementY;
    
    if (newRotationX >= -Math.PI/6 && newRotationX <= Math.PI/6) {
      setRotationX(newRotationX);
    }
    
    if (newRotationY >= -Math.PI/6 && newRotationY <= Math.PI/6) {
      setRotationY(newRotationY);
    }
    
    setInitialMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handlePointerDown({ 
      preventDefault: () => {},
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
        width: '100%', 
        height: '80vh',
        touchAction: 'none'
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <TexturePreloader images={images} />
          <ambientLight intensity={0.7} />
          <spotLight 
            position={[10, 10, 10]} 
            angle={0.5} 
            penumbra={1} 
            intensity={1} 
            castShadow 
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <pointLight position={[0, 0, 5]} intensity={0.5} />
          <FramedImage 
            texture={texture}
            rotationX={rotationX}
            rotationY={rotationY}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Gallery;