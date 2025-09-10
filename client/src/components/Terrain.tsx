import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Terrain() {
  const grassTexture = useTexture("/textures/grass.png");
  
  // Configure texture
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(50, 50);

  return (
    <group>
      {/* Ground plane */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2000, 2000]} />
        <meshPhongMaterial map={grassTexture} />
      </mesh>
      
      {/* Some basic landscape features */}
      {/* Hills */}
      <mesh position={[200, 5, 200]} receiveShadow castShadow>
        <sphereGeometry args={[50, 16, 8]} />
        <meshPhongMaterial color="#4a5d3a" />
      </mesh>
      
      <mesh position={[-300, 8, -150]} receiveShadow castShadow>
        <sphereGeometry args={[60, 16, 8]} />
        <meshPhongMaterial color="#5a6d4a" />
      </mesh>
      
      <mesh position={[400, 12, -300]} receiveShadow castShadow>
        <sphereGeometry args={[80, 16, 8]} />
        <meshPhongMaterial color="#3a4d2a" />
      </mesh>
      
      {/* Simple trees */}
      {Array.from({ length: 20 }, (_, i) => {
        const x = (Math.random() - 0.5) * 1000;
        const z = (Math.random() - 0.5) * 1000;
        return (
          <group key={i} position={[x, 0, z]}>
            {/* Trunk */}
            <mesh position={[0, 5, 0]} castShadow>
              <cylinderGeometry args={[0.5, 0.8, 10]} />
              <meshPhongMaterial color="#8B4513" />
            </mesh>
            {/* Leaves */}
            <mesh position={[0, 12, 0]} castShadow>
              <sphereGeometry args={[4, 8, 6]} />
              <meshPhongMaterial color="#228B22" />
            </mesh>
          </group>
        );
      })}
      
      {/* Skybox simulation with large sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[5000, 32, 16]} />
        <meshBasicMaterial color="#87CEEB" side={THREE.BackSide} />
      </mesh>
    </group>
  );
}
