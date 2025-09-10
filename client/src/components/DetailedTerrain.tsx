import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { waypoints, type Waypoint } from "../lib/navigationData";


export default function DetailedTerrain() {
  const grassTexture = useTexture("/textures/grass.png");
  
  // Configure grass texture
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(100, 100);

  // Generate consistent forest patches
  const forestPatches = useMemo(() => {
    const patches = [];
    for (let i = 0; i < 8; i++) {
      const x = (i - 4) * 400 + (i * 123 % 7 - 3) * 50; // Deterministic placement
      const z = (i % 3 - 1) * 600 + (i * 456 % 5 - 2) * 80;
      const size = 75 + (i * 789 % 50);
      patches.push({ x, z, size, treeCount: 20 + (i * 234 % 20) });
    }
    return patches;
  }, []);

  // Generate consistent hills
  const hills = useMemo(() => {
    const hillData = [];
    for (let i = 0; i < 12; i++) {
      const x = (i - 6) * 200 + (i * 345 % 7 - 3) * 80;
      const z = (i % 4 - 2) * 300 + (i * 678 % 5 - 2) * 90;
      const height = 40 + (i * 567 % 60);
      const radius = 60 + (i * 890 % 40);
      hillData.push({ x, z, height, radius });
    }
    return hillData;
  }, []);

  // Create airport runway
  const createAirport = (waypoint: Waypoint) => {
    const [x, y, z] = waypoint.position;
    
    return (
      <group key={waypoint.id} position={[x, y, z]}>
        {/* Main runway */}
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[200, 20]} />
          <meshPhongMaterial color="#333333" />
        </mesh>
        
        {/* Runway markings */}
        <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[180, 2]} />
          <meshPhongMaterial color="#ffffff" />
        </mesh>
        
        {/* Cross runway */}
        <mesh position={[0, 0.1, 50]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[150, 15]} />
          <meshPhongMaterial color="#333333" />
        </mesh>
        
        {/* Terminal building */}
        <mesh position={[30, 10, 0]} castShadow>
          <boxGeometry args={[60, 20, 30]} />
          <meshPhongMaterial color="#e5e5e5" />
        </mesh>
        
        {/* Control tower */}
        <mesh position={[0, 25, 20]} castShadow>
          <cylinderGeometry args={[3, 5, 50]} />
          <meshPhongMaterial color="#ffffff" />
        </mesh>
        
        {/* Airport beacon (red/white rotating light) */}
        <mesh position={[0, 30, 20]}>
          <sphereGeometry args={[1]} />
          <meshPhongMaterial color="#ff0000" emissive="#330000" />
        </mesh>
        
        {/* Parking areas */}
        {Array.from({ length: 4 }, (_, i) => (
          <mesh
            key={i}
            position={[20 + i * 15, 0.1, -30]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[12, 8]} />
            <meshPhongMaterial color="#666666" />
          </mesh>
        ))}
      </group>
    );
  };

  // Create navigation beacon
  const createNavBeacon = (waypoint: Waypoint) => {
    const [x, y, z] = waypoint.position;
    
    return (
      <group key={waypoint.id} position={[x, y, z]}>
        {/* VOR antenna */}
        <mesh position={[0, 15, 0]} castShadow>
          <cylinderGeometry args={[0.5, 1, 30]} />
          <meshPhongMaterial color="#cccccc" />
        </mesh>
        
        {/* Base building */}
        <mesh position={[0, 5, 0]} castShadow>
          <cylinderGeometry args={[8, 10, 10]} />
          <meshPhongMaterial color="#ffffff" />
        </mesh>
        
        {/* Navigation light */}
        <mesh position={[0, 18, 0]}>
          <sphereGeometry args={[2]} />
          <meshPhongMaterial color="#00ff00" emissive="#003300" />
        </mesh>
      </group>
    );
  };

  // Create landmark
  const createLandmark = (waypoint: Waypoint) => {
    const [x, y, z] = waypoint.position;
    
    // Different landmark types based on name
    if (waypoint.name.includes('Bridge')) {
      return (
        <group key={waypoint.id} position={[x, y, z]}>
          {/* Bridge deck */}
          <mesh position={[0, 15, 0]} castShadow>
            <boxGeometry args={[300, 2, 20]} />
            <meshPhongMaterial color="#8B4513" />
          </mesh>
          
          {/* Bridge towers */}
          <mesh position={[-100, 50, 0]} castShadow>
            <boxGeometry args={[8, 100, 8]} />
            <meshPhongMaterial color="#666666" />
          </mesh>
          <mesh position={[100, 50, 0]} castShadow>
            <boxGeometry args={[8, 100, 8]} />
            <meshPhongMaterial color="#666666" />
          </mesh>
          
          {/* Cables */}
          {Array.from({ length: 10 }, (_, i) => (
            <mesh
              key={i}
              position={[-80 + i * 16, 40 - i * 2, 0]}
              rotation={[0, 0, Math.PI / 6]}
            >
              <cylinderGeometry args={[0.2, 0.2, 30]} />
              <meshPhongMaterial color="#333333" />
            </mesh>
          ))}
        </group>
      );
    } else if (waypoint.name.includes('Statue')) {
      return (
        <group key={waypoint.id} position={[x, y, z]}>
          {/* Pedestal */}
          <mesh position={[0, 15, 0]} castShadow>
            <cylinderGeometry args={[20, 25, 30]} />
            <meshPhongMaterial color="#8B7D6B" />
          </mesh>
          
          {/* Statue */}
          <mesh position={[0, 60, 0]} castShadow>
            <cylinderGeometry args={[5, 8, 90]} />
            <meshPhongMaterial color="#478778" />
          </mesh>
          
          {/* Torch */}
          <mesh position={[8, 80, 0]} castShadow>
            <cylinderGeometry args={[2, 1, 15]} />
            <meshPhongMaterial color="#478778" />
          </mesh>
          
          {/* Flame */}
          <mesh position={[8, 90, 0]}>
            <sphereGeometry args={[3]} />
            <meshPhongMaterial color="#FFA500" emissive="#FF4500" />
          </mesh>
        </group>
      );
    } else if (waypoint.name.includes('Park')) {
      return (
        <group key={waypoint.id} position={[x, y, z]}>
          {/* Park area */}
          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[200, 150]} />
            <meshPhongMaterial color="#228B22" />
          </mesh>
          
          {/* Lake */}
          <mesh position={[0, 0.1, 20]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[30]} />
            <meshPhongMaterial color="#4169E1" transparent opacity={0.8} />
          </mesh>
          
          {/* Trees in park */}
          {Array.from({ length: 20 }, (_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            const radius = 40 + (i * 345 % 60);
            const treeX = Math.cos(angle) * radius;
            const treeZ = Math.sin(angle) * radius;
            
            return (
              <group key={i} position={[treeX, 0, treeZ]}>
                <mesh position={[0, 8, 0]} castShadow>
                  <cylinderGeometry args={[0.8, 1.2, 16]} />
                  <meshPhongMaterial color="#8B4513" />
                </mesh>
                <mesh position={[0, 18, 0]} castShadow>
                  <sphereGeometry args={[6]} />
                  <meshPhongMaterial color="#228B22" />
                </mesh>
              </group>
            );
          })}
        </group>
      );
    } else if (waypoint.name.includes('Mountain')) {
      return (
        <group key={waypoint.id} position={[x, y, z]}>
          {/* Mountain peak */}
          <mesh position={[0, 75, 0]} castShadow>
            <coneGeometry args={[80, 150, 8]} />
            <meshPhongMaterial color="#696969" />
          </mesh>
          
          {/* Snow cap */}
          <mesh position={[0, 120, 0]} castShadow>
            <coneGeometry args={[40, 60, 8]} />
            <meshPhongMaterial color="#F8F8FF" />
          </mesh>
          
          {/* Tree line */}
          {Array.from({ length: 30 }, (_, i) => {
            const angle = (i / 30) * Math.PI * 2;
            const radius = 60 + (i * 345 % 20);
            const treeX = Math.cos(angle) * radius;
            const treeZ = Math.sin(angle) * radius;
            
            return (
              <group key={i} position={[treeX, 20, treeZ]}>
                <mesh castShadow>
                  <coneGeometry args={[3, 15]} />
                  <meshPhongMaterial color="#0F5132" />
                </mesh>
              </group>
            );
          })}
        </group>
      );
    }
    
    return null;
  };

  return (
    <group>
      {/* Enhanced ground plane */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4000, 4000]} />
        <meshPhongMaterial map={grassTexture} />
      </mesh>
      
      {/* Hills */}
      {hills.map((hill, index) => (
        <mesh
          key={`hill-${index}`}
          position={[hill.x, hill.height / 2, hill.z]}
          receiveShadow
          castShadow
        >
          <sphereGeometry args={[hill.radius, 16, 8]} />
          <meshPhongMaterial color="#4a5d3a" />
        </mesh>
      ))}
      
      {/* Forest patches */}
      {forestPatches.map((patch, patchIndex) =>
        Array.from({ length: patch.treeCount }, (_, treeIndex) => {
          const angle = (treeIndex / patch.treeCount) * Math.PI * 2 + (treeIndex * 123 % 100) / 100;
          const distance = (treeIndex * 456 % 100) / 100 * patch.size;
          const x = patch.x + Math.cos(angle) * distance;
          const z = patch.z + Math.sin(angle) * distance;
          const treeHeight = 12 + (treeIndex * 789 % 8);
          
          return (
            <group key={`${patchIndex}-${treeIndex}`} position={[x, 0, z]}>
              {/* Trunk */}
              <mesh position={[0, treeHeight / 2, 0]} castShadow>
                <cylinderGeometry args={[0.6, 1, treeHeight]} />
                <meshPhongMaterial color="#8B4513" />
              </mesh>
              
              {/* Leaves */}
              <mesh position={[0, treeHeight + 3, 0]} castShadow>
                <sphereGeometry args={[4 + (treeIndex * 234 % 200) / 100]} />
                <meshPhongMaterial color="#228B22" />
              </mesh>
            </group>
          );
        })
      )}
      
      {/* Rivers and water bodies */}
      <mesh position={[500, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 800]} />
        <meshPhongMaterial color="#4169E1" transparent opacity={0.7} />
      </mesh>
      
      {/* Roads */}
      <mesh position={[0, 0.1, -400]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2000, 15]} />
        <meshPhongMaterial color="#333333" />
      </mesh>
      
      <mesh position={[200, 0.1, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[1500, 12]} />
        <meshPhongMaterial color="#333333" />
      </mesh>
      
      {/* Render waypoints */}
      {waypoints.map((waypoint) => {
        switch (waypoint.type) {
          case 'airport':
            return createAirport(waypoint);
          case 'navigation':
            return createNavBeacon(waypoint);
          case 'landmark':
            return createLandmark(waypoint);
          default:
            return null;
        }
      })}
      
      {/* Enhanced skybox */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[8000, 32, 16]} />
        <meshBasicMaterial 
          color="#87CEEB" 
          side={THREE.BackSide}
          fog={false}
        />
      </mesh>
      
      {/* Clouds */}
{useMemo(() => Array.from({ length: 20 }, (_, i) => {
        const x = (i - 10) * 500 + (i * 432 % 11 - 5) * 100;
        const y = 400 + (i * 567 % 200);
        const z = (i % 5 - 2) * 1000 + (i * 789 % 13 - 6) * 150;
        const scale = 1 + (i * 123 % 100) / 100;
        
        return (
          <mesh
            key={`cloud-${i}`}
            position={[x, y, z]}
            scale={[scale, scale * 0.6, scale]}
          >
            <sphereGeometry args={[40, 8, 6]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>
        );
      }), [])}
    </group>
  );
}