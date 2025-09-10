import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { WeatherSystem, WeatherConditions } from "../weatherSystem";

export type GamePhase = "selection" | "flying";
export type CameraMode = "chase" | "cockpit" | "free";

interface Vector3 {
  x: number;
  y: number;
  z: number;
}

interface FlightSimulatorState {
  // Game state
  gamePhase: GamePhase;
  selectedAircraft: string | null;
  
  // Aircraft state
  position: Vector3;
  rotation: Vector3;
  velocity: Vector3;
  throttle: number;
  fuel: number;
  
  // Camera
  cameraMode: CameraMode;
  
  // HUD data
  altitude: number;
  speed: number;
  heading: number;
  verticalSpeed: number;
  
  // Weather system
  weatherSystem: WeatherSystem;
  weatherConditions: WeatherConditions;
  
  // Actions
  setGamePhase: (phase: GamePhase) => void;
  setSelectedAircraft: (aircraft: string) => void;
  setPosition: (position: Vector3) => void;
  setRotation: (rotation: Vector3) => void;
  setVelocity: (velocity: Vector3) => void;
  setThrottle: (throttle: number) => void;
  setFuel: (fuel: number) => void;
  setCameraMode: (mode: CameraMode) => void;
  setAltitude: (altitude: number) => void;
  setSpeed: (speed: number) => void;
  setHeading: (heading: number) => void;
  setVerticalSpeed: (verticalSpeed: number) => void;
  setWeatherConditions: (conditions: WeatherConditions) => void;
  reset: () => void;
}

export const useFlightSimulator = create<FlightSimulatorState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    gamePhase: "selection",
    selectedAircraft: null,
    
    position: { x: 0, y: 10, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    throttle: 0,
    fuel: 100,
    
    cameraMode: "chase",
    
    altitude: 32.8084, // 10 meters in feet
    speed: 0,
    heading: 0,
    verticalSpeed: 0,
    
    // Weather system initialization
    weatherSystem: new WeatherSystem(),
    weatherConditions: WeatherSystem.getCalmWeather(),
    
    // Actions
    setGamePhase: (phase) => set({ gamePhase: phase }),
    setSelectedAircraft: (aircraft) => set({ selectedAircraft: aircraft }),
    setPosition: (position) => set({ position }),
    setRotation: (rotation) => set({ rotation }),
    setVelocity: (velocity) => set({ velocity }),
    setThrottle: (throttle) => set({ throttle }),
    setFuel: (fuel) => set({ fuel }),
    setCameraMode: (mode) => set({ cameraMode: mode }),
    setAltitude: (altitude) => set({ altitude }),
    setSpeed: (speed) => set({ speed }),
    setHeading: (heading) => set({ heading }),
    setVerticalSpeed: (verticalSpeed) => set({ verticalSpeed }),
    setWeatherConditions: (conditions) => set((state) => {
      state.weatherSystem.updateConditions(conditions);
      return { weatherConditions: state.weatherSystem.getConditions() };
    }),
    
    reset: () => set({
      position: { x: 0, y: 10, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      throttle: 0,
      fuel: 100,
      altitude: 32.8084, // 10 meters in feet
      speed: 0,
      heading: 0,
      verticalSpeed: 0
    })
  }))
);
