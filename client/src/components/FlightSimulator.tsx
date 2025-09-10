import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import Aircraft from "./Aircraft";
import Terrain from "./Terrain";
import HUD from "./HUD";
import CameraController from "./CameraController";
import WeatherControl from "./WeatherControl";
import { useFlightSimulator } from "../lib/stores/useFlightSimulator";

export default function FlightSimulator() {
  const groupRef = useRef<THREE.Group>(null);
  const { selectedAircraft } = useFlightSimulator();

  useFrame((state) => {
    // Update global time for animations
    if (groupRef.current) {
      // Gentle ambient animations can be added here
    }
  });

  return (
    <group ref={groupRef}>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[100, 100, 50]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={1000}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
      
      {/* Terrain */}
      <Terrain />
      
      {/* Aircraft */}
      {selectedAircraft && <Aircraft aircraftType={selectedAircraft} />}
      
      {/* Camera Controller */}
      <CameraController />
      
      {/* HUD Overlay */}
      <HUD />
      
      {/* Weather Control */}
      <WeatherControl />
    </group>
  );
}
