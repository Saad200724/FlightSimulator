import { useRef, useEffect, useState } from "react";
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
  startEngine = 'startEngine',
  shutdownEngine = 'shutdownEngine',
  reset = 'reset'
}

export default function Aircraft({ aircraftType }: AircraftProps) {
  const aircraftRef = useRef<THREE.Group>(null);
  const propellerRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const [subscribe, getControls] = useKeyboardControls<Controls>();
  const [prevEngineKeys, setPrevEngineKeys] = useState({ startEngine: false, shutdownEngine: false });
  
  const {
    position,
    rotation,
    velocity,
    throttle,
    fuel,
    weatherSystem,
    engineSystem,
    engineState,
    setPosition,
    setRotation,
    setVelocity,
    setThrottle,
    setFuel,
    setAltitude,
    setSpeed,
    setHeading,
    setVerticalSpeed,
    startEngine,
    shutdownEngine
  } = useFlightSimulator();

  const aircraft = aircraftData[aircraftType];

  useEffect(() => {
    // Initialize aircraft position
    if (aircraftRef.current) {
      aircraftRef.current.position.set(position.x, position.y, position.z);
      aircraftRef.current.rotation.set(rotation.x, rotation.y, rotation.z);
    }
  }, []);

  // Edge-triggered engine controls
  useEffect(() => {
    const unsubscribe = subscribe(
      (state) => ({ startEngine: state.startEngine, shutdownEngine: state.shutdownEngine }),
      (current) => {
        // Detect rising edge (key press)
        if (current.startEngine && !prevEngineKeys.startEngine) {
          console.log("Engine start key pressed");
          startEngine();
        }
        if (current.shutdownEngine && !prevEngineKeys.shutdownEngine) {
          console.log("Engine shutdown key pressed");
          shutdownEngine();
        }
        setPrevEngineKeys(current);
      }
    );
    
    return unsubscribe;
  }, [subscribe, prevEngineKeys.startEngine, prevEngineKeys.shutdownEngine, startEngine, shutdownEngine]);

  useFrame((state, delta) => {
    if (!aircraftRef.current) return;

    // Animate propeller based on engine RPM
    if (propellerRef.current) {
      if (engineState.isRunning || engineState.startupSequenceActive) {
        const propellerSpeed = (engineState.rpm / 2700) * 30; // Max 30 rad/s
        propellerRef.current.rotation.z = state.clock.elapsedTime * propellerSpeed;
      } else {
        propellerRef.current.rotation.z = 0;
      }
    }

    const controls = getControls();
    
    // Engine controls are now handled in useEffect with edge-triggering
    
    // Handle throttle controls (only if engine is running)
    let newThrottle = throttle;
    if (engineState.isRunning && !engineState.failed) {
      if (controls.throttleUp) {
        newThrottle = Math.min(1, throttle + delta * 2);
        console.log("Throttle up:", newThrottle);
      }
      if (controls.throttleDown) {
        newThrottle = Math.max(0, throttle - delta * 2);
        console.log("Throttle down:", newThrottle);
      }
    } else {
      // Engine not running, throttle goes to idle
      newThrottle = 0;
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

    // Update engine system
    const updatedEngineState = engineSystem.update(delta, newThrottle, position.y);
    
    // Only apply thrust if engine is running and not failed
    const effectiveThrottle = (updatedEngineState.isRunning && !updatedEngineState.failed) ? newThrottle : 0;
    
    // Update physics with weather effects
    const newState = updatePhysics({
      position,
      rotation,
      velocity,
      throttle: effectiveThrottle,
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
    
    // Update engine state in store
    useFlightSimulator.setState({ 
      engineState: updatedEngineState,
      systemFailures: engineSystem.getFailures() 
    });
    
    // Update HUD values
    setAltitude(newState.position.y * 3.28084); // Convert meters to feet
    setSpeed(Math.sqrt(newState.velocity.x ** 2 + newState.velocity.z ** 2)); // Ground speed (horizontal only)
    setHeading((newState.rotation.y * 180 / Math.PI + 360) % 360);
    setVerticalSpeed(newState.velocity.y * 196.85); // Convert to feet per minute

    // Ground collision
    if (newState.position.y < 2) {
      console.log("Ground collision!");
      setPosition({ ...newState.position, y: 2 });
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
