import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { useFlightSimulator } from "../lib/stores/useFlightSimulator";
import { updatePhysics } from "../lib/physics";
import { aircraftData } from "../lib/aircraftData";

interface AircraftProps {
  aircraftType: string;
}

enum Controls {
  throttleUp = 'throttleUp',
  throttleDown = 'throttleDown',
  pitchUp = 'pitchUp',
  pitchDown = 'pitchDown',
  yawLeft = 'yawLeft',
  yawRight = 'yawRight',
  rollLeft = 'rollLeft',
  rollRight = 'rollRight',
  reset = 'reset'
}

export default function Aircraft({ aircraftType }: AircraftProps) {
  const aircraftRef = useRef<THREE.Group>(null);
  const propellerRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const [, getControls] = useKeyboardControls<Controls>();
  
  const {
    position,
    rotation,
    velocity,
    throttle,
    fuel,
    weatherSystem,
    setPosition,
    setRotation,
    setVelocity,
    setThrottle,
    setFuel,
    setAltitude,
    setSpeed,
    setHeading
  } = useFlightSimulator();

  const aircraft = aircraftData[aircraftType];

  useEffect(() => {
    // Initialize aircraft position
    if (aircraftRef.current) {
      aircraftRef.current.position.set(position.x, position.y, position.z);
      aircraftRef.current.rotation.set(rotation.x, rotation.y, rotation.z);
    }
  }, []);

  useFrame((state, delta) => {
    if (!aircraftRef.current) return;

    // Animate propeller
    if (propellerRef.current) {
      propellerRef.current.rotation.z = state.clock.elapsedTime * 20;
    }

    const controls = getControls();
    
    // Handle controls
    let newThrottle = throttle;
    if (controls.throttleUp) {
      newThrottle = Math.min(1, throttle + delta * 2);
      console.log("Throttle up:", newThrottle);
    }
    if (controls.throttleDown) {
      newThrottle = Math.max(0, throttle - delta * 2);
      console.log("Throttle down:", newThrottle);
    }
    setThrottle(newThrottle);

    // Reset aircraft
    if (controls.reset) {
      console.log("Resetting aircraft");
      setPosition({ x: 0, y: 10, z: 0 });
      setRotation({ x: 0, y: 0, z: 0 });
      setVelocity({ x: 0, y: 0, z: 0 });
      setThrottle(0);
      setFuel(100);
      return;
    }

    // Get weather effects for current altitude
    const weatherEffects = weatherSystem.getEffects(position.y, delta);

    // Update physics with weather effects
    const newState = updatePhysics({
      position,
      rotation,
      velocity,
      throttle: newThrottle,
      fuel,
      controls,
      aircraft,
      delta,
      weatherEffects
    });

    // Update aircraft transform
    aircraftRef.current.position.set(newState.position.x, newState.position.y, newState.position.z);
    aircraftRef.current.rotation.set(newState.rotation.x, newState.rotation.y, newState.rotation.z);

    // Update store
    setPosition(newState.position);
    setRotation(newState.rotation);
    setVelocity(newState.velocity);
    setFuel(newState.fuel);
    
    // Update HUD values
    setAltitude(newState.position.y);
    setSpeed(Math.sqrt(newState.velocity.x ** 2 + newState.velocity.y ** 2 + newState.velocity.z ** 2));
    setHeading((newState.rotation.y * 180 / Math.PI + 360) % 360);

    // Ground collision
    if (newState.position.y < 1) {
      console.log("Ground collision!");
      setPosition({ ...newState.position, y: 1 });
      setVelocity({ x: 0, y: 0, z: 0 });
    }
  });

  // Create aircraft mesh based on type
  const renderAircraft = () => {
    const color = aircraft.color;
    
    return (
      <group>
        {/* Fuselage */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.5, 4, 8]} />
          <meshPhongMaterial color={color} />
        </mesh>
        
        {/* Wings */}
        <mesh position={[0, -0.2, 0]} rotation={[0, 0, 0]} castShadow>
          <boxGeometry args={[8, 0.2, 1.5]} />
          <meshPhongMaterial color={color} />
        </mesh>
        
        {/* Tail */}
        <mesh position={[0, 0.5, -1.8]} castShadow>
          <boxGeometry args={[0.2, 1.5, 0.8]} />
          <meshPhongMaterial color={color} />
        </mesh>
        
        {/* Horizontal stabilizer */}
        <mesh position={[0, 0, -1.8]} castShadow>
          <boxGeometry args={[3, 0.2, 0.6]} />
          <meshPhongMaterial color={color} />
        </mesh>
        
        {/* Propeller (simple spinning effect) */}
        <mesh position={[0, 0, 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
          <meshPhongMaterial color="#333333" />
        </mesh>
        
        {/* Propeller blades */}
        <mesh ref={propellerRef} position={[0, 0, 2.1]}>
          <boxGeometry args={[3, 0.1, 0.05]} />
          <meshPhongMaterial color="#222222" />
        </mesh>
      </group>
    );
  };

  return (
    <group ref={aircraftRef}>
      {renderAircraft()}
    </group>
  );
}
