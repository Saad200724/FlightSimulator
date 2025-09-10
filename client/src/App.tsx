import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import "@fontsource/inter";
import FlightSimulator from "./components/FlightSimulator";
import AircraftSelector from "./components/AircraftSelector";
import { useFlightSimulator } from "./lib/stores/useFlightSimulator";

// Define control keys for the flight simulator
enum Controls {
  throttleUp = 'throttleUp',
  throttleDown = 'throttleDown',
  pitchUp = 'pitchUp',
  pitchDown = 'pitchDown',
  yawLeft = 'yawLeft',
  yawRight = 'yawRight',
  rollLeft = 'rollLeft',
  rollRight = 'rollRight',
  cameraSwitch = 'cameraSwitch',
  reset = 'reset'
}

const controls = [
  { name: Controls.throttleUp, keys: ["KeyW", "ArrowUp"] },
  { name: Controls.throttleDown, keys: ["KeyS", "ArrowDown"] },
  { name: Controls.pitchUp, keys: ["KeyK"] },
  { name: Controls.pitchDown, keys: ["KeyI"] },
  { name: Controls.yawLeft, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.yawRight, keys: ["KeyD", "ArrowRight"] },
  { name: Controls.rollLeft, keys: ["KeyJ"] },
  { name: Controls.rollRight, keys: ["KeyL"] },
  { name: Controls.cameraSwitch, keys: ["KeyC"] },
  { name: Controls.reset, keys: ["KeyR"] },
];

function App() {
  const { selectedAircraft, gamePhase } = useFlightSimulator();
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    setShowCanvas(true);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {showCanvas && (
        <KeyboardControls map={controls}>
          {gamePhase === 'selection' && <AircraftSelector />}
          
          {gamePhase === 'flying' && selectedAircraft && (
            <Canvas
              shadows
              camera={{
                position: [0, 5, 10],
                fov: 75,
                near: 0.1,
                far: 10000
              }}
              gl={{
                antialias: true,
                powerPreference: "high-performance",
                failIfMajorPerformanceCaveat: false
              }}
              onCreated={({ gl }) => {
                console.log("WebGL context created:", gl.getContext());
              }}
              fallback={
                <div className="flex items-center justify-center h-full bg-blue-500 text-white">
                  <div className="text-center">
                    <h2 className="text-2xl mb-4">WebGL Not Available</h2>
                    <p>Your browser or environment doesn't support WebGL.</p>
                    <p>The flight simulator requires WebGL to run.</p>
                  </div>
                </div>
              }
            >
              <color attach="background" args={["#87CEEB"]} />
              
              <Suspense fallback={null}>
                <FlightSimulator />
              </Suspense>
            </Canvas>
          )}
        </KeyboardControls>
      )}
    </div>
  );
}

export default App;
