import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import "@fontsource/inter";
import FlightSimulator from "./components/FlightSimulator";
import AircraftSelector from "./components/AircraftSelector";
import EngineDisplay from "./components/EngineDisplay";
import AdvancedInstruments from "./components/AdvancedInstruments";
import NavigationDisplay from "./components/NavigationDisplay";
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
  startEngine = 'startEngine',
  shutdownEngine = 'shutdownEngine',
  cameraSwitch = 'cameraSwitch',
  reset = 'reset'
}

const controls = [
  { name: Controls.throttleUp, keys: ["KeyQ"] },
  { name: Controls.throttleDown, keys: ["KeyE"] },
  { name: Controls.pitchUp, keys: ["KeyK"] },
  { name: Controls.pitchDown, keys: ["KeyI"] },
  { name: Controls.yawLeft, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.yawRight, keys: ["KeyD", "ArrowRight"] },
  { name: Controls.rollLeft, keys: ["KeyJ"] },
  { name: Controls.rollRight, keys: ["KeyL"] },
  { name: Controls.startEngine, keys: ["KeyS"] },
  { name: Controls.shutdownEngine, keys: ["KeyX"] },
  { name: Controls.cameraSwitch, keys: ["KeyC"] },
  { name: Controls.reset, keys: ["KeyR"] },
];

// Check WebGL availability
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2')) || 
           !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function App() {
  const { selectedAircraft, gamePhase } = useFlightSimulator();
  const [showCanvas, setShowCanvas] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const webglAvailable = isWebGLAvailable();
    setWebglSupported(webglAvailable);
    setShowCanvas(true);
    
    if (!webglAvailable) {
      console.warn('WebGL not available - running in fallback mode');
    }
  }, []);
  
  // Headless engine loop for when WebGL is not available
  useEffect(() => {
    if (!webglSupported && gamePhase === 'flying' && selectedAircraft) {
      console.log('Starting headless engine loop');
      
      const headlessLoop = setInterval(() => {
        const state = useFlightSimulator.getState();
        const delta = 1 / 60; // 60 FPS simulation
        
        // Update engine system
        const updatedEngineState = state.engineSystem.update(delta, state.throttle, state.position.y);
        
        // Update store with new engine state
        useFlightSimulator.setState({
          engineState: updatedEngineState,
          systemFailures: state.engineSystem.getFailures()
        });
      }, 16); // ~60 FPS
      
      return () => {
        console.log('Stopping headless engine loop');
        clearInterval(headlessLoop);
      };
    }
  }, [webglSupported, gamePhase, selectedAircraft]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {showCanvas && (
        <KeyboardControls map={controls}>
          {gamePhase === 'selection' && <AircraftSelector />}
          
          {gamePhase === 'flying' && selectedAircraft && (
            <>
              {webglSupported ? (
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
                >
                  <color attach="background" args={["#87CEEB"]} />
                  
                  <Suspense fallback={null}>
                    <FlightSimulator />
                  </Suspense>
                </Canvas>
              ) : (
                <div className="flex items-center justify-center h-full bg-blue-500 text-white">
                  <div className="text-center">
                    <h2 className="text-2xl mb-4">WebGL Not Available</h2>
                    <p>Your browser or environment doesn't support WebGL.</p>
                    <p>Running in fallback mode - Engine controls available below.</p>
                  </div>
                </div>
              )}
              
              {/* DOM UI Overlays */}
              <EngineDisplay />
              <AdvancedInstruments />
              <NavigationDisplay />
            </>
          )}
        </KeyboardControls>
      )}
    </div>
  );
}

export default App;
