"use client";

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleField() {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Create 200 icosahedron particles
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 200; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40
        ] as [number, number, number],
        color: new THREE.Color().lerpColors(
          new THREE.Color('#6366F1'),
          new THREE.Color('#22D3EE'),
          Math.random()
        )
      });
    }
    return arr;
  }, []);

  // Connection lines between nearby particles
  const lineGeometry = useMemo(() => {
    const positions: number[] = [];
    let count = 0;
    for (let i = 0; i < particles.length && count < 30; i++) {
      for (let j = i + 1; j < particles.length && count < 30; j++) {
        const dx = particles[i].position[0] - particles[j].position[0];
        const dy = particles[i].position[1] - particles[j].position[1];
        const dz = particles[i].position[2] - particles[j].position[2];
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (dist < 5) {
          positions.push(...particles[i].position, ...particles[j].position);
          count++;
        }
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [particles]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0003;
      groupRef.current.rotation.x += 0.0001;
    }
  });

  const { camera } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02;
    camera.position.y += (mouse.y * 1 - camera.position.y) * 0.02;
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <icosahedronGeometry args={[0.08, 0]} />
          <meshBasicMaterial color={p.color} transparent opacity={0.6} />
        </mesh>
      ))}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#6366F1" transparent opacity={0.14} />
      </lineSegments>
    </group>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-[#070A12]">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <ParticleField />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#070A12] pointer-events-none opacity-60" />
    </div>
  );
}
